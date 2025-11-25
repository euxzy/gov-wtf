import { SearchIcon } from 'lucide-react'
import { PersonCard } from '~/components/shared/card/person'
import { InputGroup, InputGroupAddon, InputGroupInput } from '~/components/ui/input-group'
import type { Route } from './+types'

export function meta(_args: Route.MetaArgs) {
  return [{ title: 'Gov WTF' }, { name: 'description', content: 'The worst government in the world!' }]
}

export default function Home() {
  return (
    <section>
      <div className="max-w-7xl mx-auto py-8 px-5 md:px-8 lg:px-0">
        <div className="mb-8 lg:mb-12">
          <h1 className="text-2xl font-semibold mb-2 [&>del]:text-primary lg:text-3xl">
            <del>Ganyang</del> Rating Pejabat
          </h1>
          <p className="text-muted-foreground lg:text-lg">Berikan penilaianmu terhadap kinerja pejabat negeri</p>
        </div>

        <div className="mb-5 md:hidden">
          <InputGroup>
            <InputGroupInput placeholder="Search..." />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>

        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <PersonCard key={`${i + 0}`} />
          ))}
        </div>
      </div>
    </section>
  )
}
