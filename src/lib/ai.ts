import { z } from "zod";
import { generateText, Output } from "ai";
import { google } from "@ai-sdk/google";

// APIを叩く

// Zodで型を定義
const CardSchema = z.object({
  cards: z.array(
    z.object({
      word: z.string().describe("The English word or phrase to learn"),
      meaning: z.string().describe("Japanese translation of the word"),
      englishSentence: z
        .string()
        .describe(
          "An example sentence in English using the word, preferably extracted from the subtitles",
        ),
      japaneseSentence: z
        .string()
        .describe("Japanese translation of the example sentence"),
      context: z
        .string()
        .describe(
          "Brief explanation of how the word is used in this video context",
        ),
    }),
  ),
});

/*
generateObject は、Vercel AI SDK が提供する超強力な関数で、実行時に以下の処理をワンストップで行う。

    participant App as あなたのコード (Next.js)
    participant SDK as Vercel AI SDK
    participant Gemini as Gemini API Server
    App->>SDK: generateObject(model, schema, prompt)

    Note over SDK: 1. Zod スキーマを<br/>JSON Schema に変換
    SDK->>Gemini: 2. 「このスキーマに適合するJSONを返して」とリクエスト
    Gemini-->>SDK: 3. JSON文字列を返却
    Note over SDK: 4. 返ってきたJSONを<br/>Zodで検証 (パース)
    SDK-->>App: 5. 型安全な object を返却
*/

export async function generateWordCardsFormSubtitles(subtitles: string) {
  const { output } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt: `Analyze the following English video subtitles and extract 5 key vocabulary words or phrases for English learners.
    For each word, provide its meaning in Japanese, an example sentence, its Japanese translation, and a brief context/explanation.
    Subtitles:
    ${subtitles}`,
    output: Output.object({
      schema: CardSchema,
    }),
  });

  return output.cards;
}
