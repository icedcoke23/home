import { HOT_TAGS } from '../data';

interface Props {
  onTagClick: (text: string) => void;
}

export default function HotTags({ onTagClick }: Props) {
  return (
    <div className="relative z-10 w-full max-w-md mx-auto px-5">
      <div className="flex flex-wrap gap-2">
        {HOT_TAGS.map((tag) => (
          <button
            key={tag.id}
            onClick={() => onTagClick(tag.text)}
            className="px-4 py-2 rounded-full glass text-sm text-[var(--text2)]
                       hover:text-[var(--text)] hover:scale-105 active:scale-95
                       transition-all duration-200"
          >
            {tag.text}
          </button>
        ))}
      </div>
    </div>
  );
}
