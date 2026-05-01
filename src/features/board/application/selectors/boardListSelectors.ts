import { atom } from "jotai";
import {
  boardListAtom,
  boardListErrorAtom,
  boardListStatusAtom,
} from "../atoms/boardListAtoms";

export const isBoardLoadingAtom = atom(
  (get) =>
    get(boardListStatusAtom) === "LOADING" ||
    get(boardListStatusAtom) === "IDLE",
);

export const isBoardErrorAtom = atom(
  (get) => get(boardListStatusAtom) === "ERROR",
);

export const isBoardSuccessAtom = atom(
  (get) => get(boardListStatusAtom) === "SUCCESS",
);

export const isBoardEmptyAtom = atom((get) => {
  if (get(boardListStatusAtom) !== "SUCCESS") return false;
  const page = get(boardListAtom);
  return page == null || page.items.length === 0;
});

export const boardErrorMessageAtom = atom(
  (get) => get(boardListErrorAtom),
);
