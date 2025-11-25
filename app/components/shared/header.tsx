import { SearchIcon } from 'lucide-react'
import { InputGroup, InputGroupAddon, InputGroupInput } from '~/components/ui/input-group'

export const Header = () => {
  return (
    <header className="border-b sticky top-0 z-100 bg-background">
      <div className="py-6 max-w-7xl mx-auto flex items-center justify-between px-5 md:px-8 lg:px-0">
        <h1 className="text-2xl font-semibold [&>span]:text-primary">
          Gov<span>WTF</span>
        </h1>
        <div className="w-72 hidden md:block">
          <InputGroup>
            <InputGroupInput placeholder="Search..." />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>
    </header>
  )
}
