"use client";
import { useEffect } from "react";
import "destyle.css";
import "./page.css";

function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawSquare(context: CanvasRenderingContext2D, height: number, width: number, xPos: number, yPos: number, i: number, doorColorMatrice: string[][]) {
    context.fillStyle = doorColorMatrice[xPos][yPos];
    if (i <= 101) context?.fillRect(xPos * 106 + i / 2 + (height - 106 * 12), yPos * 106 + i / 2 + (width - 106 * 12), 100 - i, 100 - i);
}

//function addPath(currentX, currentY, direction){
//
//}

function purpleLightRandomPathing(direction: "north" | "south" | "west" | "east"): { startX: number; startY: number; endX: number; endY: number }[][] {
    const setting = {
        north: ["west", "north", "east"],
        south: ["west", "south", "east"],
        west: ["north", "west", "south"],
        east: ["north", "east", "south"],
    };
    let option = randomInt(0, 3);
    if (option == 0) {
    }
    return [];
}

function door(context: CanvasRenderingContext2D, height: number, width: number, i: number, doorColorMatrice: string[][]) {
    context?.clearRect(0, 0, height, width);
    for (let xPos = 0; xPos < 12; xPos++) {
        for (let yPos = 0; yPos < 12; yPos++) {
            if (3 < xPos && xPos < 8 && 3 < yPos && yPos < 8) {
                drawSquare(context!, height, width, xPos, yPos, i, doorColorMatrice);
            } else if (((3 < xPos && xPos < 8 && (4 > yPos || yPos > 7)) || (3 < yPos && yPos < 8 && (4 > xPos || xPos > 7))) && i > 33) {
                drawSquare(context!, height, width, xPos, yPos, i - 33, doorColorMatrice);
            } else if (i > 66) {
                drawSquare(context!, height, width, xPos, yPos, i - 66, doorColorMatrice);
            } else {
                drawSquare(context!, height, width, xPos, yPos, 0, doorColorMatrice);
            }
            const originX = width / 2 + 1;
            const originY = height / 2 + 1;
            context.strokeStyle = "#FF00FF";
            context.lineWidth = 5;
            context.beginPath();
            if (i * 10 <= 106) context.moveTo(originX, originY);
            else context.moveTo(originX, originY + i * 10 - 106);
            context.lineTo(originX, originY + i * 10);

            if (i * 10 <= 106) context.moveTo(originX, originY);
            else context.moveTo(originX - i * 10 + 106, originY);
            context.lineTo(originX - i * 10, originY);

            if (i * 10 <= 106) context.moveTo(originX, originY);
            else context.moveTo(originX, originY - i * 10 + 106);
            context.lineTo(originX, originY - i * 10);

            if (i * 10 <= 106) context.moveTo(originX, originY);
            else context.moveTo(originX + i * 10 - 106, originY);
            context.lineTo(originX + i * 10, originY);
            context.stroke();
        }
    }
}

function generateDoorColorMatrice() {
    const doorColorMatrice = [];
    for (let x = 0; x < 12; x++) {
        const row: string[] = [];
        for (let y = 0; y < 12; y++) {
            const color = randomInt(0, 1) ? "#444444" : randomInt(0, 1) ? "#555555" : "#666666";
            row.push(color);
        }
        doorColorMatrice.push(row);
    }
    return doorColorMatrice;
}

export default function Home() {
    useEffect(() => {
        const canvas = document.getElementById("canvas") as HTMLCanvasElement;

        const width = canvas.clientWidth * 2;
        const height = canvas.clientHeight * 2;

        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");

        if (!context) return;

        let i = 0;
        const doorColorMatrice = generateDoorColorMatrice();
        function loop() {
            door(context!, height, width, i, doorColorMatrice);
            i += 0.5;
            requestAnimationFrame(loop);
        }
        loop();
    }, []);

    return (
        <div className="app">
            <canvas id="canvas"></canvas>
        </div>
    );
}
