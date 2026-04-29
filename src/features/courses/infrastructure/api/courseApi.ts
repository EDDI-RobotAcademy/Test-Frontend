import type { Course, CourseDraft } from "../../domain/model/course";

export async function createCourse(draft: CourseDraft): Promise<Course> {
  if (!draft.date || !draft.time || !draft.transport) {
    throw new Error("필수 항목이 누락되었습니다.");
  }

  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`,
    place: draft.place,
    date: draft.date,
    time: draft.time,
    preference: draft.preference,
    transport: draft.transport,
    createdAt: new Date(),
  };
}
