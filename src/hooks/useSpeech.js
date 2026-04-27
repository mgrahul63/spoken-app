import { useState, useCallback, useRef } from "react";

export function useTTS() {
  const [speaking, setSpeaking] = useState(false);
  const [speakingText, setSpeakingText] = useState(null);

  const speak = useCallback((text, rate = 0.85) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = rate;
    u.pitch = 1;
    u.onstart = () => { setSpeaking(true); setSpeakingText(text); };
    u.onend = () => { setSpeaking(false); setSpeakingText(null); };
    u.onerror = () => { setSpeaking(false); setSpeakingText(null); };
    window.speechSynthesis.speak(u);
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setSpeakingText(null);
  }, []);

  return { speak, stop, speaking, speakingText };
}

export function useSpeechRecognition() {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { setError("Speech recognition not supported in this browser."); return; }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "en-US";
    recognitionRef.current.interimResults = false;
    recognitionRef.current.maxAlternatives = 1;

    recognitionRef.current.onresult = (e) => {
      setTranscript(e.results[0][0].transcript);
      setListening(false);
    };
    recognitionRef.current.onend = () => setListening(false);
    recognitionRef.current.onerror = (e) => { setError(e.error); setListening(false); };

    recognitionRef.current.start();
    setListening(true);
    setTranscript("");
    setError(null);
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setListening(false);
  }, []);

  const reset = useCallback(() => setTranscript(""), []);

  return { listening, transcript, error, startListening, stopListening, reset };
}
