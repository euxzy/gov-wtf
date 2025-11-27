import { useGSAP } from '@gsap/react'
import { like, or } from 'drizzle-orm'
import { gsap } from 'gsap'
import { Flip } from 'gsap/all'
import { useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router'
import { DetailPerson } from '~/components/sections/detail-person'
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
import { type Functionary, functionary } from '~/db/schema'
import { cdnImg } from '~/lib/utils'
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

gsap.registerPlugin(Flip)

export default function Home({ loaderData }: Route.ComponentProps) {
  const [serachParams, setSearchParams] = useSearchParams()

  const onChangePage = (page: number) => {
    if (page < 1 || page > loaderData.totalPage) return

    serachParams.set('page', String(page))
    setSearchParams(serachParams)
  }

  const containerRef = useRef<HTMLDivElement>(null)
  const detailContainerRef = useRef<HTMLDivElement>(null)

  const [selectedFunctionary, setSelectedFunctionary] = useState<Functionary | null>(null)
  const [active, setActive] = useState<HTMLDivElement | null>(null)

  const detailImgContainer = useMemo(() => {
    return detailContainerRef.current?.querySelector('#detail-img-container') as HTMLDivElement
  }, [detailContainerRef.current])
  const detailImg = useMemo(() => {
    return detailContainerRef.current?.querySelector('img') as HTMLImageElement
  }, [detailContainerRef.current])
  const detailContent = useMemo(() => {
    return detailContainerRef.current?.querySelector('#detail-content') as HTMLDivElement
  }, [detailContainerRef.current])

  const { contextSafe } = useGSAP({ scope: containerRef })

  const onClickPerson = contextSafe((el: HTMLDivElement) => {
    const persons = gsap.utils.toArray('#person')

    const onLoad = () => {
      Flip.fit(detailContainerRef.current, el, { scale: true, fitChild: detailImgContainer })

      const state = Flip.getState(detailContainerRef.current)

      gsap.set(detailContainerRef.current, { clearProps: true })
      gsap.set(detailContainerRef.current, { visibility: 'visible', overflow: 'hidden' })

      Flip.from(state, {
        duration: 0.5,
        ease: 'power2.inOut',
        scale: true,
        onComplete: () => {
          gsap.set(detailContainerRef.current, { overflow: 'auto' })
        },
      }).to(detailContent, { opacity: 1 })

      detailImg.removeEventListener('load', onLoad)
    }

    detailImg.addEventListener('load', onLoad)
    detailImg.src = cdnImg(el.dataset?.photo)

    gsap.to(persons, { opacity: 0.2, stagger: { amount: 0.7, from: persons.indexOf(el), grid: 'auto' } }).kill(el)
    setActive(el)
    setSelectedFunctionary({
      id: String(el.dataset?.functionaryId),
      name: String(el.dataset?.name),
      photo: String(el.dataset?.photo),
      position: String(el.dataset?.position),
      createdAt: new Date(String(el.dataset?.createdAt)),
      updatedAt: new Date(String(el.dataset?.updatedAt)),
    })
  })

  const onCloseDetail = contextSafe(() => {
    const persons = gsap.utils.toArray('#person')

    gsap.set(detailContainerRef.current, { overflow: 'hidden' })

    const state = Flip.getState(detailContainerRef.current)

    Flip.fit(detailContainerRef.current, active, { scale: true, fitChild: detailImgContainer })

    const tl = gsap.timeline()
    tl.set(detailContainerRef.current, { overflow: 'hidden' })
      .to(detailContent, { opacity: 0 })
      .to(persons, {
        opacity: 1,
        stagger: { amount: 0.7, from: persons.indexOf(active), grid: 'auto' },
      })

    Flip.from(state, {
      scale: true,
      duration: 0.5,
      delay: 0.2,
      onInterrupt: () => {
        tl.kill()
      },
    }).set(detailContainerRef.current, { visibility: 'hidden' })

    setActive(null)
    setSelectedFunctionary(null)
  })

  return (
    <section>
      <div className="max-w-7xl mx-auto py-8 px-5 md:px-8 lg:px-0">
        <div className="mb-8 lg:mb-12">
          <h1 className="text-2xl font-semibold mb-2 [&>del]:text-primary lg:text-3xl">
            <del>Ganyang</del> Rating Pejabat
          </h1>
          <p className="text-muted-foreground lg:text-lg">Berikan penilaianmu terhadap kinerja pejabat negeri</p>
        </div>

        <div ref={containerRef}>
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {loaderData.functionaries.map((functionary) => (
              <PersonCard key={functionary.id} id="person" functionary={functionary} onClick={onClickPerson} />
            ))}
          </div>

          <DetailPerson ref={detailContainerRef} functionary={selectedFunctionary} onClose={onCloseDetail} />
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
