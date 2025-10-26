import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { ProxyAgent, setGlobalDispatcher } from "undici"

type FortuneRequest = {
  instruction: string
  prompt?: string
}

type GenerateOptions = FortuneRequest & {
  model?: string
}

const DEFAULT_MODEL = "gemini-2.5-flash"

// 全局代理：仅当环境变量存在时启用，避免在无代理环境下导致外呼失败
const proxyUrl =
  process.env.LOCAL_HTTP_PROXY ||
  process.env.HTTPS_PROXY ||
  process.env.HTTP_PROXY ||
  process.env.ALL_PROXY ||
  ""

try {
  if (proxyUrl) {
    setGlobalDispatcher(new ProxyAgent(proxyUrl))
  }
} catch {}

const buildContents = ({ instruction, prompt }: FortuneRequest) => {
  const base = instruction.trim()
  const userPrompt = prompt?.trim()
  if (userPrompt && base) {
    return `${base}

请根据以上指引与资料，回答我的提问：${userPrompt}`
  }
  if (userPrompt) {
    return userPrompt
  }
  return `${base}

请根据以上资料，先用简洁、温暖的语气向用户问候并说明你已准备好解答命理问题。`
}

const createClient = () => {
  const apiKey = process.env.GOOGLE_GENAI_API_KEY || process.env.GOOGLE_API_KEY
  if (!apiKey) {
    throw new Error("Google GenAI API key is not configured. Set GOOGLE_GENAI_API_KEY in your environment.")
  }
  return new GoogleGenerativeAI(apiKey)
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

async function generateWithRetry(client: GoogleGenerativeAI, prompt: string, preferredModel: string) {
  const models = [preferredModel]
  const maxAttempts = 3
  let lastError: any = null

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const modelName = models[Math.min(attempt - 1, models.length - 1)]
    try {
      const model = client.getGenerativeModel({ model: modelName })
      // Soft timeout wrapper (does not cancel underlying request, but bounds our wait)
      const softTimeoutMs = 25000
      const result = await Promise.race([
        model.generateContent(prompt),
        new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), softTimeoutMs)),
      ])
      // @ts-expect-error SDK type
      const reply = result?.response?.text?.() ?? ""
      if (!reply || !reply.trim()) throw new Error("empty_reply")
      return { reply, modelName }
    } catch (err: any) {
      lastError = err
      console.error("fortune-ai attempt failed", { attempt, modelName, message: err?.message })
      // Broken pipe / network issues: short backoff then retry
      if (attempt < maxAttempts) {
        await sleep(800 * attempt)
        continue
      }
    }
  }
  throw lastError ?? new Error("generate_failed")
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateOptions
    if (!body || !body.instruction) {
      return NextResponse.json({ error: "instruction is required" }, { status: 400 })
    }

    const client = createClient()
    const prompt = buildContents(body)
    try {
      const { reply, modelName } = await generateWithRetry(client, prompt, body.model ?? DEFAULT_MODEL)
      return NextResponse.json({ reply, model: modelName })
    } catch (e: any) {
      const msg = e?.message || "AI request failed"
      const isTimeout = msg.includes("timeout")
      const isBrokenPipe = /broken pipe|ECONNRESET|EPIPE|socket|unavailable/i.test(msg)
      const status = isTimeout || isBrokenPipe ? 503 : 500
      console.error("fortune-ai final error", { message: msg })
      return NextResponse.json({ error: `AI 请求失败：${msg}` }, { status })
    }
  } catch (error: any) {
    console.error("fortune-ai error", error)
    return NextResponse.json({ error: error?.message ?? "AI request failed" }, { status: 500 })
  }
}
