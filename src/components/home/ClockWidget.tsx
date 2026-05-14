import { useState, useEffect } from 'react';
import { useStore } from '../../store/appStore';

interface ClockWidgetProps {
  weather?: { icon: string; temp: string } | null;
}

export default function ClockWidget({ weather }: ClockWidgetProps) {
  const showClock = useStore((s) => s.settings.showClock);
  const showWeather = useStore((s) => s.settings.showWeather);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!showClock) return null;

  const timeStr = now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const dateStr = now.toLocaleDateString('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  return (
    <div className="flex items-center justify-between px-1">
      <div className="flex flex-col gap-0.5">
        <time className="text-[32px] font-semibold tracking-tight text-[var(--ds-text-primary)] leading-none">
          {timeStr}
        </time>
        <span className="text-xs text-[var(--ds-text-secondary)]">
          {dateStr}
        </span>
      </div>
      {showWeather && weather && (
        <div className="flex items-center gap-1.5 text-[var(--ds-text-secondary)]">
          <span className="text-2xl" role="img" aria-label={weather.temp}>
            {weather.icon}
          </span>
          <span className="text-sm font-medium text-[var(--ds-text-primary)]">
            {weather.temp}°C
          </span>
        </div>
      )}
    </div>
  );
}
