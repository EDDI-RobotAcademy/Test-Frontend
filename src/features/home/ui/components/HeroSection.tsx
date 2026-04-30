import { heroBranding } from "../constants/branding";
import { HomeCourseForm } from "./HomeCourseForm";

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate flex min-h-svh w-full flex-col overflow-hidden bg-white text-zinc-900 dark:bg-black dark:text-zinc-100"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(90%_70%_at_50%_-10%,rgba(99,102,241,0.18),transparent_60%),radial-gradient(70%_60%_at_100%_110%,rgba(236,72,153,0.14),transparent_70%)] dark:bg-[radial-gradient(90%_70%_at_50%_-10%,rgba(99,102,241,0.35),transparent_60%),radial-gradient(70%_60%_at_100%_110%,rgba(236,72,153,0.25),transparent_70%)]"
      />

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14 md:py-20 lg:max-w-5xl lg:px-10 xl:max-w-6xl">
        <header className="mb-8 flex flex-col gap-4 sm:mb-10 sm:gap-5">
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-indigo-200/70 bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:border-indigo-500/30 dark:text-indigo-300">
            <span className="size-1.5 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500" />
            {heroBranding.eyebrow}
          </span>

          <h1
            id="hero-heading"
            className="text-3xl font-semibold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl lg:text-[56px]"
          >
            테스트가 즐거워지는{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
              {heroBranding.highlight}
            </span>
          </h1>

          <p className="max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8 dark:text-zinc-400">
            {heroBranding.description}
          </p>

          <ul className="flex flex-col gap-2 text-sm text-zinc-700 sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2 dark:text-zinc-300">
            {heroBranding.bullets.map((bullet) => (
              <li key={bullet} className="inline-flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="inline-block size-1.5 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500"
                />
                {bullet}
              </li>
            ))}
          </ul>
        </header>

        <h2 id="course-form-heading" className="sr-only">
          코스 생성 폼
        </h2>
        <HomeCourseForm />
      </div>
    </section>
  );
}
