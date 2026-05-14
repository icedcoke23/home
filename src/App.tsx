import { lazy, Suspense } from 'react';
import HomePage from './components/HomePage';
import Sidebar from './components/Sidebar';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useAppStore } from './store/appStore';

const Settings = lazy(() => import('./components/Settings'));

function AppContent() {
  const currentView = useAppStore((s) => s.currentView);

  return (
    <div className="h-full w-full relative overflow-hidden">
      <Sidebar />
      {currentView === 'settings' ? (
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <div className="flex gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--ds-accent)] animate-[pulse-dot_1.4s_infinite]" />
              <span className="w-2 h-2 rounded-full bg-[var(--ds-accent)] animate-[pulse-dot_1.4s_0.2s_infinite]" />
              <span className="w-2 h-2 rounded-full bg-[var(--ds-accent)] animate-[pulse-dot_1.4s_0.4s_infinite]" />
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
      <AppContent />
    </ErrorBoundary>
  );
}
