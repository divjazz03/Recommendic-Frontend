import { useMemo } from "react";

type PaginationItem = number | "ellipsis";

function getPaginationRange({
  currentPage,
  totalPages,
  siblingCount = 1,
}: {
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
}) {
  const totalNumbers = siblingCount * 2 + 5;

  if (totalPages <= totalNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(currentPage - siblingCount, 1);
  const rightSibling = Math.min(currentPage + siblingCount, totalPages);

  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  const range: PaginationItem[] = [];

  // Always show first page
  range.push(1);

  if (showLeftEllipsis) {
    range.push("ellipsis");
  }

  // Middle pages
  for (let i = leftSibling; i <= rightSibling; i++) {
    if (i !== 1 && i !== totalPages) {
      range.push(i);
    }
  }

  if (showRightEllipsis) {
    range.push("ellipsis");
  }

  // Always show last page
  range.push(totalPages);

  return range;
}

function usePagination({
  currentPage, totalPages, siblingCount = 1,
}: {
  currentPage: number;
  totalPages: number;
  siblingCount?: number;
}) {
    return useMemo(
    () =>
      getPaginationRange({
        currentPage,
        totalPages,
        siblingCount,
      }),
    [currentPage, totalPages, siblingCount]
  );
}

export default usePagination;
