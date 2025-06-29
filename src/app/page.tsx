"use client";
import { useEffect, useRef, useState } from "react";
import "destyle.css";
import "./page.css";

type TunicFontChar = keyof typeof tunicFontData;

const tunicFontData = {
    "T": [[0.1, 0], [0.9, 0], [0.5, 0], [0.5, 1]],
    "U": [[0.1, 0], [0.1, 1], [0.9, 1], [0.9, 0]],
    "N": [[0.1, 0], [0.1, 1], [0.9, 0], [0.9, 1]],
    "I": [[0.1, 0], [0.9, 0], [0.5, 0], [0.5, 1], [0.1, 1], [0.9, 1]],
    "C": [[0.9, 0.1], [0.1, 0.1], [0.1, 0.9], [0.9, 0.9]],
    "M": [[0.1, 0], [0.1, 1], [0.5, 0.3], [0.9, 1], [0.9, 0]],
    "A": [[0.1, 1], [0.5, 0], [0.9, 1], [0.2, 0.6], [0.8, 0.6]],
    "G": [[0.9, 0.1], [0.1, 0.1], [0.1, 0.9], [0.9, 0.9], [0.9, 0.5], [0.6, 0.5]],
    "F": [[0.1, 0], [0.1, 1], [0.9, 1], [0.1, 0.5], [0.7, 0.5]],
    "L": [[0.1, 0], [0.1, 1], [0.9, 1]],
    "O": [[0.1, 0.1], [0.1, 0.9], [0.9, 0.9], [0.9, 0.1], [0.1, 0.1]],
    "W": [[0, 0], [0.2, 1], [0.5, 0.7], [0.8, 1], [1, 0]],
    "V": [[0, 0], [0.5, 1], [1, 0]],
    "E": [[0.9, 0], [0.1, 0], [0.1, 1], [0.9, 1], [0.1, 0.5], [0.7, 0.5]],
    "S": [[0.9, 0.1], [0.1, 0.1], [0.1, 0.5], [0.9, 0.5], [0.9, 0.9], [0.1, 0.9]],
    "D": [[0.1, 0], [0.1, 1], [0.7, 1], [0.9, 0.8], [0.9, 0.2], [0.7, 0]],
    "R": [[0.1, 0], [0.1, 1], [0.9, 1], [0.9, 0.5], [0.1, 0.5], [0.9, 0]],
    "B": [[0.1, 0], [0.1, 1], [0.7, 1], [0.9, 0.8], [0.7, 0.5], [0.1, 0.5], [0.7, 0.5], [0.9, 0.2], [0.7, 0]],
    "Z": [[0.1, 0], [0.9, 0], [0.1, 1], [0.9, 1]],
    "H": [[0.1, 0], [0.1, 1], [0.9, 0], [0.9, 1], [0.1, 0.5], [0.9, 0.5]],
    "K": [[0.1, 0], [0.1, 1], [0.9, 0], [0.1, 0.5], [0.9, 1]],
    "P": [[0.1, 0], [0.1, 1], [0.9, 1], [0.9, 0.5], [0.1, 0.5]],
    "Y": [[0.1, 0], [0.5, 0.5], [0.9, 0], [0.5, 0.5], [0.5, 1]],
    "J": [[0.1, 0.1], [0.1, 0.3], [0.9, 0.3], [0.9, 0], [0.9, 1]],
    "Q": [[0.1, 0.1], [0.1, 0.9], [0.9, 0.9], [0.9, 0.1], [0.1, 0.1], [0.7, 0.7], [0.9, 0.9]],
    "X": [[0.1, 0], [0.9, 1], [0.1, 1], [0.9, 0]],
    "@": [[0.5, 0], [0, 0.5], [0.5, 1], [1, 0.5], [0.5, 0], [0.9, 0.1], [0.1, 0.9]],
    "#": [[0.3, 0], [0.3, 1], [0.7, 0], [0.7, 1], [0, 0.3], [1, 0.3], [0, 0.7], [1, 0.7]],
    "&": [[0.8, 0], [0.2, 1], [0.8, 1], [0.2, 0.3], [0.8, 0.7]],
    "*": [[0.5, 0], [0.5, 1], [0, 0.5], [1, 0.5], [0.2, 0.2], [0.8, 0.8], [0.2, 0.8], [0.8, 0.2]],
    "?": [[0.5, 0], [0.9, 0.4], [0.5, 0.8], [0.5, 1], [0.5, 0.9]],
    "!": [[0.5, 0], [0.5, 0.7], [0.5, 1]]
};

const words = [
    "MAGIC", "FLOAT", "WAVES", "DREAM", "CODE", "LIGHT", "SHINE", "GLIDE",
    "BREEZE", "SOFT", "GLOW", "MIST", "HOVER", "TWINKLE"
];

const pauseSigns = "@#&*?!";

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
    const requestRef = useRef<number | null>(null);
    const [topWordIndex, setTopWordIndex] = useState(0);
    const [bottomWordIndex, setBottomWordIndex] = useState(1);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;
        const width = canvas.clientWidth * 2;
        const height = canvas.clientHeight * 2;
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        if (!context) return;

        context.scale(2, 2);

        const baseCharHeight = 30;
        const charWidth = 24;
        const letterSpacing = 6;
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
            if (!context) return;

            context.clearRect(0, 0, canvas.width, canvas.height);

            if (!isPaused && (timestamp ?? 0) - lastChange > changeInterval) {
                setTopWordIndex((i) => (i + 1) % words.length);
                setBottomWordIndex((i) => (i + 1) % words.length);
                lastChange = timestamp ?? 0;
            }

            const topWord = words[topWordIndex];
            const bottomWord = words[bottomWordIndex];
            const tunicWord = "TUNIC";

            const topDisplay = isPaused 
                ? pauseSigns.repeat(Math.ceil(topWord.length / pauseSigns.length)).slice(0, topWord.length)
                : topWord;
                
            const bottomDisplay = isPaused 
                ? pauseSigns.repeat(Math.ceil(bottomWord.length / pauseSigns.length)).slice(0, bottomWord.length)
                : bottomWord;

            const centerX = canvas.clientWidth / 2;
            const centerY = canvas.clientHeight / 2;

            const tunicTotalWidth = tunicWord.length * charWidth + (tunicWord.length - 1) * letterSpacing;
            const tunicStartX = centerX - tunicTotalWidth / 2;
            const tunicEndX = centerX + tunicTotalWidth / 2;

            const lineSpacing = baseCharHeight + 10;
            const lineYTop = centerY - lineSpacing;
            const lineYBottom = centerY + lineSpacing;

            drawWaveLine(context, tunicStartX, lineYTop, tunicEndX, time, 6, 1.5);
            drawWaveLine(context, tunicStartX, lineYBottom, tunicEndX, time + 2.5, 6, 1.5);

            const tunicY = (lineYTop + lineYBottom) / 2 - baseCharHeight / 2;
            context.save();
            context.fillStyle = "white";
            context.font = `${baseCharHeight}px Arial, sans-serif`;
            context.textBaseline = "top";
            context.textAlign = "center";
            context.fillText(tunicWord, centerX, tunicY);
            context.restore();

            const topTotalWidth = topDisplay.length * charWidth + (topDisplay.length - 1) * letterSpacing;
            let topX = centerX - topTotalWidth / 2;
            const topY = lineYTop - spaceBetweenAnimatedAndTunic;

            for (let i = 0; i < topDisplay.length; i++) {
                const offsetY = isPaused ? 0 : getLetterOffset(i, time);
                drawTunicChar(
                    context,
                    topDisplay[i],
                    topX,
                    topY + offsetY,
                    charWidth,
                    baseCharHeight,
                    "rgba(255, 255, 255, 0.8)"
                );
                topX += charWidth + letterSpacing;
            }

            const bottomTotalWidth = bottomDisplay.length * charWidth + (bottomDisplay.length - 1) * letterSpacing;
            let bottomX = centerX - bottomTotalWidth / 2;
            const bottomY = lineYBottom + spaceBetweenTunicAndBottom;

            for (let i = 0; i < bottomDisplay.length; i++) {
                const offsetY = isPaused ? 0 : getLetterOffset(i, time + 1);
                drawTunicChar(
                    context,
                    bottomDisplay[i],
                    bottomX,
                    bottomY + offsetY,
                    charWidth,
                    baseCharHeight,
                    "rgba(255, 255, 255, 0.8)"
                );
                bottomX += charWidth + letterSpacing;
            }

            requestRef.current = requestAnimationFrame(draw);
        };

        const handleCanvasClick = () => {
            setIsPaused((p) => !p);
        };

        canvas.addEventListener('click', handleCanvasClick);

        requestRef.current = requestAnimationFrame(draw);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            canvas.removeEventListener('click', handleCanvasClick);
        };
    }, [topWordIndex, bottomWordIndex, isPaused]);

    return (
        <div className="app">
            <canvas id="canvas" style={{ cursor: 'pointer' }}></canvas>
        </div>
    );
}