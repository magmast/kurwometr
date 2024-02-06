import Artyom from "artyom.js";
import { useRef, useState } from "react";
import sound from "./assets/count.wav";

const KEYWORD = "kurwa";

function lazy<T>(init: () => T): () => T {
  let value: T;

  return () => {
    if (value === undefined) {
      value = init();
    }
    return value;
  };
}

function countKeyword(s: string): number {
  return s.toLowerCase().split(KEYWORD).length - 1;
}

export function App() {
  const [count, setCount] = useState(0);
  const [listening, setListening] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);

  function addToCounter(count: number) {
    setCount((prev) => prev + count);
    audio.current?.play();
  }

  const [artyom] = useState(() => lazy(() => new Artyom()));

  function start() {
    const art = artyom();

    art.addCommands({
      indexes: ["dummy"],
      action: () => {},
    });

    art.redirectRecognizedTextOutput((text: string, final: boolean) => {
      if (!final) {
        return;
      }

      addToCounter(countKeyword(text));
    });

    art.initialize({
      lang: "pl-PL",
      continuous: true,
      listen: true,
      debug: true,
    });

    setListening(true);
  }

  function pause() {
    artyom().fatality();
    setListening(false);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <p className="text-7xl font-mono text-center mb-16">
        {count.toFixed(0).padStart(4, "0")}
      </p>

      <button
        className="bg-primary text-primary-foreground w-[128px] py-2 rounded"
        onClick={listening ? pause : start}
      >
        {listening ? "PAUSE" : "START"}
      </button>

      <audio ref={audio} src={sound} />
    </main>
  );
}
