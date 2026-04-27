import { useState } from "react";

export function speak(text, onStart, onEnd) {
  if (!("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();

  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = 0.85;

  if (onStart) u.onstart = onStart;
  if (onEnd) {
    u.onend = onEnd;
    u.onerror = onEnd;
  }

  window.speechSynthesis.speak(u);
}

export default function SpeakBtn({ text, className }) {
  const [playing, setPlaying] = useState(false);

  return (
    <button
      className={`${className} cursor-pointer`}
      onClick={() =>
        speak(
          text,
          () => setPlaying(true),
          () => setPlaying(false),
        )
      }
    >
      <svg width="25" height="25" viewBox="0 0 24 24" fill="#94a3b8">
        {playing ? (
          <path d="M3 9h4l5-5v16l-5-5H3V9zm13.5 3A4.5 4.5 0 0 0 12 7.5v9a4.5 4.5 0 0 0 4.5-4.5zM12 3.23v2.06a7 7 0 0 1 0 13.42v2.06A9 9 0 0 0 12 3.23z" />
        ) : (
          <path d="M3 9h4l5-5v16l-5-5H3V9zm13.5 3A4.5 4.5 0 0 0 12 7.5v9a4.5 4.5 0 0 0 4.5-4.5z" />
        )}
      </svg>
    </button>
  );
}
