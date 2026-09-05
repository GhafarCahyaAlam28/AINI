import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  speed: number;
  twinklePhase: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  angle: number;
  alpha: number;
  active: boolean;
}

export default function StarSky() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
    };

    window.addEventListener('resize', handleResize);

    const starCount = Math.min(180, Math.floor((width * height) / 7500));
    let stars: Star[] = [];

    const starColors = [
      'rgba(255, 255, 255,',
      'rgba(220, 235, 255,',
      'rgba(240, 245, 255,',
      'rgba(255, 245, 220,',
    ];

    function initStars() {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.6 + 0.4,
          alpha: Math.random() * 0.7 + 0.2,
          baseAlpha: Math.random() * 0.6 + 0.2,
          speed: Math.random() * 0.03 + 0.01,
          twinklePhase: Math.random() * Math.PI * 2,
          color: starColors[Math.floor(Math.random() * starColors.length)],
        });
      }
    }

    initStars();

    let shootingStars: ShootingStar[] = [];
    const createShootingStar = () => {
      if (Math.random() > 0.015 || shootingStars.length > 2) return;
      shootingStars.push({
        x: Math.random() * width * 0.8,
        y: Math.random() * (height * 0.4),
        length: 80 + Math.random() * 60,
        speed: 6 + Math.random() * 4,
        angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
        alpha: 1,
        active: true,
      });
    };

    let lastTime = performance.now();

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // Render twinkling stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.twinklePhase += s.speed * 60 * dt;
        const currentAlpha = s.baseAlpha + Math.sin(s.twinklePhase) * 0.35;
        const clampedAlpha = Math.max(0.1, Math.min(1, currentAlpha));

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `${s.color} ${clampedAlpha})`;
        ctx.fill();

        // Optional lens glow for larger stars
        if (s.size > 1.4) {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = `${s.color} ${clampedAlpha * 0.18})`;
          ctx.fill();
        }
      }

      // Check shooting star creation
      createShootingStar();

      // Render shooting stars
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        const dx = Math.cos(ss.angle) * ss.speed;
        const dy = Math.sin(ss.angle) * ss.speed;

        ss.x += dx;
        ss.y += dy;
        ss.alpha -= 0.012;

        if (ss.alpha <= 0 || ss.x > width || ss.y > height) {
          shootingStars.splice(i, 1);
          continue;
        }

        const tailX = ss.x - Math.cos(ss.angle) * ss.length;
        const tailY = ss.y - Math.sin(ss.angle) * ss.length;

        const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        grad.addColorStop(1, `rgba(255, 255, 255, ${ss.alpha})`);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.stroke();

        // Bright star head
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${ss.alpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="celestial-canvas"
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
    />
  );
}
