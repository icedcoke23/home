import { lazy, Suspense, useEffect } from 'react';
import HomePage from './components/HomePage';
import Sidebar from './components/Sidebar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useAppStore } from './store/appStore';

const Settings = lazy(() => import('./components/Settings'));

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppStore((s) => s.settings.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('theme-light');
    } else {
      root.classList.remove('theme-light');
    }
  }, [theme]);

  return <>{children}</>;
}

function AppContent() {
  const currentView = useAppStore((s) => s.currentView);

  return (
    <div className="h-full w-full relative overflow-hidden">
      <Sidebar />
      {currentView === 'settings' ? (
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--ds-accent)] animate-pulse-dot" style={{ animationDelay: '0s' }} />
              <span className="w-2 h-2 rounded-full bg-[var(--ds-accent)] animate-pulse-dot" style={{ animationDelay: '0.15s' }} />
              <span className="w-2 h-2 rounded-full bg-[var(--ds-accent)] animate-pulse-dot" style={{ animationDelay: '0.3s' }} />
            </div>
          </div>
        }>
          <Settings />
        </Suspense>
      ) : (
        <HomePage />
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
