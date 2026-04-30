import { heroBranding } from "../constants/branding";

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-white text-zinc-900 dark:bg-black dark:text-zinc-100"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(99,102,241,0.18),transparent_60%),radial-gradient(80%_60%_at_100%_120%,rgba(236,72,153,0.12),transparent_70%)] dark:bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(99,102,241,0.35),transparent_60%),radial-gradient(80%_60%_at_100%_120%,rgba(236,72,153,0.25),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-800"
      />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-20 sm:px-8 md:py-28 lg:flex-row lg:items-center lg:gap-16 lg:px-10 lg:py-32">
        <div className="flex flex-1 flex-col items-start gap-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-zinc-700 backdrop-blur dark:border-zinc-800 dark:bg-white/5 dark:text-zinc-300">
            <span className="size-1.5 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500" />
            {heroBranding.eyebrow}
          </span>

          <h1
            id="hero-heading"
            className="text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-[64px]"
          >
            테스트가 즐거워지는{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
              {heroBranding.highlight}
            </span>
          </h1>

          <p className="max-w-xl text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8 dark:text-zinc-400">
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

          <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a
              href={heroBranding.primaryCta.href}
              className="inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition-transform hover:-translate-y-0.5 focus-visible:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:shadow-indigo-500/30"
            >
              {heroBranding.primaryCta.label}
            </a>
            <a
              href={heroBranding.secondaryCta.href}
              className="inline-flex h-12 items-center justify-center rounded-full border border-zinc-300 bg-white px-6 text-sm font-semibold text-zinc-900 transition-colors hover:border-zinc-400 hover:bg-zinc-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 dark:border-zinc-700 dark:bg-transparent dark:text-zinc-100 dark:hover:border-zinc-500 dark:hover:bg-white/5"
            >
              {heroBranding.secondaryCta.label}
            </a>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="relative hidden flex-1 lg:block"
        >
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-indigo-500/20 via-violet-500/15 to-fuchsia-500/20 blur-2xl dark:from-indigo-500/30 dark:via-violet-500/25 dark:to-fuchsia-500/30" />
            <div className="relative flex h-full w-full flex-col gap-4 rounded-[28px] border border-zinc-200 bg-white/80 p-6 shadow-xl backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-rose-400" />
                <span className="size-2.5 rounded-full bg-amber-400" />
                <span className="size-2.5 rounded-full bg-emerald-400" />
                <span className="ml-3 text-xs font-mono text-zinc-500 dark:text-zinc-500">
                  test-frontend
                </span>
              </div>
              <div className="grid flex-1 grid-cols-2 gap-4">
                <div className="col-span-2 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 p-5 text-white shadow-md">
                  <p className="text-xs/4 uppercase tracking-wider opacity-80">
                    Feature
                  </p>
                  <p className="mt-1 text-lg font-semibold leading-snug">
                    코스 생성 폼
                  </p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                    DatePicker
                  </p>
                  <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    2026.05.04
                  </p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                    TimePicker
                  </p>
                  <p className="mt-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    14:30
                  </p>
                </div>
                <div className="col-span-2 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                    Transport
                  </p>
                  <div className="mt-2 inline-flex overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
                    <span className="bg-zinc-900 px-3 py-1 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
                      자차
                    </span>
                    <span className="px-3 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      도보
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
