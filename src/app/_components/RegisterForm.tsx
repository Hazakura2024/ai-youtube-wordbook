"use client";

import { createVideoWordbook } from "@/lib/video";
import { error } from "console";
import React, { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Youtube } from "lucide-react"; // アイコン用

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => {
      try {
        await createVideoWordbook(formData);
        return { error: null };
      } catch (error: any) {
        return { error: error.message || "エラーが発生しました" };
      }
    },
    { error: null },
  );

  return (
    <div>
      <Card className="w-full max-w-full shadow-md border-zinc-200 dark:border-zinc-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Youtube className="w-6 h-6 text-red-600"></Youtube>
            英語単語帳の作成
          </CardTitle>
          <CardDescription>
            YoutubeのURLを入力すると、動画に登場した英単語から単語カードを作成できます。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="flex flex-col gap-2">
              <Input
                id="youtubeUrl"
                name="youtubeUrl"
                type="url"
                required
                placeholder="https://www.youtube.com/watch?v=..."
                disabled={isPending}
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"></Loader2>
                  <span>AIが解析中...</span>
                </>
              ) : (
                "単語帳を生成する"
              )}
            </Button>

            {state.error && (
              <p className="text-sm font-medium text-red-500 mt-2 text-center">
                {state.error}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
