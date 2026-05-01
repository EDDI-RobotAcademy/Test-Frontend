import { atom } from "jotai";
import {
  DEFAULT_PAGE_SIZE,
  type BoardListStatus,
  type BoardPage,
} from "../../domain/state/boardListState";

export const boardListStatusAtom = atom<BoardListStatus>("IDLE");
export const boardListAtom = atom<BoardPage | null>(null);
export const boardListErrorAtom = atom<string | null>(null);
export const currentPageAtom = atom<number>(1);
export const pageSizeAtom = atom<number>(DEFAULT_PAGE_SIZE);
