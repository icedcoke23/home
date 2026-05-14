const TAGS = ['React 19', 'Tailwind CSS', 'AI 编程', 'TypeScript', 'Vite'];

interface Props { onTagClick: (text: string) => void; }

export default function HotTags({ onTagClick }: Props) {
  return (
    <div className="relative z-10 w-full max-w-md mx-auto px-5">
      <div className="flex flex-wrap gap-2.5">
        {TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagClick(tag)}
            className="px-4 py-2 rounded-full bg-[var(--bg-overlay)] text-sm text-[var(--text-secondary)]
                       hover:text-[var(--text-primary)] hover:bg-[var(--brand-soft)]
                       active:scale-95 transition-all duration-200"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}
