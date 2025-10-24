import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 基础登录态检测（仅在客户端可用）
export function isLoggedIn(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const hasCookie = document.cookie.split('; ').some((c) => c.startsWith('token='))
    const hasUser = !!localStorage.getItem('user')
    return hasCookie || hasUser
  } catch {
    return false
  }
}
