import { useTTS } from "../hooks/useSpeech";

export default function SpeakBtn({ text, size = "md" }) {
  const { speak, stop, speakingText } = useTTS();
  const isPlaying = speakingText === text;
  const sz = size === "sm" ? "w-8 h-8 text-sm" : "w-9 h-9 text-base";

  return (
    <button
      onClick={() => isPlaying ? stop() : speak(text)}
      title={isPlaying ? "Stop" : "Pronounce"}
      className={`${sz} flex-shrink-0 flex items-center justify-center rounded-xl border-2 transition-all duration-200 cursor-pointer
        ${isPlaying
          ? "bg-pink-500 border-pink-500 text-white pulse-ring"
          : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-blue-900 hover:border-blue-900 hover:text-white"
        }`}
    >
      {isPlaying ? (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <rect x="6" y="5" width="4" height="14" rx="1"/>
          <rect x="14" y="5" width="4" height="14" rx="1"/>
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <path d="M3 9h4l5-5v16l-5-5H3V9zm13.5 3A4.5 4.5 0 0 0 12 7.5v9a4.5 4.5 0 0 0 4.5-4.5z"/>
        </svg>
      )}
    </button>
  );
}
