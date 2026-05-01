import Link from "next/link";
import { ANONYMOUS_AUTHOR, type PostListItem } from "../../domain/model/post";

interface BoardListItemProps {
  post: PostListItem;
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export function BoardListItem({ post }: BoardListItemProps) {
  return (
    <li>
      <Link
        href={`/board/read/${encodeURIComponent(post.id)}`}
        className="flex items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-white px-4 py-3 transition-colors hover:border-zinc-300 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
      >
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
          {post.title}
        </span>
        <span className="flex shrink-0 items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span>{ANONYMOUS_AUTHOR}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
        </span>
      </Link>
    </li>
  );
}
