import { useMemo, useState } from 'react'
import type { Rating } from '~/db/schema'

export const useCountRating = () => {
  const [ratings, setRatings] = useState<Rating[]>([])

  const voters = useMemo((): string => {
    const count = ratings.length
    const units = [
      { value: 1000000, suffix: 'M' },
      { value: 1000, suffix: 'K' },
    ]

    const suffixIdx = units.findIndex((unit) => count >= unit.value)
    if (suffixIdx !== -1) {
      return `${(count / Number(units[suffixIdx].value)).toFixed(1).replace(/\.0$/, '')}${units[suffixIdx].suffix}`
    }
    return String(count)
  }, [ratings.length])

  const rating = useMemo(() => {
    const total = ratings.reduce((acc, rating) => acc + rating.rate, 0)
    return total === 0 ? 0 : total / ratings.length
  }, [ratings, voters])

  return [rating, voters, setRatings] as const
}
