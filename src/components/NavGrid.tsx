import { useRef, useCallback } from 'react';
import { NAV_LINKS } from '../data';

interface Props {
  onToast: (msg: string) => void;
}

export default function NavGrid({ onToast }: Props) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onTouchStart = useCallback((link: typeof NAV_LINKS[0]) => () => {
    timerRef.current = setTimeout(() => {
      onToast(`📋 ${link.title}: ${link.url}`);
      if (navigator.vibrate) navigator.vibrate(15);
    }, 600);
  }, [onToast]);

  const onTouchEnd = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  }, []);

  return (
    <div className="relative z-10 w-full max-w-md mx-auto px-5 mt-4">
      <div className="grid grid-cols-4 gap-2.5 stagger">
        {NAV_LINKS.map((link) => (
          <a
            key={link.id}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            onTouchStart={onTouchStart(link)}
            onTouchEnd={onTouchEnd}
            onTouchMove={onTouchEnd}
            className="flex flex-col items-center gap-1.5 p-2.5 rounded-xl glass
                       hover:scale-105 active:scale-95 transition-all duration-200
                       cursor-pointer"
            aria-label={`打开 ${link.title}`}
          >
            <span className="text-2xl">{link.icon}</span>
            <span className="text-[10px] text-[var(--text2)] truncate w-full text-center leading-tight">
              {link.title}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
