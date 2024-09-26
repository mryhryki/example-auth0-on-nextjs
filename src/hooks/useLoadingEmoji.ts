import { useEffect, useRef, useState } from 'react'

const LoadingEmojiList = [
  String.fromCodePoint(0x1f311),
  String.fromCodePoint(0x1f312),
  String.fromCodePoint(0x1f313),
  String.fromCodePoint(0x1f314),
  String.fromCodePoint(0x1f315),
  String.fromCodePoint(0x1f316),
  String.fromCodePoint(0x1f317),
  String.fromCodePoint(0x1f318),
] as const;

export const useLoadingEmoji = (): string => {
  const counter = useRef<number>(0);
  const [loadingEmoji, setLoadingEmoji] = useState<string>(LoadingEmojiList[0]);

  useEffect(() => {
    const id = setInterval(() => {
      counter.current += 1;
      setLoadingEmoji(
        LoadingEmojiList[counter.current % LoadingEmojiList.length]
      );
    }, 100);
    return () => clearInterval(id);
  }, []);

  return loadingEmoji;
};
