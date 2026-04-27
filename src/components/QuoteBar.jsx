import { useEffect, useState } from "react";

const QUOTES = [
  {
    text: "The journey of a thousand miles begins with a single step.",
    author: "Lao Tzu",
  },
  { text: "Every expert was once a beginner. Keep going!", author: "" },
  {
    text: "Your English will improve every single day. Trust the process.",
    author: "",
  },
  { text: "Confidence comes from doing, not from waiting.", author: "" },
  { text: "Speak boldly. Mistakes are just proof you are trying.", author: "" },
  { text: "Fluency is not perfection — it is communication.", author: "" },
  { text: "Dream big. Start small. Act now.", author: "" },
  {
    text: "You don't have to be great to start, but you have to start to be great.",
    author: "",
  },
  { text: "The more you practice, the luckier you get.", author: "" },
  { text: "Small daily improvements lead to stunning results.", author: "" },
];

export default function QuoteBar() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIdx((i) => (i + 1) % QUOTES.length);
        setVisible(true);
      }, 500);
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const q = QUOTES[idx];
  return (
    <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-[#0f3460] text-white px-4 py-3 text-center sticky top-0 z-50 shadow-lg min-h-[52px] flex items-center justify-center">
      <p
        className={`text-sm italic max-w-2xl leading-relaxed transition-all duration-500 ${visible ? "opacity-90 translate-y-0" : "opacity-0 -translate-y-1"}`}
      >
        ✦ "{q.text}"
        {q.author && (
          <span className="text-xs text-white/50 ml-2 not-italic">
            — {q.author}
          </span>
        )}
      </p>
    </div>
  );
}
