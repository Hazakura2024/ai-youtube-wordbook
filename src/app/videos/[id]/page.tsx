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

  return <div></div>;
}
