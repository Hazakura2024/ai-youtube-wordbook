"use server";

import { prisma } from "@/prisma";
import { redirect } from "next/navigation";
import { generateWordCardsFormSubtitles } from "./ai";
import { revalidatePath } from "next/cache";

// youtube動画のURLからIDを取り出す関数
function extractYoutubeId(url: string): string | null {
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

// タイトルを取得
async function getYoutubeTitle(youtubeId: string): Promise<string> {
  try {
    const response = await fetch(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${youtubeId}&format=json`,
    );
    if (!response.ok) throw new Error();
    const data = await response.json();
    return data.title || "無題のYouTube動画";
  } catch (error) {
    return "YouTube動画"; // エラー時のフォールバック
  }
}

// フロントのフォームから呼び出される関数本体
export async function createVideoWordbook(formData: FormData) {
  const youtubeUrl = formData.get("youtubeUrl") as string;
  if (!youtubeUrl) throw new Error("URLが必要です");

  const youtubeId = extractYoutubeId(youtubeUrl);
  if (!youtubeId) throw new Error("無効なYoutube URLです");

  const existingVideo = await prisma.video.findUnique({
    where: { youtubeId },
  });

  if (existingVideo) {
    redirect(`/videos/${existingVideo.id}`);
  }

  // モックデータ
  const mockSubtitles =
    "I want to comprehend this difficult concept. Let's research about next.js architecture.";
  const mockTitle = "Learn Next.js Architecture Principles";
  const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;

  const cards = await generateWordCardsFormSubtitles(mockSubtitles);

  const newVideo = await prisma.video.create({
    data: {
      youtubeId,
      title: mockTitle,
      thumbnailUrl,
      subtitles: mockSubtitles,
      cards: {
        create: cards,
      },
    },
  });

  revalidatePath("/");
  redirect(`/videos/${newVideo.id}`);
}
