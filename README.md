# AI YouTube Wordbook

YouTube動画のURLを入力すると、動画内の英語字幕から重要な英単語を自動抽出し、フラッシュカード（単語帳）を生成するWebアプリケーションです。

## 主な機能

- YouTubeの動画URLからの英語字幕の自動取得
- Gemini(gemini-2.5-flash)を用いた難易度の高い英単語の自動抽出（CEFR B2〜C2レベル目安）
- 日本語訳、英語の例文（字幕内から抽出優先）、例文の日本語訳、使われ方の解説の生成
- フリップ（めくる）アニメーション付きの単語カードによる学習機能

## 技術スタック

- **Framework**: Next.js (App Router, React 19)
- **Styling**: Tailwind CSS v4, Lucide React (アイコン)
- **Database / ORM**: PostgreSQL, Prisma
- **AI Integration**: Vercel AI SDK, Gemini API (@ai-sdk/google)

## セットアップ手順

### 1. 依存パッケージのインストール

```bash
npm install
```

### 2. 環境変数の設定

プロジェクトのルートディレクトリに `.env` ファイルを作成し、以下の項目を設定してください。

```env
DATABASE_URL="postgresql://ユーザー名:パスワード@ホスト名:ポート番号/データベース名"
GEMINI_API_KEY="あなたのGemini_APIキー"
```

### 3. データベースの初期化とPrisma Clientの生成

データベースへの接続情報を設定した状態で、以下を実行します。

```bash
# データベーススキーマの反映
npx prisma db push

# Prisma Clientの生成
npx prisma generate
```

### 4. 開発サーバーの起動

```bash
npm run dev
```

起動後、`http://localhost:3000` にアクセスしてください。

## データベース設計

### Video テーブル (YouTube動画情報)

YouTubeから取得した動画の基本情報と、字幕キャッシュを保持します。

| カラム名       | 型       | 制約         | 説明                      |
| :------------- | :------- | :----------- | :------------------------ |
| `id`           | String   | `@id` (cuid) | レコードの一意な識別子    |
| `youtubeId`    | String   | `@unique`    | YouTubeの動画ID           |
| `title`        | String   | -            | 動画のタイトル            |
| `thumbnailUrl` | String?  | Null許容     | 動画のサムネイル画像のURL |
| `subtitles`    | String?  | Null許容     | 取得した字幕テキスト      |
| `createdAt`    | DateTime | `now()`      | 登録日時                  |
| `updatedAt`    | DateTime | `@updatedAt` | 更新日時                  |

### Card テーブル (単語カード)

AIによって自動生成された英単語カードの情報を保持します。

| カラム名           | 型       | 制約          | 説明                                 |
| :----------------- | :------- | :------------ | :----------------------------------- |
| `id`               | String   | `@id` (cuid)  | レコードの一意な識別子               |
| `videoId`          | String   | `FK`, `Index` | 紐づくVideoテーブルのID              |
| `word`             | String   | -             | 対象となる英単語・フレーズ           |
| `meaning`          | String   | -             | 日本語の訳語                         |
| `englishSentence`  | String   | -             | 字幕から抽出、またはAIが生成した例文 |
| `japaneseSentence` | String   | -             | 例文の日本語訳                       |
| `context`          | String?  | Null許容      | AIによる単語の解説                   |
| `createdAt`        | DateTime | `now()`       | 作成日時                             |
| `updatedAt`        | DateTime | `@updatedAt`  | 更新日時                             |

- **リレーション関係**: `Video (1) ── (N) Card`
- `Video` レコードが削除された場合、紐づくすべての `Card` レコードも連動して削除されます (`onDelete: Cascade`)。
