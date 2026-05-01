import { PostDetailView } from "@/features/board/ui/components/PostDetailView";

interface BoardReadPageProps {
  params: Promise<{ id: string }>;
}

export default async function BoardReadPage({ params }: BoardReadPageProps) {
  const { id } = await params;
  return (
    <main className="flex min-h-screen flex-col bg-white px-4 py-10 sm:px-6 sm:py-14 md:py-16 dark:bg-black">
      <section className="mx-auto w-full max-w-3xl">
        <PostDetailView id={id} />
      </section>
    </main>
  );
}
