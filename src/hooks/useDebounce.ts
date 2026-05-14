import { useEffect, useRef } from 'react';

export function useDebounce(callback: () => void, delay: number, deps: unknown[]): void {
  const ref = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    clearTimeout(ref.current);
    ref.current = setTimeout(callback, delay);
    return () => clearTimeout(ref.current);
  }, deps);
}
