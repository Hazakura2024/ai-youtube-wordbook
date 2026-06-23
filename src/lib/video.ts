"use server";

import { prisma } from "@/prisma";
import { redirect } from "next/navigation";
import { generateWordCardsFormSubtitles } from "./ai";
import { revalidatePath } from "next/cache";
import { YoutubeTranscript } from "youtube-transcript";

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

async function getYoutubeSubtitles(youtubeId: string): Promise<string> {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(youtubeId);
    // 全ての字幕行をスペースで結合して1つの大きな英語テキストにする
    return transcript.map((item) => item.text).join(" ");
  } catch (error) {
    console.error(error);
    throw new Error(
      "字幕の取得に失敗しました。この動画には英語の字幕（自動生成含む）が設定されていない可能性があります。",
    );
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

  const [title, subtitles] = await Promise.all([
    getYoutubeTitle(youtubeId),
    getYoutubeSubtitles(youtubeId),
  ]);
  const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/mqdefault.jpg`;
  // AIで単語カードを生成
  const cards = await generateWordCardsFormSubtitles(subtitles);
  // DBに親レコード（Video）と子レコード（Card）を一括保存
  const newVideo = await prisma.video.create({
    data: {
      youtubeId,
      title,
      thumbnailUrl,
      subtitles,
      cards: {
        create: cards,
      },
    },
  });

  revalidatePath("/");
  redirect(`/videos/${newVideo.id}`);
}
