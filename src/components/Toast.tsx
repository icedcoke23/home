export default function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-full glass
                    text-xs text-[var(--text)] anim-fade-up shadow-lg"
         onAnimationEnd={(e) => { if (e.animationName === 'fade-up') setTimeout(onClose, 2000); }}>
      {msg}
    </div>
  );
}
