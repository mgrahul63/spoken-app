import { useEffect, useRef, useState } from "react";
import { useSpeechRecognition, useTTS } from "../../hooks/useSpeech";

export default function ConversationSection({ conversation, onDone, done }) {
  const { speak } = useTTS();
  const { listening, transcript, error, startListening, stopListening, reset } =
    useSpeechRecognition();

  const [stepIdx, setStepIdx] = useState(0);
  const [userReplies, setUserReplies] = useState({});
  const [typedInput, setTypedInput] = useState("");
  const [mode, setMode] = useState("type");
  const [finished, setFinished] = useState(false);

  const chatRef = useRef(null);
  const steps = conversation?.steps || [];
  const current = steps[stepIdx];

  useEffect(() => {
    if (chatRef.current)
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [stepIdx, userReplies]);

  useEffect(() => {
    if (!current) return;
    if (current.speaker === "app") {
      speak(current.text);
      const timer = setTimeout(() => setStepIdx((prev) => prev + 1), 1200);
      return () => clearTimeout(timer);
    }
  }, [stepIdx]);

  function submitReply(text) {
    if (!text.trim()) return;
    setUserReplies((prev) => ({ ...prev, [stepIdx]: text }));
    reset();
    setTypedInput("");
    if (stepIdx + 1 < steps.length) setStepIdx((prev) => prev + 1);
    else setFinished(true);
  }

  function handleMic() {
    if (listening) stopListening();
    else {
      reset();
      startListening();
    }
  }

  if (!conversation)
    return <p className="text-red-400 text-sm">No conversation data</p>;

  if (finished) {
    return (
      <div className="space-y-4">
        <div className="text-center py-4">
          <div className="text-4xl mb-2">🤝</div>
          <h3 className="text-base font-bold text-white">
            Conversation Completed!
          </h3>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 space-y-2 max-h-64 overflow-y-auto">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`flex ${s.speaker === "app" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`px-3 py-2 rounded-xl text-sm max-w-[75%] ${
                  s.speaker === "app"
                    ? "bg-violet-600/20 border border-violet-500/20 text-violet-200"
                    : "bg-white/[0.08] border border-white/[0.10] text-slate-200"
                }`}
              >
                {s.speaker === "app" ? s.text : userReplies[i] || "(no reply)"}
              </div>
            </div>
          ))}
        </div>

        {!done ? (
          <div className="flex justify-end">
            <button
              onClick={onDone}
              className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-violet-900/30"
            >
              Complete ✓
            </button>
          </div>
        ) : (
          <p className="text-right text-emerald-400 font-semibold text-sm">
            ✓ Conversation completed!
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Scenario */}
      <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3">
        <p className="text-sm font-semibold text-indigo-300">
          {conversation.scenario}
        </p>
      </div>

      {/* Chat */}
      <div
        ref={chatRef}
        className="space-y-2 max-h-56 overflow-y-auto bg-white/[0.02] border border-white/[0.06] rounded-xl p-3"
      >
        {steps.slice(0, stepIdx).map((s, i) => (
          <div
            key={i}
            className={`flex ${s.speaker === "app" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`px-3 py-2 rounded-xl text-sm max-w-[75%] ${
                s.speaker === "app"
                  ? "bg-violet-600/20 border border-violet-500/20 text-violet-200"
                  : "bg-white/[0.08] border border-white/[0.10] text-slate-200"
              }`}
            >
              {s.speaker === "app" ? s.text : userReplies[i]}
            </div>
          </div>
        ))}
        {current?.speaker === "user" && (
          <p className="text-xs text-slate-600 italic text-center">
            💭 {current.prompt}
          </p>
        )}
      </div>

      {/* Input */}
      {current?.speaker === "user" && (
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 space-y-3">
          {/* Mode toggle */}
          <div className="flex gap-2">
            {["type", "mic"].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  mode === m
                    ? "bg-violet-600 text-white"
                    : "bg-white/[0.05] text-slate-400 hover:bg-white/10"
                }`}
              >
                {m === "type" ? "✍️ Type" : "🎤 Speak"}
              </button>
            ))}
          </div>

          {mode === "type" ? (
            <div className="flex gap-2">
              <input
                value={typedInput}
                onChange={(e) => setTypedInput(e.target.value)}
                placeholder="Type your reply..."
                className="flex-1 bg-white/[0.05] border border-white/[0.08] text-slate-200 placeholder-slate-600 px-3 py-2 rounded-xl text-sm focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
                onKeyDown={(e) => e.key === "Enter" && submitReply(typedInput)}
              />
              <button
                onClick={() => submitReply(typedInput)}
                className="bg-violet-600 hover:bg-violet-500 text-white px-4 rounded-xl text-sm font-semibold transition-all"
              >
                Send
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={handleMic}
                className={`px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all ${
                  listening
                    ? "bg-red-500 animate-pulse"
                    : "bg-violet-600 hover:bg-violet-500"
                }`}
              >
                {listening ? "⏹ Stop Listening" : "🎤 Start Speaking"}
              </button>
              {transcript && (
                <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-3">
                  <p className="text-sm text-slate-300">"{transcript}"</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => submitReply(transcript)}
                      className="text-xs text-emerald-400 font-semibold hover:text-emerald-300"
                    >
                      Use this ✓
                    </button>
                    <button
                      onClick={reset}
                      className="text-xs text-slate-500 hover:text-slate-400"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}
              {error && <p className="text-xs text-red-400">{error}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
