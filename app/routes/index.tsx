import { createId } from '@paralleldrive/cuid2'
import { count, like, or } from 'drizzle-orm'
import { data, useSearchParams } from 'react-router'
import { Persons } from '~/components/sections/persons'
import { Pagination } from '~/components/shared/pagination'
import { db } from '~/db'
import { functionary, voter } from '~/db/schema'
import { commitServiceSession, getServiceSession } from '~/sessions/services.server'
import type { Route } from './+types'

export function meta(_args: Route.MetaArgs) {
  return [{ title: 'Gov WTF' }, { name: 'description', content: 'The worst government in the world!' }]
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const session = await getServiceSession(request.headers.get('Cookie'))
  if (!session.has('credentialId')) {
    const credentialId = createId()
    session.set('credentialId', credentialId)

    try {
      await db.insert(voter).values({ id: credentialId })
    } catch (err) {
      console.log(err)
    }
  }

  const url = new URL(request.url)
  const searchParams = url.searchParams
  const page = Number(searchParams.get('page') || 1)
  const q = searchParams.get('q') || ''

  try {
    const [functionaries, functionaryCount] = await Promise.all([
      db.query.functionary.findMany({
        limit: 8,
        offset: (page - 1) * 8,
        where: or(like(functionary.name, `%${q}%`), like(functionary.position, `%${q}%`)),
        with: { ratings: true },
      }),
      db
        .select({ count: count() })
        .from(functionary)
        .where(or(like(functionary.name, `%${q}%`), like(functionary.position, `%${q}%`))),
    ])

    return data(
      { functionaries, functionaryCount, page, totalPage: Math.ceil(functionaryCount[0].count / 8) },
      { headers: { 'Set-Cookie': await commitServiceSession(session) } },
    )
  } catch (err) {
    console.error(err)
    return data(
      { functionaries: [], functionaryCount: 0, page, totalPage: 1 },
      { headers: { 'Set-Cookie': await commitServiceSession(session) } },
    )
  }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const [serachParams, setSearchParams] = useSearchParams()

  const onChangePage = (page: number) => {
    if (page < 1 || page > loaderData.totalPage) return

    serachParams.set('page', String(page))
    setSearchParams(serachParams)
  }

  return (
    <section>
      <div className="max-w-7xl mx-auto py-8 px-5 md:px-8 lg:px-0">
        <div className="mb-8 lg:mb-12">
          <h1 className="text-2xl font-semibold mb-2 [&>del]:text-primary lg:text-3xl">
            <del>Ganyang</del> Rating Pejabat
          </h1>
          <p className="text-muted-foreground lg:text-lg">Berikan penilaianmu terhadap kinerja pejabat negeri</p>
        </div>

        <Persons functionaries={loaderData.functionaries} />

        <div className="py-12">
          <Pagination page={loaderData.page} totalPage={loaderData.totalPage} onChangePage={onChangePage} />
        </div>
      </div>
    </section>
  )
}
