"use client";

import { useAtomValue } from "jotai";
import { useEffect } from "react";
import {
  boardListAtom,
  currentPageAtom,
} from "../../application/atoms/boardListAtoms";
import { useFetchPostsCommand } from "../../application/commands/fetchPostsCommand";
import {
  boardErrorMessageAtom,
  isBoardEmptyAtom,
  isBoardErrorAtom,
  isBoardLoadingAtom,
} from "../../application/selectors/boardListSelectors";
import { BoardListItem } from "./BoardListItem";
import { BoardListPagination } from "./BoardListPagination";

export function BoardList() {
  const list = useAtomValue(boardListAtom);
  const currentPage = useAtomValue(currentPageAtom);
  const isLoading = useAtomValue(isBoardLoadingAtom);
  const isError = useAtomValue(isBoardErrorAtom);
  const isEmpty = useAtomValue(isBoardEmptyAtom);
  const errorMessage = useAtomValue(boardErrorMessageAtom);

  const fetchPosts = useFetchPostsCommand();

  useEffect(() => {
    const controller = new AbortController();
    void fetchPosts(1, controller.signal);
    return () => controller.abort();
  }, [fetchPosts]);

  if (isLoading) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center justify-center gap-3 py-16 text-sm text-zinc-500 dark:text-zinc-400"
      >
        <span
          aria-hidden="true"
          className="size-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100"
        />
        게시물을 불러오는 중입니다…
      </div>
    );
  }

  if (isError) {
    return (
      <div
        role="alert"
        className="flex flex-col items-center justify-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-6 py-10 text-center text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300"
      >
        <p className="font-semibold">{errorMessage ?? "게시물을 불러오지 못했어요."}</p>
        <button
          type="button"
          onClick={() => void fetchPosts(currentPage)}
          className="inline-flex h-9 items-center justify-center rounded-md bg-rose-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (isEmpty || !list) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-dashed border-zinc-200 px-6 py-16 text-sm text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        등록된 게시물이 없습니다.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <ul className="flex flex-col gap-2">
        {list.items.map((post) => (
          <BoardListItem key={post.id} post={post} />
        ))}
      </ul>
      <BoardListPagination
        currentPage={list.currentPage}
        totalPages={list.totalPages}
        onPageChange={(page) => void fetchPosts(page)}
      />
    </div>
  );
}
