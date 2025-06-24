"use client";
import { useEffect, useRef, useState } from "react";

type TunicFontChar = keyof typeof tunicFontData;

const tunicFontData = {
  "T": [[0.1, 0], [0.9, 0], [0.5, 0], [0.5, 1]],
  "U": [[0.1, 0], [0.1, 1], [0.9, 1], [0.9, 0]],
  "N": [[0.1, 0], [0.1, 1], [0.9, 0], [0.9, 1]],
  "I": [[0.1, 0], [0.9, 0], [0.5, 0], [0.5, 1], [0.1, 1], [0.9, 1]],
  "C": [[0.9, 0.1], [0.1, 0.1], [0.1, 0.9], [0.9, 0.9]],
};

const words = [
  "MAGIC", "FLOAT", "WAVES", "DREAM", "CODE", "LIGHT", "SHINE", "GLIDE",
  "BREEZE", "SOFT", "GLOW", "MIST", "HOVER", "TWINKLE"
];

function drawTunicChar(
  context: CanvasRenderingContext2D,
  char: string,
  x: number,
  y: number,
  charWidth: number,
  charHeight: number,
  color: string
) {
  const upperChar = char.toUpperCase() as TunicFontChar;
  const data = tunicFontData[upperChar];
  if (!data) return;

  context.beginPath();
  context.strokeStyle = color;
  context.lineWidth = 4;
  context.lineCap = "round";
  context.lineJoin = "round";

  for (let i = 0; i < data.length; i += 2) {
    if (data[i + 1]) {
      const startX = x + data[i][0] * charWidth;
      const startY = y + data[i][1] * charHeight;
      const endX = x + data[i + 1][0] * charWidth;
      const endY = y + data[i + 1][1] * charHeight;
      context.moveTo(startX, startY);
      context.lineTo(endX, endY);
    } else {
      context.arc(
        x + data[i][0] * charWidth,
        y + data[i][1] * charHeight,
        2,
        0,
        Math.PI * 2
      );
    }
  }
  context.stroke();
}

function drawWaveLine(
  context: CanvasRenderingContext2D,
  x1: number,
  y: number,
  x2: number,
  t: number,
  amplitude = 6,
  freq = 1.5
) {
  context.save();
  context.beginPath();
  context.strokeStyle = "rgba(255,255,255,0.8)";
  context.lineWidth = 4;
  const steps = 60;
  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    const x = x1 + (x2 - x1) * progress;
    const yOffset = Math.sin(t + progress * Math.PI * freq) * amplitude;
    if (i === 0) context.moveTo(x, y + yOffset);
    else context.lineTo(x, y + yOffset);
  }
  context.stroke();
  context.restore();
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const [topWordIndex, setTopWordIndex] = useState(0);
  const [bottomWordIndex, setBottomWordIndex] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    context.scale(dpr, dpr);

    const baseCharHeight = 30;
    const spaceAboveTunic = 14;
    const spaceBelowTunic = 14;
    const spaceBetweenAnimatedAndTunic = 36;
    const spaceBetweenTunicAndBottom = 36;

    let lastChange = 0;
    const changeInterval = 2000;

    function getLetterOffset(index: number, time: number) {
      const speed = 1.2;
      const amplitude = 5;
      return Math.sin(time * speed + index * 1.3) * amplitude;
    }

    const draw = (timestamp?: number) => {
      const time = (timestamp ?? 0) / 1000;
      if (!canvas || !context) return;

      context.clearRect(0, 0, canvas.width, canvas.height);

      if (!isPaused && (timestamp ?? 0) - lastChange > changeInterval) {
        setTopWordIndex((i) => (i + 1) % words.length);
        setBottomWordIndex((i) => (i + 1) % words.length);
        lastChange = timestamp ?? 0;
      }

      const topWord = words[topWordIndex];
      const bottomWord = words[bottomWordIndex];

      context.font = "bold 30px Inter, sans-serif";

      const topMetrics = context.measureText(topWord);
      const bottomMetrics = context.measureText(bottomWord);
      const tunicMetrics = context.measureText("TUNIC");

      const animatedHeight = baseCharHeight;
      const tunicHeight = baseCharHeight;
      const animatedHeightBottom = baseCharHeight;

      const totalHeight =
        animatedHeight +
        spaceBetweenAnimatedAndTunic +
        tunicHeight +
        spaceAboveTunic +
        spaceBelowTunic +
        spaceBetweenTunicAndBottom +
        animatedHeightBottom;

      const canvasCenterY = canvas.height / dpr / 2;
      const startY = canvasCenterY - totalHeight / 2;
      const centerX = canvas.width / dpr / 2;

      // Texte du haut avec flottement (si pas en pause)
      let currentX = centerX - topMetrics.width / 2;
      for (let i = 0; i < topWord.length; i++) {
        const char = topWord[i];
        const charWidth = context.measureText(char).width;
        const charHeight = baseCharHeight;
        const offsetY = isPaused ? 0 : getLetterOffset(i, time);
        drawTunicChar(
          context,
          char,
          currentX,
          startY + animatedHeight + offsetY - charHeight,
          charWidth,
          charHeight,
          "rgba(255, 255, 255, 0.8)"
        );
        currentX += charWidth;
      }

      // Lignes ondulées — TOUJOURS animées, indépendamment de la pause
      const tunicStartX = centerX - tunicMetrics.width / 2;
      const tunicEndX = centerX + tunicMetrics.width / 2;
      const lineYTop = startY + animatedHeight + spaceBetweenAnimatedAndTunic + baseCharHeight / 2 - spaceAboveTunic;
      drawWaveLine(
        context,
        tunicStartX,
        lineYTop,
        tunicEndX,
        time,
        6,
        1.5
      );

      const lineYBottom = startY + animatedHeight + spaceBetweenAnimatedAndTunic + baseCharHeight / 2 + spaceBelowTunic;
      drawWaveLine(
        context,
        tunicStartX,
        lineYBottom,
        tunicEndX,
        time + 2.5,
        6,
        1.5
      );

      // Texte "TUNIC" entre les vagues
      let currentXt = tunicStartX;
      for (let i = 0; i < "TUNIC".length; i++) {
        const char = "TUNIC"[i];
        const charWidth = context.measureText(char).width;
        const charHeight = baseCharHeight;
        drawTunicChar(
          context,
          char,
          currentXt,
          startY + animatedHeight + spaceBetweenAnimatedAndTunic - charHeight / 2,
          charWidth,
          charHeight,
          "rgba(255, 255, 255, 1)"
        );
        currentXt += charWidth;
      }

      // Texte du bas avec flottement (si pas en pause)
      let currentXBottom = centerX - bottomMetrics.width / 2;
      for (let i = 0; i < bottomWord.length; i++) {
        const char = bottomWord[i];
        const charWidth = context.measureText(char).width;
        const charHeight = baseCharHeight;
        const offsetY = isPaused ? 0 : getLetterOffset(i, time + 1);
        drawTunicChar(
          context,
          char,
          currentXBottom,
          lineYBottom + spaceBetweenTunicAndBottom + baseCharHeight + offsetY - charHeight,
          charWidth,
          charHeight,
          "rgba(255, 255, 255, 0.8)"
        );
        currentXBottom += charWidth;
      }

      requestRef.current = requestAnimationFrame(draw);
    };

    requestRef.current = requestAnimationFrame(draw);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [topWordIndex, bottomWordIndex, isPaused]);

  const handleCanvasClick = () => {
    setIsPaused((p) => !p);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 overflow-hidden">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="absolute top-0 left-0 w-full h-full cursor-pointer"
        style={{ userSelect: "none" }}
      />
      {/* Texte supprimé, rien d’affiché sous le canvas */}
    </div>
  );
}
