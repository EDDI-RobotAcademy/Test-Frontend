export type BoardIntent =
  | { type: "FETCH_LIST"; page: number }
  | { type: "CHANGE_PAGE"; page: number }
  | { type: "READ_POST"; id: string };
