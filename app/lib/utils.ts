import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const cdnImg = (url?: string | null) => {
  return `https://imagecdn.app/v1/images/${encodeURIComponent(url || 'https://placehold.co/400')}`
}
