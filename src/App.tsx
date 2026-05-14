import { lazy, Suspense, useRef } from 'react';
import { useStore } from './store/appStore';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import Sidebar from './components/layout/Sidebar';
import HomeView from './components/home/HomeView';
import ChatView from './components/chat/ChatView';

const SettingsView = lazy(() => import('./components/settings/SettingsView'));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex gap-1.5">
        <span className="w-2 h-2 rounded-full bg-[var(--ds-accent)] animate-[pulse-dot_1.4s_infinite]" />
        <span className="w-2 h-2 rounded-full bg-[var(--ds-accent)] animate-[pulse-dot_1.4s_0.2s_infinite]" />
        <span className="w-2 h-2 rounded-full bg-[var(--ds-accent)] animate-[pulse-dot_1.4s_0.4s_infinite]" />
      </div>
    </div>
  );
}

function AppContent() {
  const page = useStore((s) => s.page);
  const searchRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="h-full w-full relative overflow-hidden">
      <Sidebar />

      {page === 'settings' ? (
        <Suspense fallback={<LoadingFallback />}>
          <SettingsView />
        </Suspense>
      ) : page === 'chat' ? (
        <ChatView />
      ) : (
        <HomeView searchInputRef={searchRef} />
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
