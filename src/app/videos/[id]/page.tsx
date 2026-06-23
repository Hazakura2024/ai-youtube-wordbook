import { prisma } from "@/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function VideoDetailPage({ params }: PageProps) {
  // Next.js 16 の仕様に基づき、params は await して取得します
  const { id } = await params;

  // 動画データと、それに紐づく単語カードをまとめてDBから取得します
  const video = await prisma.video.findUnique({
    where: { id },
    include: {
      cards: true,
    },
  });

  // 動画が見つからない場合は 404 画面を表示します
  if (!video) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black py-8 px-6">
      <div className="max-w-6xl mx-auto w-full space-y-6">
        {/* 戻るボタンとヘッダー */}
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="outline" size="sm">
              ← トップに戻る
            </Button>
          </Link>
        </div>

        <h1 className="text-2xl font-bold tracking-tight">{video.title}</h1>

        {/* 左右2カラムレイアウト（PC表示時） */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左カラム: YouTubeプレイヤー (横幅の3分の2を使用) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="aspect-video w-full rounded-xl overflow-hidden shadow-lg border border-zinc-200 dark:border-zinc-800">
              <iframe
                src={`https://www.youtube.com/embed/${video.youtubeId}`}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-none"
              ></iframe>
            </div>
            <p className="text-sm text-zinc-500">
              動画を再生しながら、右側の単語カードで学習しましょう。
            </p>
          </div>

          {/* 右カラム: 単語カードリスト (横幅の3分の1を使用) */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold">
              単語カード ({video.cards.length})
            </h2>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {video.cards.map((card) => (
                <div
                  key={card.id}
                  className="border p-4 rounded-lg bg-white dark:bg-zinc-900 shadow-sm"
                >
                  {/* TODO: ここにめくれるカードコンポーネントを配置します */}
                  <h3 className="font-bold text-lg text-blue-600 dark:text-blue-400">
                    {card.word}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-1">
                    {card.meaning}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
