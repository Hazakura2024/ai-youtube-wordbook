import { RegisterForm } from "./_components/RegisterForm";
import { prisma } from "@/prisma";
import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Home() {
  const videos = await prisma.video.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black py-12 px-6">
      <main className="flex flex-col w-full items-center mx-auto space-y-8 max-w-3xl">
        <div>
          <h1 className="text-3xl font-extrabold">AI Youtube Wordbook</h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Youtube動画に登場した単語から単語帳を作成
          </p>
        </div>
        <RegisterForm></RegisterForm>
        <div className="w-full space-y-4">
          <h2 className="text-xl font-bold border-b pb-2">作成済みの単語帳</h2>
          {videos.length === 0 ? (
            <p className="text-sm text-zinc-500 text-center py-8">
              まだ単語帳が作成されていません
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {videos.map((video) => (
                <Link
                  href={`/videos/${video.id}`}
                  key={video.id}
                  className="block group"
                >
                  <Card className="overflow-hidden hover:border-blue-500 transition-colors h-full flex flex-col">
                    <img
                      src={
                        video.thumbnailUrl ||
                        "https://placehold.co/400x225?text=No+Image"
                      }
                      alt={video.title}
                      className="w-full aspect-video object-cover"
                    />
                    <CardHeader className="p-4 flex-1">
                      <CardTitle className="text-base font-semibold line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {video.title}
                      </CardTitle>
                      <CardDescription className="text-xs mt-1">
                        登録日
                        {new Date(video.createdAt).toLocaleDateString("ja-JP")}
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
