export default function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  return (
    <div
      className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl glass
                 text-sm text-[var(--text-primary)] anim-enter-up shadow-xl max-w-[90vw] truncate"
      onAnimationEnd={(e) => {
        if (e.animationName === 'enter-up') setTimeout(onClose, 2000);
      }}
    >
      {msg}
    </div>
  );
}
