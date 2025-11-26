import { like, or } from 'drizzle-orm'
import { useSearchParams } from 'react-router'
import { PersonCard } from '~/components/shared/card/person'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '~/components/ui/pagination'
import { db } from '~/db'
import { functionary } from '~/db/schema'
import type { Route } from './+types'

export function meta(_args: Route.MetaArgs) {
  return [{ title: 'Gov WTF' }, { name: 'description', content: 'The worst government in the world!' }]
}

export const loader = async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url)
  const searchParams = url.searchParams
  const page = Number(searchParams.get('page') || 1)
  const q = searchParams.get('q') || ''

  try {
    const [functionaries, functionaryCount] = await Promise.all([
      db
        .select()
        .from(functionary)
        .limit(8)
        .offset((page - 1) * 8)
        .where(or(like(functionary.name, `%${q}%`), like(functionary.position, `%${q}%`))),
      db.$count(functionary),
    ])

    return { functionaries, functionaryCount, page, totalPage: Math.ceil(functionaryCount / 8) }
  } catch (err) {
    console.error(err)
    return { functionaries: [], functionaryCount: 0, page, totalPage: 1 }
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

        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {loaderData.functionaries.map((functionary, i) => (
            <PersonCard key={`${i + 0}`} {...functionary} />
          ))}
        </div>

        <div className="py-12">
          <Pagination className="justify-end select-none">
            <PaginationContent>
              <PaginationItem onClick={() => onChangePage(loaderData.page - 1)}>
                <PaginationPrevious className="cursor-pointer" />
              </PaginationItem>

              <PaginationItem onClick={() => onChangePage(1)}>
                <PaginationLink isActive={loaderData.page === 1} className="cursor-pointer">
                  1
                </PaginationLink>
              </PaginationItem>
              {loaderData.page > 4 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              {Array.from({ length: 3 }, (_, idx) => loaderData.page + idx)
                .filter((page) => page > 1 && page < loaderData.totalPage)
                .map((page) => (
                  <PaginationItem key={`page-${page}`} onClick={() => onChangePage(page)}>
                    <PaginationLink isActive={loaderData.page === page} className="cursor-pointer">
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
              {loaderData.page < loaderData.totalPage - 4 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}
              <PaginationItem onClick={() => onChangePage(loaderData.totalPage)}>
                <PaginationLink isActive={loaderData.page === loaderData.totalPage} className="cursor-pointer">
                  {loaderData.totalPage}
                </PaginationLink>
              </PaginationItem>

              <PaginationItem onClick={() => onChangePage(loaderData.page + 1)}>
                <PaginationNext className="cursor-pointer" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </section>
  )
}
