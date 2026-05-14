export default function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  return (
    <div
      className="fixed bottom-32 left-1/2 -translate-x-1/2 z-50
                 px-5 py-3 rounded-2xl glass text-[14px] font-medium text-[var(--text-primary)]
                 anim-enter-up shadow-[var(--shadow-lg)] max-w-[85vw] truncate"
      onClick={onClose}
    >
      {msg}
    </div>
  );
}