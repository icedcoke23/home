const TAGS = [
  { text: 'React 19', hot: true },
  { text: 'Tailwind CSS' },
  { text: 'AI 编程', hot: true },
  { text: 'TypeScript' },
  { text: 'Vite' },
];

interface Props { onTagClick: (text: string) => void; }

export default function HotTags({ onTagClick }: Props) {
  return (
    <div className="relative z-10 w-full max-w-md mx-auto px-5">
      {/* Label */}
      <p className="text-[11px] font-semibold text-[var(--text-muted)] mb-2 tracking-widest uppercase">
        热门
      </p>
      
      <div className="flex flex-wrap gap-2">
        {TAGS.map((tag) => (
          <button
            key={tag.text}
            onClick={() => onTagClick(tag.text)}
            className={`group relative px-4 py-2 rounded-xl text-[14px] font-medium
                       border transition-all duration-200 pressable
                       ${tag.hot
                         ? 'bg-[var(--brand-soft)] border-[var(--brand)]/20 text-[var(--brand)] hover:bg-[var(--brand-muted)]'
                         : 'bg-[var(--bg-elevated)] border-[var(--border-default)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-focus)]'
                       }`}
          >
            {tag.hot && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[var(--brand)] animate-pulse" />
            )}
            {tag.text}
          </button>
        ))}
      </div>
    </div>
  );
}