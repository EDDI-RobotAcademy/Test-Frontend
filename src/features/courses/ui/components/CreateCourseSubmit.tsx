"use client";

import { useAtomValue } from "jotai";
import { Button } from "@/ui/components/Button";
import { FieldMessage } from "@/ui/components/FieldMessage";
import {
  canSubmitAtom,
  isSubmittingAtom,
  submissionErrorTextAtom,
} from "../../application/selectors/courseFormSelectors";

export function CreateCourseSubmit() {
  const canSubmit = useAtomValue(canSubmitAtom);
  const isSubmitting = useAtomValue(isSubmittingAtom);
  const submissionError = useAtomValue(submissionErrorTextAtom);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <Button
        type="submit"
        variant="primary"
        size="lg"
        fullWidth
        disabled={!canSubmit && !isSubmitting}
        loading={isSubmitting}
        loadingLabel="코스를 생성하고 있어요"
      >
        코스 생성
      </Button>
      {submissionError ? (
        <FieldMessage severity="error">{submissionError}</FieldMessage>
      ) : null}
    </div>
  );
}
