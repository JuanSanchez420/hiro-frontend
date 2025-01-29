import React, { useState, useEffect } from "react";

interface TypingEffectProps {
  lines: string[];
  speed?: number;
}

const TypingEffect = ({ lines, speed = 25 }: TypingEffectProps) => {
  const [typedLines, setTypedLines] = useState<string[]>([]);
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  // Reset whenever lines change
  useEffect(() => {
    setTypedLines(Array(lines.length).fill(""));
    setLineIndex(0);
    setCharIndex(0);
  }, [lines]);

  // Type out the current line character by character
  useEffect(() => {
    if (lineIndex < lines.length) {
      const currentLine = lines[lineIndex];
      if (charIndex < currentLine.length) {
        const timeoutId = setTimeout(() => {
          setTypedLines((prev) => {
            const updated = [...prev];
            updated[lineIndex] += currentLine[charIndex];
            return updated;
          });
          setCharIndex((prev) => prev + 1);
        }, speed);

        return () => clearTimeout(timeoutId);
      } else {
        // Move to the next line
        const timeoutId = setTimeout(() => {
          setLineIndex((prev) => prev + 1);
          setCharIndex(0);
        }, speed);
        return () => clearTimeout(timeoutId);
      }
    }
  }, [lineIndex, charIndex, lines, speed]);

  return (
    <div>
      {typedLines.map((line, index) => (
        <div key={index}>{line}</div>
      ))}
    </div>
  );
};

export default TypingEffect;