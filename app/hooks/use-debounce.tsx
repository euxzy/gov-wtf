import { useEffect, useState } from 'react'

export function useDebounce<T>(value: T, delay: number) {
  const [debounceVal, setDebounceVal] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceVal(() => value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [delay, value])

  return debounceVal
}
