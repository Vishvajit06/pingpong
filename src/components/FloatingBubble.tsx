interface FloatingBubbleProps {
  delay: number;
  duration: number;
  size: string;
  left: string;
  top: string;
  emoji?: string;
}

export function FloatingBubble({ delay, duration, size, left, top, emoji }: FloatingBubbleProps) {
  return (
    <div
      className="absolute opacity-20 animate-float"
      style={{
        left,
        top,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      <div
        className="rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {emoji && <span className="text-2xl">{emoji}</span>}
      </div>
    </div>
  );
}
