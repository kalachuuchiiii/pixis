import { useEffect, useRef } from "react";

export const DynamicBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      hue: number;
      pulseOffset: number;
    }> = [];

    let animationFrame: number;
    let lastTime = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const isDark = () => document.documentElement.classList.contains("dark");

    const createParticle = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2.2 + 0.6,
      speedX: Math.random() * 0.6 - 0.3,
      speedY: Math.random() * 0.6 - 0.3,
      opacity: Math.random() * 0.5 + 0.3,
      hue: isDark() ? Math.random() * 55 + 260 : Math.random() * 45 + 255,
      pulseOffset: Math.random() * Math.PI * 2,
    });

    const initParticles = () => {
      particles = [];
      // Much more reasonable count (capped)
      const area = canvas.width * canvas.height;
      const count = Math.min(Math.floor(area / 14000), 650); // tuned for performance
      for (let i = 0; i < count; i++) {
        particles.push(createParticle());
      }
    };

    const animate = (timestamp: number) => {
      if (timestamp - lastTime < 16) {
        // ~60fps cap
        animationFrame = requestAnimationFrame(animate);
        return;
      }
      lastTime = timestamp;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const dark = isDark();

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Update position
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Gentle pulse
        const pulse = Math.sin(timestamp / 700 + p.pulseOffset) * 0.18 + 0.82;

        // Draw
        ctx.save();
        ctx.globalAlpha = p.opacity * pulse;

        ctx.fillStyle = `hsl(${p.hue}, 88%, ${dark ? "78%" : "68%"})`;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Only add glow in dark mode and only on larger particles
        if (dark && p.size > 1.2) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = `hsl(${p.hue}, 100%, 75%)`;
          ctx.fill(); // redraw with shadow
        }

        ctx.restore();
      }

      animationFrame = requestAnimationFrame(animate);
    };

    // Initialize
    resize();
    initParticles();
    animationFrame = requestAnimationFrame(animate);

    const handleResize = () => {
      resize();
      initParticles();
    };

    // Theme observer
    const observer = new MutationObserver(() => {
      // Just update hues instead of full re-init for better perf
      const dark = isDark();
      particles.forEach((p) => {
        p.hue = dark ? Math.random() * 55 + 260 : Math.random() * 45 + 255;
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  );
};
