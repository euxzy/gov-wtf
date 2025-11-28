import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination as PS,
} from '~/components/ui/pagination'

type Props = {
  page: number
  totalPage: number
  onChangePage: (page: number) => void
}

export const Pagination = ({ page, totalPage, onChangePage }: Props) => {
  return (
    <PS className="justify-end select-none">
      <PaginationContent>
        <PaginationItem onClick={() => onChangePage(page - 1)}>
          <PaginationPrevious className="cursor-pointer" />
        </PaginationItem>

        <PaginationItem onClick={() => onChangePage(1)}>
          <PaginationLink isActive={page === 1} className="cursor-pointer">
            1
          </PaginationLink>
        </PaginationItem>
        {page > 4 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {Array.from({ length: 3 }, (_, idx) => page + idx)
          .filter((p) => p > 1 && p < totalPage)
          .map((p) => (
            <PaginationItem key={`page-${p}`} onClick={() => onChangePage(p)}>
              <PaginationLink isActive={page === p} className="cursor-pointer">
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}
        {page < totalPage - 4 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {totalPage > 1 && (
          <PaginationItem onClick={() => onChangePage(totalPage)}>
            <PaginationLink isActive={page === totalPage} className="cursor-pointer">
              {totalPage}
            </PaginationLink>
          </PaginationItem>
        )}

        <PaginationItem onClick={() => onChangePage(page + 1)}>
          <PaginationNext className="cursor-pointer" />
        </PaginationItem>
      </PaginationContent>
    </PS>
  )
}
