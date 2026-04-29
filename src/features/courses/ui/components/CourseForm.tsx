"use client";

import type { CSSProperties, FormEvent } from "react";
import { useCreateCourseCommand } from "../../application/commands/createCourseCommand";
import { CreateCourseSubmit } from "./CreateCourseSubmit";
import { DateField } from "./DateField";
import { PlaceField } from "./PlaceField";
import { PreferenceField } from "./PreferenceField";
import { TimeField } from "./TimeField";
import { TransportSelector } from "./TransportSelector";

const formStyle: CSSProperties = {
  display: "grid",
  gap: "20px",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  alignItems: "start",
  width: "100%",
  maxWidth: "720px",
};

const fullSpanStyle: CSSProperties = {
  gridColumn: "1 / -1",
};

export function CourseForm() {
  const createCourse = useCreateCourseCommand();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    void createCourse();
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={formStyle}
      aria-label="코스 생성 폼"
      noValidate
    >
      <div style={fullSpanStyle}>
        <PlaceField />
      </div>
      <DateField />
      <TimeField />
      <div style={fullSpanStyle}>
        <TransportSelector />
      </div>
      <div style={fullSpanStyle}>
        <PreferenceField />
      </div>
      <div style={fullSpanStyle}>
        <CreateCourseSubmit />
      </div>
    </form>
  );
}
