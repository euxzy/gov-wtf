import { SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { InputGroup, InputGroupAddon, InputGroupInput } from '~/components/ui/input-group'
import { useDebounce } from '~/hooks/use-debounce'

export const Header = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('q') || '')
  const searchDebounce = useDebounce(search, 300)

  useEffect(() => {
    if (!searchDebounce) return setSearchParams({ page: '1' })
    setSearchParams({ page: '1', q: searchDebounce })
  }, [searchDebounce])

  return (
    <header className="border-b sticky top-0 z-100 bg-background">
      <div className="py-6 max-w-7xl mx-auto flex items-center justify-between px-5 md:px-8 lg:px-0">
        <h1 className="text-2xl font-semibold [&>span]:text-primary">
          Gov<span>WTF</span>
        </h1>
        <div className="md:w-72">
          <InputGroup>
            <InputGroupInput
              placeholder="Search..."
              defaultValue={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>
    </header>
  )
}
