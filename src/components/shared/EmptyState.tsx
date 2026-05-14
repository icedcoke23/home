interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 px-4">
      <span className="text-4xl" role="img" aria-hidden>{icon}</span>
      <h3 className="text-base font-medium text-[var(--ds-text-primary)]">
        {title}
      </h3>
      <p className="text-sm text-[var(--ds-text-muted)] text-center max-w-xs leading-relaxed">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-1 px-5 py-2.5 rounded-xl bg-[var(--ds-accent)] text-white text-sm font-medium
                     hover:bg-[var(--ds-accent-hover)] active:scale-95 transition-all duration-150"
          aria-label={action.label}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
