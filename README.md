This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# データベース設計

Prisma (PostgreSQL) を使用し、以下の2つのテーブルで構成します。

## 1. Video テーブル (YouTube動画情報)

YouTubeから取得した動画の基本情報と、字幕キャッシュを保持します。

| カラム名       | 型       | 制約         | 説明                                          |
| :------------- | :------- | :----------- | :-------------------------------------------- |
| `id`           | String   | `@id` (cuid) | レコードの一意な識別子                        |
| `youtubeId`    | String   | `@unique`    | YouTubeの動画ID (例: dQw4w9WgXcQ)             |
| `title`        | String   | -            | 動画のタイトル                                |
| `thumbnailUrl` | String?  | Null許容     | 動画のサムネイル画像のURL                     |
| `subtitles`    | String?  | Null許容     | 取得した字幕テキスト (AI再解析用のキャッシュ) |
| `createdAt`    | DateTime | `now()`      | 登録日時                                      |
| `updatedAt`    | DateTime | `@updatedAt` | 更新日時                                      |

## 2. Card テーブル (単語カード)

AIによって自動生成された英単語カード（クイズ）の情報を保持します。

| カラム名           | 型       | 制約          | 説明                                 |
| :----------------- | :------- | :------------ | :----------------------------------- |
| `id`               | String   | `@id` (cuid)  | レコードの一意な識別子               |
| `videoId`          | String   | `FK`, `Index` | 紐づくVideoテーブルのID              |
| `word`             | String   | -             | 対象となる英単語・フレーズ           |
| `meaning`          | String   | -             | 日本語の訳語                         |
| `englishSentence`  | String   | -             | 動画から抽出、またはAIが生成した英文 |
| `japaneseSentence` | String   | -             | 例文の日本語訳                       |
| `context`          | String?  | Null許容      | AIによる単語の使われ方や文脈の解説   |
| `createdAt`        | DateTime | `now()`       | 作成日時                             |
| `updatedAt`        | DateTime | `@updatedAt`  | 更新日時                             |

## リレーション関係

- **Video (1) ── (N) Card**
  - 1つの動画に対して、複数の単語カードが紐づきます。
  - **削除時の挙動**: `Video` が削除された場合、紐づくすべての `Card` が自動的に削除されます（`onDelete: Cascade`）。
  - **インデックス**: パフォーマンス向上のため、`Card` の `videoId` カラムにインデックスを付与しています。
