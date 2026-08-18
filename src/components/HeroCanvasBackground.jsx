import React, { useEffect, useRef } from 'react';

export const HeroCanvasBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particles system
    const particleCount = 65;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.5,
      color: ['#d90429', '#ef233c', '#ff007f', '#ffffff', '#4cc9f0'][Math.floor(Math.random() * 5)],
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.8 - 0.2, // Move upward like sparkler embers
      alpha: Math.random() * 0.8 + 0.2,
      pulse: Math.random() * Math.PI * 2
    }));

    // Dynamic firework rockets on click / auto interval
    const fireworks = [];

    const createFirework = (targetX, targetY) => {
      const colors = ['#ff007f', '#d90429', '#e63946', '#4cc9f0', '#7209b7', '#ffffff'];
      const sparkCount = 35;
      const sparks = Array.from({ length: sparkCount }, () => {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1.5;
        return {
          x: targetX,
          y: targetY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: Math.random() * 0.02 + 0.015,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 2.5 + 1
        };
      });
      fireworks.push(...sparks);
    };

    // Auto trigger occasional firework burst
    let lastAutoBurst = 0;

    const handleCanvasClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      createFirework(clickX, clickY);
    };

    canvas.addEventListener('click', handleCanvasClick);

    const render = (time) => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw subtle ambient background radial gradient
      const grad = ctx.createRadialGradient(width * 0.75, height * 0.3, 10, width * 0.5, height * 0.5, Math.max(width, height));
      grad.addColorStop(0, 'rgba(45, 12, 54, 0.4)');
      grad.addColorStop(0.5, 'rgba(15, 23, 42, 0.6)');
      grad.addColorStop(1, 'rgba(8, 12, 22, 0.8)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Auto burst every 2.5 seconds
      if (time - lastAutoBurst > 2500) {
        lastAutoBurst = time;
        const randomX = Math.random() * (width * 0.8) + width * 0.1;
        const randomY = Math.random() * (height * 0.5) + height * 0.1;
        createFirework(randomX, randomY);
      }

      // 2. Render rising embers / stars particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.03;

        if (p.y < 0) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        const opacity = Math.min(1, Math.max(0.1, p.alpha + Math.sin(p.pulse) * 0.3));

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 3. Render explosive sparks from fireworks
      for (let i = fireworks.length - 1; i >= 0; i--) {
        const f = fireworks[i];
        f.x += f.vx;
        f.y += f.vy;
        f.vy += 0.05; // gravity effect
        f.alpha -= f.decay;

        if (f.alpha <= 0) {
          fireworks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = f.alpha;
        ctx.fillStyle = f.color;
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render(0);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (canvas) canvas.removeEventListener('click', handleCanvasClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
        pointerEvents: 'auto',
        cursor: 'pointer'
      }}
    />
  );
};
