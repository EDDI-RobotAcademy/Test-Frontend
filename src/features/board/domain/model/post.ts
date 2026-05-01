export const ANONYMOUS_AUTHOR = "익명";

export interface PostListItem {
  id: string;
  title: string;
  createdAt: string;
}

export interface PostDetail {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}
