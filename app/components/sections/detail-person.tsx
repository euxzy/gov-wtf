import { Icon } from '@iconify/react'
import { forwardRef, useEffect, useState } from 'react'
import { Form } from 'react-router'
import { Rating, RatingButton } from '~/components/ui/rating'
import { Separator } from '~/components/ui/separator'
import type { Functionary, Rating as RatingType } from '~/db/schema'
import { useCountRating } from '~/hooks/use-count-rating'
import { useRootLoaderData } from '~/root'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

type DetailPersonProps = {
  functionary?: (Functionary & { ratings: RatingType[] }) | null
  onClose?: () => void
}

export const DetailPerson = forwardRef<HTMLDivElement, DetailPersonProps>(({ functionary, onClose }, ref) => {
  const [rating, setRating] = useState(0)

  const rootData = useRootLoaderData()

  const [ratings, voters, setRatings] = useCountRating()

  useEffect(() => {
    if (!functionary) return
    setRatings(functionary.ratings || [])

    const findVoter = functionary.ratings?.find((r) => r.voterId === rootData?.credentialId)
    setRating(findVoter?.rate || 0)
  }, [functionary, rootData])

  return (
    <div ref={ref} className="fixed inset-0 z-900 flex items-center justify-center invisible px-5 md:px-0">
      <div id="close" className="absolute inset-0" onClick={onClose} />
      <div id="detail-container" className="relative p-4 rounded-md w-full max-w-xl grid grid-cols-2 gap-4">
        <div id="detail-img-container" className="w-full rounded-sm overflow-hidden aspect-4/5 lg:7/8">
          <img id="detail-img" alt="" className="size-full object-cover" />
        </div>

        <div id="detail-content" className="mt-2 flex flex-col justify-center h-full gap-8 opacity-0">
          <div>
            <h1 className="text-2xl font-semibold">{functionary?.name}</h1>
            <p className="text-muted-foreground text-sm">{functionary?.position}</p>
          </div>

          <div>
            <div className="mt-3 flex items-center gap-2 h-4">
              <div className="flex items-center text-yellow-300 gap-0.5 text-sm md:text-base">
                <Icon icon="material-symbols:star-rounded" />
                <p>{ratings}</p>
              </div>

              <Separator orientation="vertical" className="bg-foreground" />

              <p className="text-xs md:text-sm font-medium">{voters} Voters</p>
            </div>

            <div className="flex flex-col items-start gap-4 mt-4">
              <Rating defaultValue={rating} value={rating} onValueChange={setRating}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <RatingButton className="text-yellow-500" key={`${index + 0}`} />
                ))}
              </Rating>
              <Form method="post" action="/api/vote">
                <Input type="hidden" name="functionaryId" value={functionary?.id || ''} />
                <Input type="hidden" name="rating" value={rating} />

                <Button type="submit" variant="secondary" size="sm" className="px-5" disabled={!rating}>
                  Vote
                </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
