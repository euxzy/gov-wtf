import { Icon } from '@iconify/react'
import { forwardRef, useState } from 'react'
import { Rating, RatingButton } from '~/components/ui/rating'
import { Separator } from '~/components/ui/separator'
import type { Functionary } from '~/db/schema'
import { Button } from '../ui/button'

type DetailPersonProps = {
  functionary?: Functionary | null
  onClose?: () => void
}

export const DetailPerson = forwardRef<HTMLDivElement, DetailPersonProps>(({ functionary, onClose }, ref) => {
  const [rating, setRating] = useState(0)

  return (
    <div ref={ref} className="fixed inset-0 z-900 flex items-center justify-center invisible px-5 md:px-0">
      <div id="close" className="absolute inset-0" onClick={onClose} />
      <div
        id="detail-person"
        className="relative bg-background p-4 border rounded-md w-full max-w-xl grid grid-cols-2 gap-4"
      >
        <div id="detail-img-container" className="w-full rounded-sm overflow-hidden aspect-4/5">
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
                <p>5</p>
              </div>

              <Separator orientation="vertical" className="bg-foreground" />

              <p className="text-xs md:text-sm font-medium">1.5K Voters</p>
            </div>

            <div className="flex flex-col items-start gap-4 mt-4">
              <Rating defaultValue={rating} value={rating} onValueChange={setRating}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <RatingButton className="text-yellow-500" key={`${index + 0}`} />
                ))}
              </Rating>
              <Button type="button" variant="secondary" size="sm" className="px-5">
                Vote
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
