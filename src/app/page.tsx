"use client";
import { useEffect } from "react";
import "destyle.css";
import "./page.css";

export default function Home() {
    useEffect(() => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;

        const width = canvas.clientWidth * 2;
        const height = canvas.clientHeight * 2;

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");

        if (!context) return;
    }, []);

    return (
        <div className="app">
            <canvas id="canvas"></canvas>
        </div>
    );
}
