import { useRef, useState } from "react";
import { useTTS } from "../../hooks/useSpeech";

export default function SpeakingSection({ speaking: data, onDone, done }) {
  const { speak, speaking } = useTTS();
  const [showTips, setShowTips] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  async function startRecording() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setRecordings((prev) => [
          { url, time: new Date().toLocaleTimeString() },
          ...prev,
        ]);
        stream.getTracks().forEach((t) => t.stop());
        setRecordingTime(0);
      };

      mediaRecorder.start();
      setIsRecording(true);

      let secs = 0;
      timerRef.current = setInterval(() => {
        secs += 1;
        setRecordingTime(secs);
        if (secs >= 120) stopRecording();
      }, 1000);
    } catch {
      setError(
        "Microphone access denied. Please allow mic access and try again.",
      );
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  }

  function deleteRecording(index) {
    setRecordings((prev) => {
      URL.revokeObjectURL(prev[index].url);
      return prev.filter((_, i) => i !== index);
    });
  }

  function formatTime(secs) {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  }

  return (
    <div className="space-y-4">
      {/* Topic */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-1">
          🎤 Speaking Topic
        </p>
        <p className="text-base font-bold text-white mb-2">"{data.topic}"</p>
        <p className="text-sm text-slate-400 leading-relaxed">{data.prompt}</p>
      </div>

      {/* Example */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 flex items-start gap-3">
        <button
          onClick={() => speak(data.example)}
          className={`shrink-0 w-9 h-9 flex items-center justify-center rounded-xl border transition-all text-sm
            ${
              speaking
                ? "bg-violet-600 border-violet-500 text-white"
                : "bg-white/[0.04] border-white/[0.08] text-slate-400 hover:border-violet-500/40 hover:text-violet-300"
            }`}
        >
          🔊
        </button>
        <div>
          <p className="text-[11px] font-semibold text-slate-500 mb-1">
            Example Answer:
          </p>
          <p className="text-sm text-slate-300 italic">"{data.example}"</p>
        </div>
      </div>

      {/* Tips */}
      <div>
        <button
          onClick={() => setShowTips((s) => !s)}
          className="text-xs text-violet-400 font-semibold hover:text-violet-300 transition-colors flex items-center gap-1"
        >
          💡 {showTips ? "Hide Tips" : "Show Speaking Tips"}
        </button>
        {showTips && (
          <div className="mt-2 bg-yellow-500/5 border border-yellow-500/15 rounded-xl p-4">
            <ul className="space-y-1.5">
              {data.tips.map((tip, i) => (
                <li
                  key={i}
                  className="text-xs text-yellow-300/80 flex items-start gap-2"
                >
                  <span className="text-yellow-500 mt-0.5">✦</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Recorder */}
      <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-6 text-center">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`w-[72px] h-[72px] rounded-full flex items-center justify-center mx-auto mb-3 text-2xl transition-all duration-200 border-4 shadow-lg
            ${
              isRecording
                ? "bg-red-500/20 border-red-400 scale-110 animate-pulse"
                : "bg-violet-600/20 border-violet-500/40 hover:scale-105 hover:bg-violet-600/30"
            }`}
        >
          {isRecording ? "⏹" : "🎤"}
        </button>

        {isRecording ? (
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
              <span className="text-xs font-semibold text-red-400">
                Recording
              </span>
            </div>
            <p className="text-2xl font-mono font-bold text-white">
              {formatTime(recordingTime)}
            </p>
            <p className="text-[11px] text-slate-600">
              Tap ⏹ to stop · Auto-stops at 2:00
            </p>
          </div>
        ) : (
          <p className="text-xs font-medium text-slate-500">
            Tap 🎤 to start recording
          </p>
        )}

        {error && (
          <p className="mt-3 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
      </div>

      {/* Recordings */}
      {recordings.length > 0 && (
        <div className="space-y-2">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
            Your Recordings
          </p>
          {recordings.map((r, i) => (
            <div
              key={i}
              className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-3 flex items-center gap-3"
            >
              <span className="text-base shrink-0">🎙️</span>
              <div className="flex-1 min-w-0">
                <audio
                  controls
                  src={r.url}
                  className="w-full h-8"
                  style={{ colorScheme: "dark", accentColor: "#7c3aed" }}
                />
                <p className="text-[11px] text-slate-600 mt-1">{r.time}</p>
              </div>
              <button
                onClick={() => deleteRecording(i)}
                className="shrink-0 text-slate-600 hover:text-red-400 transition-colors"
                title="Delete"
              >
                🗑️
              </button>
            </div>
          ))}

          <div className="bg-indigo-500/5 border border-indigo-500/15 rounded-xl px-4 py-3">
            <p className="text-xs text-indigo-300/80">
              🎧 <strong>Self-evaluate:</strong> Listen back and compare your
              pronunciation and fluency with the example above.
            </p>
          </div>
        </div>
      )}

      {!done ? (
        <div className="flex justify-end">
          <button
            onClick={onDone}
            className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all duration-200 hover:-translate-y-0.5 shadow-lg shadow-violet-900/30"
          >
            Mark as Done ✓
          </button>
        </div>
      ) : (
        <p className="text-right text-emerald-400 font-semibold text-sm">
          ✓ Speaking completed!
        </p>
      )}
    </div>
  );
}
