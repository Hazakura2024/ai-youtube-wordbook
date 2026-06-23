import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";
import { Pool } from "pg";

const prismaClientSingleton = () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
};

// 学習メモ: 実行環境全体で共通して使える箱の中に prismaGlobal という名前で PrismaClient インスタンスを入れておくよ」と宣言
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

// 学習メモ: すでにグローバルに PrismaClient が存在すればそれを再利用し、なければ新規に作成する
export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// 学習メモ: 開発環境のときだけ、作成した prisma インスタンスをグローバルの箱（globalThis.prismaGlobal）に避難させて再利用
if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
