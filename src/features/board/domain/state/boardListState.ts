import type { PostListItem } from "../model/post";

export type BoardListStatus = "IDLE" | "LOADING" | "SUCCESS" | "ERROR";

export interface BoardPage {
  items: PostListItem[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export const DEFAULT_PAGE_SIZE = 10;
