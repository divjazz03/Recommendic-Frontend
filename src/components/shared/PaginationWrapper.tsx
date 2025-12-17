import usePagination from "@/hooks/usePagination";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "../ui/pagination";
import { HtmlHTMLAttributes } from "react";

interface PaginationProps extends HtmlHTMLAttributes<HTMLElement> {
  handlePrevious: () => void;
  handleNext: () => void;
  handlePage: (pageNumber: number) => void;
  totalPages: number;
  currentPage: number;
  isFirstPage: boolean;
  isLastPage: boolean;
}

const PaginationWrapper = (props: PaginationProps) => {
  const pages = usePagination({
    currentPage: props.currentPage,
    totalPages: props.totalPages,
  });
  return (
    <Pagination {...props}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => props.handlePrevious()}
            className=" cursor-pointer disabled:bg-gray-200 bg-main-light hover:bg-main hover:text-light-5 text-light-3"
          />
        </PaginationItem>
        {pages.map((page) => (
          <PaginationItem>
            {page === "ellipsis" ? (
              <PaginationEllipsis
                className={`bg-main-light hover:bg-main hover:text-light-5 text-light-3`}
              />
            ) : (
              <PaginationLink
                onClick={() => props.handlePage(page)}
                className={`cursor-pointer hover:bg-main hover:text-light-5 text-light-3 ${
                  page === props.currentPage + 1 ? "bg-main" : "bg-main-light"
                }`}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => props.handleNext()}
            className="cursor-pointer bg-main-light hover:bg-main hover:text-light-5 text-light-3"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationWrapper;