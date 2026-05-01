"use client";

import { useCallback, useState } from "react";
import { HttpError } from "@/infrastructure/http/httpClient";
import { readPost } from "../../infrastructure/api/boardApi";
import type { PostDetail } from "../../domain/model/post";

export type ReadPostStatus = "IDLE" | "LOADING" | "SUCCESS" | "ERROR";

interface ReadPostState {
  status: ReadPostStatus;
  post: PostDetail | null;
  error: string | null;
}

const initialState: ReadPostState = {
  status: "IDLE",
  post: null,
  error: null,
};

function describeError(error: unknown): string {
  if (error instanceof HttpError) {
    if (error.status === 404) return "게시물을 찾을 수 없어요.";
    if (error.status === 0) return "네트워크 오류로 게시물을 불러오지 못했어요.";
    return `게시물을 불러오지 못했어요. (HTTP ${error.status})`;
  }
  if (error instanceof Error) return error.message;
  return "게시물을 불러오지 못했어요.";
}

export function useReadPostCommand() {
  const [state, setState] = useState<ReadPostState>(initialState);

  const read = useCallback(async (id: string, signal?: AbortSignal) => {
    setState({ status: "LOADING", post: null, error: null });
    try {
      const post = await readPost(id, signal);
      if (signal?.aborted) return;
      setState({ status: "SUCCESS", post, error: null });
    } catch (error) {
      if (signal?.aborted) return;
      setState({
        status: "ERROR",
        post: null,
        error: describeError(error),
      });
    }
  }, []);

  return { ...state, read };
}
