"use client";

import { useMemo } from "react";

interface BoardListPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
  windowSize?: number;
}

function buildPageWindow(
  current: number,
  total: number,
  windowSize: number,
): number[] {
  if (total <= windowSize) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const half = Math.floor(windowSize / 2);
  let start = Math.max(1, current - half);
  let end = start + windowSize - 1;
  if (end > total) {
    end = total;
    start = end - windowSize + 1;
  }
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function BoardListPagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
  windowSize = 5,
}: BoardListPaginationProps) {
  const pages = useMemo(
    () => buildPageWindow(currentPage, totalPages, windowSize),
    [currentPage, totalPages, windowSize],
  );

  if (totalPages <= 1) return null;

  const baseBtn =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-zinc-200 px-2 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:text-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-900";
  const activeBtn =
    "inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-transparent bg-zinc-900 px-2 text-sm font-semibold text-white dark:bg-zinc-100 dark:text-zinc-900";

  return (
    <nav
      aria-label="게시물 페이지 네비게이션"
      className="flex items-center justify-center gap-1"
    >
      <button
        type="button"
        className={baseBtn}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={disabled || currentPage <= 1}
        aria-label="이전 페이지"
      >
        ‹
      </button>
      {pages.map((page) => {
        const isActive = page === currentPage;
        return (
          <button
            key={page}
            type="button"
            className={isActive ? activeBtn : baseBtn}
            onClick={() => {
              if (!isActive) onPageChange(page);
            }}
            aria-current={isActive ? "page" : undefined}
            disabled={disabled}
          >
            {page}
          </button>
        );
      })}
      <button
        type="button"
        className={baseBtn}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={disabled || currentPage >= totalPages}
        aria-label="다음 페이지"
      >
        ›
      </button>
    </nav>
  );
}
