import { httpClient } from "@/infrastructure/http/httpClient";
import type { PostDetail } from "../../domain/model/post";
import type { BoardPage } from "../../domain/state/boardListState";

interface RawListItem {
  id: string | number;
  title: string;
  createdAt: string;
}

interface RawListResponse {
  items: RawListItem[];
  totalCount?: number;
  totalPages?: number;
  currentPage?: number;
  pageSize?: number;
  page?: number;
  size?: number;
  total?: number;
}

interface RawPostDetail {
  id: string | number;
  title: string;
  content: string;
  createdAt: string;
}

export interface FetchPostListArgs {
  page: number;
  size: number;
  signal?: AbortSignal;
}

export async function fetchPostList(
  args: FetchPostListArgs,
): Promise<BoardPage> {
  const data = await httpClient<RawListResponse>("/board/list", {
    method: "GET",
    query: { page: args.page, size: args.size },
    signal: args.signal,
  });

  const items = (data.items ?? []).map((item) => ({
    id: String(item.id),
    title: item.title,
    createdAt: item.createdAt,
  }));

  const pageSize = data.pageSize ?? data.size ?? args.size;
  const currentPage = data.currentPage ?? data.page ?? args.page;
  const totalCount = data.totalCount ?? data.total ?? items.length;
  const totalPages =
    data.totalPages ??
    (pageSize > 0 ? Math.max(1, Math.ceil(totalCount / pageSize)) : 1);

  return {
    items,
    totalCount,
    totalPages,
    currentPage,
    pageSize,
  };
}

export async function readPost(
  id: string,
  signal?: AbortSignal,
): Promise<PostDetail> {
  const raw = await httpClient<RawPostDetail>(
    `/board/read/${encodeURIComponent(id)}`,
    { method: "GET", signal },
  );
  return {
    id: String(raw.id),
    title: raw.title,
    content: raw.content,
    createdAt: raw.createdAt,
  };
}
