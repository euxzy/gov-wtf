import { Icon } from '@iconify/react'
import { Rating, RatingButton } from '~/components/ui/rating'
import { Separator } from '~/components/ui/separator'
import type { Functionary } from '~/db/schema'

type PersonCardProps = Functionary

export const PersonCard = ({ name, photo }: PersonCardProps) => {
  return (
    <div className="border p-2 rounded-md md:p-4">
      <div className="mb-3 relative">
        <div className="relative aspect-4/5 mb-3 rounded-sm overflow-hidden lg:aspect-7/8">
          <img
            src={`https://imagecdn.app/v1/images/${encodeURIComponent(photo || 'https://placehold.co/400')}`}
            alt={name}
            className="w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-black/80" />

        <div className="absolute start-3 bottom-2 flex items-center gap-2 h-4">
          <div className="flex items-center text-yellow-300 gap-0.5 text-sm md:text-base">
            <Icon icon="material-symbols:star-rounded" />
            <p>5</p>
          </div>

          <Separator orientation="vertical" className="bg-foreground" />

          <p className="text-xs md:text-sm font-medium">1.5K Voters</p>
        </div>
      </div>

      <div>
        <h2 className="font-medium line-clamp-2 mb-2 md:mb-3 md:text-lg lg:mb-4">{name}</h2>

        <div className="flex flex-col items-start gap-3">
          <Rating defaultValue={0}>
            {Array.from({ length: 5 }).map((_, index) => (
              <RatingButton className="text-yellow-500" key={`${index + 0}`} />
            ))}
          </Rating>
        </div>
      </div>
    </div>
  )
}
