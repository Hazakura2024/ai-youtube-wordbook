"use client";

import React, { useState } from "react";

interface FlashCardProps {
  word: string;
  meaning: string;
  englishSentence: string;
  japaneseSentence: string;
  context: string;
}

export function FlashCard({
  word,
  meaning,
  englishSentence,
  japaneseSentence,
  context,
}: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="w-full h-56 cursor-pointer [perspective:1000px]"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      {/* 3D回転を管理するコンテナ */}
      <div
        className={`relative w-full h-full duration-500 [transform-style:preserve-3d] ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* --- 表：英語（English） --- */}
        <div className="absolute w-full h-full p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm flex flex-col justify-center items-center [backface-visibility:hidden]">
          <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-2">
            ENGLISH
          </span>
          <h3 className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 text-center line-clamp-2">
            {word}
          </h3>
          <p className="text-[11px] text-zinc-400 mt-6 animate-pulse">
            クリックして意味を見る
          </p>
        </div>

        {/* --- 裏：日本語（Japanese & Details） --- */}
        {/* rotateY(180deg) で最初から裏返しにしておきます */}
        <div className="absolute w-full h-full p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-y-auto">
          {/* 日本語の意味 */}
          <div>
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-1">
              MEANING
            </span>
            <p className="text-lg font-bold text-zinc-800 dark:text-zinc-100">
              {meaning}
            </p>
          </div>

          {/* 例文と翻訳 */}
          <div className="my-2 border-t border-zinc-200 dark:border-zinc-800 pt-2 flex-1">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block mb-1">
              CONTEXT & EXAMPLE
            </span>
            <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 italic leading-relaxed">
              "{englishSentence}"
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
              {japaneseSentence}
            </p>
          </div>

          {/* ニュアンスのヒント */}
          <div className="text-[10px] text-zinc-400 dark:text-zinc-500 border-t border-zinc-200 dark:border-zinc-800 pt-1.5 flex items-center gap-1">
            <span>💡</span>
            <span className="line-clamp-2 leading-tight">{context}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
