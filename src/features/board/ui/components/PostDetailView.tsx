"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useReadPostCommand } from "../../application/commands/readPostCommand";
import { ANONYMOUS_AUTHOR } from "../../domain/model/post";

interface PostDetailViewProps {
  id: string;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function PostDetailView({ id }: PostDetailViewProps) {
  const { status, post, error, read } = useReadPostCommand();

  useEffect(() => {
    const controller = new AbortController();
    void read(id, controller.signal);
    return () => controller.abort();
  }, [id, read]);

  return (
    <article className="flex flex-col gap-6">
      <Link
        href="/board/list"
        className="self-start text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        ← 게시판으로
      </Link>

      {status === "LOADING" || status === "IDLE" ? (
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
      ) : null}

      {status === "ERROR" ? (
        <div
          role="alert"
          className="flex flex-col items-center justify-center gap-3 rounded-xl border border-rose-200 bg-rose-50 px-6 py-10 text-center text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300"
        >
          <p className="font-semibold">{error ?? "게시물을 불러오지 못했어요."}</p>
          <button
            type="button"
            onClick={() => void read(id)}
            className="inline-flex h-9 items-center justify-center rounded-md bg-rose-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
          >
            다시 시도
          </button>
        </div>
      ) : null}

      {status === "SUCCESS" && post ? (
        <div className="flex flex-col gap-4">
          <header className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              {post.title}
            </h1>
            <p className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
              <span>{ANONYMOUS_AUTHOR}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
            </p>
          </header>
          <div className="whitespace-pre-wrap text-sm leading-7 text-zinc-800 dark:text-zinc-200">
            {post.content}
          </div>
        </div>
      ) : null}
    </article>
  );
}
