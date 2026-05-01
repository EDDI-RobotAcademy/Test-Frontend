"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useCallback } from "react";
import { HttpError } from "@/infrastructure/http/httpClient";
import { fetchPostList } from "../../infrastructure/api/boardApi";
import {
  boardListAtom,
  boardListErrorAtom,
  boardListStatusAtom,
  currentPageAtom,
  pageSizeAtom,
} from "../atoms/boardListAtoms";

function describeError(error: unknown): string {
  if (error instanceof HttpError) {
    if (error.status === 0) return "네트워크 오류로 게시물을 불러오지 못했어요.";
    return `게시물을 불러오지 못했어요. (HTTP ${error.status})`;
  }
  if (error instanceof Error) return error.message;
  return "게시물을 불러오지 못했어요.";
}

export function useFetchPostsCommand() {
  const setStatus = useSetAtom(boardListStatusAtom);
  const setList = useSetAtom(boardListAtom);
  const setError = useSetAtom(boardListErrorAtom);
  const setCurrentPage = useSetAtom(currentPageAtom);
  const pageSize = useAtomValue(pageSizeAtom);

  return useCallback(
    async (page: number, signal?: AbortSignal) => {
      setStatus("LOADING");
      setError(null);
      setCurrentPage(page);

      try {
        const result = await fetchPostList({ page, size: pageSize, signal });
        setList(result);
        setStatus("SUCCESS");
      } catch (error) {
        if (signal?.aborted) return;
        setStatus("ERROR");
        setError(describeError(error));
      }
    },
    [pageSize, setCurrentPage, setError, setList, setStatus],
  );
}
