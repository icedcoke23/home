import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
          <div className="text-4xl">😵</div>
          <h2 className="text-lg font-medium text-[var(--ds-text-primary)]">出错了</h2>
          <p className="text-sm text-[var(--ds-text-muted)] text-center max-w-xs">
            {this.state.error?.message || '未知错误'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 rounded-xl bg-[var(--ds-accent)] text-white text-sm active:scale-95 transition-transform"
          >
            重试
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
