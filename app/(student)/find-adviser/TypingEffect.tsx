"use client";

import { useEffect, useState } from "react";

interface TypingTextProps {
  text: string;
  className?: string;
  startDelay?: number;
  speed?: number;
}

const TypingText = ({
  text,
  className,
  startDelay = 0,
  speed = 25,
}: TypingTextProps) => {
  const [displayedText, setDisplayedText] = useState("");
  const [started, setStarted] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  // Start typing after delay
  useEffect(() => {
    const delayTimer = setTimeout(() => setStarted(true), startDelay * 1000);
    return () => clearTimeout(delayTimer);
  }, [startDelay]);

  // Blinking cursor
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  // Typing effect
  useEffect(() => {
    if (!started) return;
    let i = 0;

    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i === text.length) clearInterval(interval);
    }, speed);

    return () => clearInterval(interval);
  }, [started, text, speed]);

  return (
    <p className={className}>
      {displayedText}
      <span className="inline-block w-[1ch]">
        {showCursor ? "|" : "\u00A0"}
      </span>
    </p>
  );
};

export default TypingText;
