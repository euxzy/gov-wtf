import { Icon } from '@iconify/react'
import { Rating, RatingButton } from '~/components/ui/rating'
import { Separator } from '~/components/ui/separator'

export const PersonCard = () => {
  return (
    <div className="border p-2 rounded-md md:p-4">
      <div className="mb-3 relative">
        <img
          src="https://github.com/shadcn.png"
          alt="CN"
          className="relative aspect-4/5 object-cover mb-3 rounded-sm lg:aspect-7/8"
        />
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
        <h2 className="font-medium line-clamp-2 mb-2 md:mb-3 md:text-lg lg:mb-4">Mulyono</h2>

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
