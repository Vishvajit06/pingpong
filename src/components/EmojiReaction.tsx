interface EmojiReactionProps {
  emoji: string;
  left: string;
  top: string;
  delay: number;
}

export function EmojiReaction({ emoji, left, top, delay }: EmojiReactionProps) {
  return (
    <div
      className="absolute text-4xl animate-bounce opacity-40 hover:opacity-80 transition-opacity cursor-pointer"
      style={{
        left,
        top,
        animationDelay: `${delay}s`,
        animationDuration: '2s',
      }}
    >
      {emoji}
    </div>
  );
}
