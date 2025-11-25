import { SearchIcon } from 'lucide-react'
import { InputGroup, InputGroupAddon, InputGroupInput } from '~/components/ui/input-group'

export const Header = () => {
  return (
    <header className="border-b">
      <div className="py-6 max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-semibold [&>span]:text-primary">
          Gov<span>WTF</span>
        </h1>
        <div className="w-72">
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
