import { BoardList } from "@/features/board/ui/components/BoardList";

export const metadata = {
  title: "게시판",
};

export default function BoardPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white px-4 py-10 sm:px-6 sm:py-14 md:py-16 dark:bg-black">
      <section
        aria-labelledby="board-heading"
        className="mx-auto w-full max-w-3xl"
      >
        <header className="mb-6 flex flex-col gap-2">
          <h1
            id="board-heading"
            className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100"
          >
            게시판
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            등록된 게시물을 확인할 수 있어요.
          </p>
        </header>
        <BoardList />
      </section>
    </main>
  );
}
