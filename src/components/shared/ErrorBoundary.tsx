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
        <div className="flex flex-col items-center justify-center h-full gap-5 p-8">
          <span className="text-5xl" role="img" aria-label="错误">😵</span>
          <h2 className="text-lg font-semibold text-[var(--ds-text-primary)]">
            出错了
          </h2>
          <p className="text-sm text-[var(--ds-text-muted)] text-center max-w-xs leading-relaxed">
            {this.state.error?.message || '发生了未知错误，请稍后重试'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-6 py-2.5 rounded-xl bg-[var(--ds-accent)] text-white text-sm font-medium
                       hover:bg-[var(--ds-accent-hover)] active:scale-95 transition-all duration-150"
            aria-label="重试"
          >
            重试
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
