import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { Flip } from 'gsap/all'
import { useMemo, useRef, useState } from 'react'
import type { Functionary, Rating } from '~/db/schema'
import { cdnImg } from '~/lib/utils'
import { PersonCard } from '../shared/card/person'
import { DetailPerson } from './detail-person'

gsap.registerPlugin(Flip)

type Props = {
  functionaries: (Functionary & { ratings: Rating[] })[]
}

export const Persons = ({ functionaries }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const detailContainerRef = useRef<HTMLDivElement>(null)

  const [selectedFunctionary, setSelectedFunctionary] = useState<(Functionary & { ratings: Rating[] }) | null>(null)
  const [active, setActive] = useState<HTMLDivElement | null>(null)

  const detailContainer = useMemo(() => {
    return detailContainerRef.current?.querySelector('#detail-container') as HTMLDivElement
  }, [detailContainerRef.current])
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
      detailContainer.classList.toggle('bg-background')
      detailContainer.classList.toggle('border')
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
      ratings: JSON.parse(String(el.dataset?.ratings)),
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

    detailContainer.classList.toggle('bg-background')
    detailContainer.classList.toggle('border')

    Flip.from(state, {
      scale: true,
      duration: 0.5,
      delay: 0.1,
      onInterrupt: () => {
        tl.kill()
      },
    }).set(detailContainerRef.current, { visibility: 'hidden' })

    setActive(null)
    setSelectedFunctionary(null)
  })

  return (
    <div ref={containerRef}>
      <div className="grid gap-3 grid-cols-2 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {functionaries.map((functionary) => (
          <PersonCard key={functionary.id} id="person" functionary={functionary} onClick={onClickPerson} />
        ))}
      </div>

      <DetailPerson ref={detailContainerRef} functionary={selectedFunctionary} onClose={onCloseDetail} />
    </div>
  )
}
