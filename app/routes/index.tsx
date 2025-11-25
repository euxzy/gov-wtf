import type { Route } from './+types'

export function meta(_args: Route.MetaArgs) {
  return [{ title: 'Gov WTF' }, { name: 'description', content: 'The worst government in the world!' }]
}

export default function Home() {
  return (
    <section>
      <h1>Home</h1>
    </section>
  )
}
