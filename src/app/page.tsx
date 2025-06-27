"use client";
import { useEffect, useRef, useState } from "react";
import "destyle.css";



export default function AfficheTunicStyle() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const frameRef = useRef(0);
  const particlesRef = useRef<any[]>([]);
  const newTreesRef = useRef<any[]>([]);
  const forestRef = useRef<any[]>([]);

  const [step, setStep] = useState(0);

  const DPI = 150;
  const width = 70 * DPI;
  const height = 100 * DPI;

  const forestGreens = ["#6fcf97", "#219653", "#14532d"];
  const lightBeams = ["rgba(255,255,200,0.16)", "rgba(255,255,255,0.11)"];
  const magicColors = ["#ffe066", "#b388ff", "#f48fb1", "#fff", "#80d8ff"];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctxRef.current = ctx;

    // Initialisation des particules
    const PARTICLES = 80;
    particlesRef.current = Array.from({ length: PARTICLES }).map(() => ({
      x: Math.random() * width,
      y: height * 0.7 + Math.random() * height * 0.2,
      r: Math.random() * 6 + 2,
      t: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random(),
      color: magicColors[Math.floor(Math.random() * magicColors.length)],
    }));

    // Génération d'une forêt aléatoire
    const NB_TREES = 30;
    forestRef.current = Array.from({ length: NB_TREES }).map(() => ({
      x: Math.random() * width * 0.95 + width * 0.02,
      y: height * 0.45 + Math.random() * height * 0.45,
      trunkHeight: 100 + Math.random() * 60,
      crownSize: 80 + Math.random() * 40,
      color: forestGreens[Math.floor(Math.random() * forestGreens.length)],
    }));

    let animationId: number;

    const animate = () => {
      const ctx = ctxRef.current;
      if (!ctx) return;

      frameRef.current++;

      ctx.clearRect(0, 0, width, height);
      drawBackground(ctx);
      if (step >= 1) drawBushes(ctx);
      if (step >= 2) drawTrees(ctx);
      if (step >= 3) drawFlowers(ctx);
      if (step >= 4) drawParticles(ctx);

      // Dessiner les nouveaux arbres avec animation
      drawNewTrees(ctx);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const stepTimer = setInterval(() => {
      setStep((prev) => Math.min(prev + 1, 4));
    }, 1500);

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(stepTimer);
    };
  }, []);

  const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;

    const clickX = (event.clientX - rect.left) * scaleX;
    const clickY = (event.clientY - rect.top) * scaleY;

    // Ajouter un nouvel arbre à la position du clic
    const newTree = {
      x: clickX,
      y: Math.max(clickY, height * 0.4),
      scale: 0,
      targetScale: 1,
      growthSpeed: 0.05,
      color: forestGreens[Math.floor(Math.random() * forestGreens.length)],
      trunkHeight: 100 + Math.random() * 60,
      crownSize: 80 + Math.random() * 40,
      isGrowing: true,
      sparkles: [] as any[],
    };

    // Ajouter des particules scintillantes autour du nouvel arbre
    for (let i = 0; i < 8; i++) {
      newTree.sparkles.push({
        x: clickX + (Math.random() - 0.5) * 100,
        y: clickY + (Math.random() - 0.5) * 100,
        life: 1,
        decay: 0.02,
        color: magicColors[Math.floor(Math.random() * magicColors.length)],
        size: Math.random() * 8 + 4,
      });
    }

    newTreesRef.current.push(newTree);
  };

  function drawBackground(ctx: CanvasRenderingContext2D) {
    // --- Colline stylisée en arrière-plan ---
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.moveTo(0, height * 0.7);
    ctx.bezierCurveTo(width * 0.3, height * 0.5, width * 0.7, height * 0.9, width, height * 0.7);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = "#a0cfa0";
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.beginPath();
    ctx.moveTo(0, height * 0.8);
    ctx.bezierCurveTo(width * 0.4, height * 0.65, width * 0.8, height * 1, width, height * 0.85);
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = "#7bb87b";
    ctx.fill();
    ctx.restore();

    // --- Dégradé lumineux ---
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, "#fffde4");
    grad.addColorStop(0.4, "#b6e3b6");
    grad.addColorStop(1, "#3d5c3d");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // --- Rayons lumineux ---
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
  }

  function drawBushes(ctx: CanvasRenderingContext2D) {
    for (let layer = 0; layer < 4; layer++) {
      ctx.save();
      ctx.globalAlpha = 0.13 + 0.09 * layer;
      ctx.fillStyle = forestGreens[layer % forestGreens.length];
      for (let i = 0; i < 18; i++) {
        const bx = (width / 18) * i + ((frameRef.current * 0.02 + i * 13) % 50);
        const by = height * (0.6 + 0.08 * layer) + Math.sin(frameRef.current * 0.007 + i) * 18;
        ctx.beginPath();
        ctx.ellipse(bx, by, 320 - layer * 35, 90 + 20 * layer, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function drawTrees(ctx: CanvasRenderingContext2D) {
    for (let i = 0; i < forestRef.current.length; i++) {
      const tree = forestRef.current[i];

      ctx.save();
      ctx.globalAlpha = 0.8;
      ctx.fillStyle = "#4e342e";
      ctx.fillRect(tree.x - 16, tree.y, 32, tree.trunkHeight);

      ctx.beginPath();
      const wobble = Math.sin((frameRef.current * 0.02 + i) * 0.5) * 10;
      ctx.ellipse(tree.x, tree.y, tree.crownSize + wobble, tree.crownSize, 0, 0, Math.PI * 2);
      ctx.fillStyle = tree.color;
      ctx.shadowColor = "#0005";
      ctx.shadowBlur = 30;
      ctx.fill();

      ctx.restore();
    }
  }

  function drawNewTrees(ctx: CanvasRenderingContext2D) {
    const trees = newTreesRef.current;

    for (let i = trees.length - 1; i >= 0; i--) {
      const tree = trees[i];

      if (tree.isGrowing && tree.scale < tree.targetScale) {
        tree.scale += tree.growthSpeed;
        if (tree.scale >= tree.targetScale) {
          tree.scale = tree.targetScale;
          tree.isGrowing = false;
        }
      }

      ctx.save();
      ctx.translate(tree.x, tree.y);
      ctx.scale(tree.scale, tree.scale);
      ctx.translate(-tree.x, -tree.y);

      ctx.fillStyle = "#4e342e";
      ctx.fillRect(tree.x - 16, tree.y - tree.trunkHeight, 32, tree.trunkHeight);

      ctx.beginPath();
      const wobble = Math.sin((frameRef.current * 0.02 + i) * 0.5) * 10;
      ctx.ellipse(tree.x, tree.y - tree.trunkHeight, tree.crownSize + wobble, tree.crownSize, 0, 0, Math.PI * 2);
      ctx.fillStyle = tree.color;
      ctx.shadowColor = "#0005";
      ctx.shadowBlur = 15;
      ctx.fill();

      ctx.restore();

      for (let j = tree.sparkles.length - 1; j >= 0; j--) {
        const sparkle = tree.sparkles[j];

        ctx.save();
        ctx.globalAlpha = sparkle.life;
        ctx.beginPath();
        ctx.arc(sparkle.x, sparkle.y, sparkle.size * sparkle.life, 0, Math.PI * 2);
        ctx.fillStyle = sparkle.color;
        ctx.shadowColor = sparkle.color;
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();

        sparkle.life -= sparkle.decay;
        sparkle.y -= 1;

        if (sparkle.life <= 0) {
          tree.sparkles.splice(j, 1);
        }
      }
    }
  }

  function drawFlowers(ctx: CanvasRenderingContext2D) {
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

  function drawParticles(ctx: CanvasRenderingContext2D) {
    const particles = particlesRef.current;
    for (let p of particles) {
      p.t += 0.012 * p.speed;
      p.x += Math.sin(p.t) * 0.7 * p.speed;
      p.y += Math.cos(p.t * 0.5) * 0.4 * p.speed;

      if (p.x < 0) p.x += width;
      if (p.x > width) p.x -= width;
      if (p.y < height * 0.1) p.y = height * 0.7 + Math.random() * height * 0.2;
      if (p.y > height * 0.95) p.y = height * 0.2 + Math.random() * height * 0.5;

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

 return (
  <div
    onClick={handleCanvasClick}
    style={{
      width: "70vw",
      height: "100vw",
      maxWidth: "100%",
      maxHeight: "100vh",
     
      background: `url('/img/background.png') center center / cover no-repeat, #222`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      borderRadius: "18px",
      boxShadow: "0 0 32px #0007",
      cursor: "pointer",
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
