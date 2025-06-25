"use client";
import { useEffect, useRef } from "react";
import "destyle.css";

export default function AfficheTunicStyle() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Move these functions outside useEffect so they are accessible
  // We'll use refs to access canvas, context, particles, etc.
  const DPI = 150;
  const width = 70 * DPI;   // 10500px
  const height = 100 * DPI; // 15000px

  // Palette TUNIC
  const forestGreens = ["#6fcf97", "#219653", "#14532d"];
  const lightBeams = ["rgba(255,255,200,0.16)", "rgba(255,255,255,0.11)"];
  const magicColors = ["#ffe066", "#b388ff", "#f48fb1", "#fff", "#80d8ff"];

  // We'll use refs to store mutable values across renders
  const frameRef = useRef(0);
  const particlesRef = useRef<any[]>([]);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  function drawBackground() {
    const ctx = ctxRef.current;
    if (!ctx) return;
    // Dégradé vertical
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, "#fffde4");
    grad.addColorStop(0.4, "#b6e3b6");
    grad.addColorStop(1, "#3d5c3d");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Light beams
    for (let i = 0; i < 3; i++) {
      const x = width * (0.2 + 0.3 * i) + Math.sin(frameRef.current * 0.003 + i) * 120;
      const y = 0;
      const beamGrad = ctx.createRadialGradient(x, y, 10, x, y, height * 0.8);
      beamGrad.addColorStop(0, lightBeams[i % lightBeams.length]);
      beamGrad.addColorStop(1, "rgba(255,255,200,0)");
      ctx.beginPath();
      ctx.arc(x, y, height * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = beamGrad;
      ctx.fill();
    }

    // Bushes (profond)
    for (let layer = 0; layer < 4; layer++) {
      ctx.save();
      ctx.globalAlpha = 0.13 + 0.09 * layer;
      ctx.fillStyle = forestGreens[layer % forestGreens.length];
      for (let i = 0; i < 18; i++) {
        let bx = (width / 18) * i + ((frameRef.current * 0.02 + i * 13) % 50);
        let by = height * (0.6 + 0.08 * layer) + Math.sin(frameRef.current * 0.007 + i) * 18;
        ctx.beginPath();
        ctx.ellipse(bx, by, 320 - layer * 35, 90 + 20 * layer, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Fleurs simples
    for (let f = 0; f < 20; f++) {
      const fx = Math.random() * width;
      const fy = height * 0.75 + Math.random() * height * 0.18;
      ctx.save();
      ctx.globalAlpha = 0.7;
      ctx.beginPath();
      ctx.arc(fx, fy, 16, 0, Math.PI * 2);
      ctx.fillStyle = magicColors[f % magicColors.length];
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 16;
      ctx.fill();
      ctx.restore();
    }
  }

  function drawParticles() {
    const ctx = ctxRef.current;
    const particles = particlesRef.current;
    if (!ctx) return;
    for (let p of particles) {
      // Mouvement flottant
      p.t += 0.012 * p.speed;
      p.x += Math.sin(p.t) * 0.7 * p.speed;
      p.y += Math.cos(p.t * 0.5) * 0.4 * p.speed;

      // Boucle
      if (p.x < 0) p.x += width;
      if (p.x > width) p.x -= width;
      if (p.y < height * 0.1) p.y = height * 0.7 + Math.random() * height * 0.2;
      if (p.y > height * 0.95) p.y = height * 0.2 + Math.random() * height * 0.5;

      // Glow
      ctx.save();
      ctx.globalAlpha = 0.5 + 0.5 * Math.sin(frameRef.current * 0.05 + p.t * 2);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r + Math.sin(frameRef.current * 0.08 + p.t) * 1.5, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 24;
      ctx.fill();
      ctx.restore();
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;
    canvas.style.width = "70vw";
    canvas.style.height = "100vw";
    const ctx = canvas.getContext("2d");
    ctxRef.current = ctx;

    // Particules magiques
    const PARTICLES = 80;
    particlesRef.current = Array.from({ length: PARTICLES }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.7 + height * 0.15,
      r: Math.random() * 8 + 4,
      t: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1.2,
      color: magicColors[Math.floor(Math.random() * magicColors.length)],
    }));

    frameRef.current = 0;
    let animationId: number;

    function animate() {
      drawBackground();
      drawParticles();
      frameRef.current++;
      animationId = requestAnimationFrame(animate);
    }

    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <div
      style={{
        width: "70vw",
        height: "100vw",
        maxWidth: "100%",
        maxHeight: "100vh",
        background: "#222",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        borderRadius: "18px",
        boxShadow: "0 0 32px #0007",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
      />
    </div>
  );
}
