import { Icon } from '@iconify/react'
import { useEffect } from 'react'
import { Separator } from '~/components/ui/separator'
import type { Functionary, Rating } from '~/db/schema'
import { useCountRating } from '~/hooks/use-count-rating'
import { cdnImg } from '~/lib/utils'

interface PersonCardProps {
  functionary: Functionary & { ratings: Rating[] }
  onClick?: (el: HTMLDivElement) => void
}

export const PersonCard = ({
  onClick,
  functionary: { name, photo, id: functionaryId, position, ratings, createdAt, updatedAt },
}: PersonCardProps) => {
  const [rating, voters, setRatings] = useCountRating()

  useEffect(() => {
    setRatings(ratings)
  }, [ratings])

  return (
    <div
      data-functionary-id={functionaryId}
      data-position={position}
      data-name={name}
      data-photo={photo}
      data-created-at={createdAt}
      data-updated-at={updatedAt}
      data-ratings={JSON.stringify(ratings)}
      className="person-item border p-2 rounded-md select-none cursor-pointer md:p-4"
      onClick={(e) => onClick?.(e.currentTarget)}
    >
      <div className="mb-3 relative">
        <div className="relative aspect-4/5 mb-3 rounded-sm overflow-hidden lg:aspect-7/8">
          <img src={cdnImg(photo)} alt={name} className="w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-linear-to-t from-black/80" />

        <div className="absolute start-3 bottom-2 flex items-center gap-2 h-4">
          <div className="flex items-center text-yellow-300 gap-0.5 text-sm md:text-base">
            <Icon icon="material-symbols:star-rounded" />
            <p>{rating}</p>
          </div>

          <Separator orientation="vertical" className="bg-foreground" />

          <p className="text-xs md:text-sm font-medium">{voters} Voters</p>
        </div>
      </div>

      <div>
        <h2 className="font-medium line-clamp-2 mb-1 md:text-lg lg:text-xl">{name}</h2>
        <p className="text-muted-foreground">{position}</p>
      </div>
    </div>
  )
}
