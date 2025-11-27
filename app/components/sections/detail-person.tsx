import { Icon } from '@iconify/react'
import { forwardRef, useState } from 'react'
import { Rating, RatingButton } from '~/components/ui/rating'
import { Separator } from '~/components/ui/separator'
import { Button } from '../ui/button'

export const DetailPerson = forwardRef<HTMLDivElement>((_, ref) => {
  const [rating, setRating] = useState(0)

  return (
    <div
      ref={ref}
      id="detail-person"
      className="bg-background/10 fixed inset-0 z-900 flex items-center justify-center backdrop-blur-xs invisible"
    >
      <div id="close" className="absolute inset-0" />
      <div className="relative bg-background p-4 border rounded-md w-full max-w-xl grid grid-cols-2 gap-4">
        <div className="w-full rounded-sm overflow-hidden">
          <img
            src="https://imagecdn.app/v1/images/https%3A%2F%2Fsetkab.go.id%2Fwp-content%2Fuploads%2F2024%2F10%2FPRABOWO-SUBIANTO.jpg"
            alt=""
            className="w-full aspect-4/5 object-cover"
          />
        </div>

        <div className="mt-2 flex flex-col justify-center h-full gap-8">
          <div>
            <h1 className="text-2xl font-semibold">Prabowo Subianto</h1>
            <p className="text-muted-foreground text-sm">Presiden</p>
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
