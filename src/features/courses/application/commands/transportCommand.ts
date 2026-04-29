"use client";

import { useSetAtom } from "jotai";
import { useCallback } from "react";
import type { TransportMode } from "../../domain/model/course";
import { transportAtom } from "../atoms/courseFormAtoms";

export function useTransportCommand() {
  const setTransport = useSetAtom(transportAtom);

  return useCallback(
    (mode: TransportMode | null) => {
      setTransport(mode);
    },
    [setTransport],
  );
}
