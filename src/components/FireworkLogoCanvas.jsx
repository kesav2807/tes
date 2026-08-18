import React, { useEffect, useRef } from 'react';

export const FireworkLogoCanvas = ({ size = 44 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const canvasSize = size - 6; // Subtract padding border

    canvas.width = canvasSize * dpr;
    canvas.height = canvasSize * dpr;
    canvas.style.width = `${canvasSize}px`;
    canvas.style.height = `${canvasSize}px`;

    let animationFrameId;
    let rotation = 0;
    let pulse = 0;

    // Generate fixed particle ray angles & properties for consistent firework starburst shape
    const rayCount = 20;
    const rays = Array.from({ length: rayCount }, (_, i) => ({
      angle: (i * (360 / rayCount) * Math.PI) / 180,
      lengthRatio: 0.6 + Math.sin(i * 3) * 0.3,
      color: i % 2 === 0 ? '#ff0080' : (i % 3 === 0 ? '#d90429' : '#e0115f')
    }));

    const render = () => {
      ctx.save();
      ctx.scale(dpr, dpr);

      const centerX = canvasSize / 2;
      const centerY = canvasSize / 2;
      const maxRadius = canvasSize * 0.42;

      // 1. Dark background
      const bgGrad = ctx.createRadialGradient(centerX, centerY, 2, centerX, centerY, maxRadius * 1.2);
      bgGrad.addColorStop(0, '#1c082b');
      bgGrad.addColorStop(0.7, '#0c0517');
      bgGrad.addColorStop(1, '#05020a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      // 2. Central Glow
      const glowGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius * 0.6);
      const pulseFactor = 0.85 + Math.sin(pulse) * 0.15;
      glowGrad.addColorStop(0, `rgba(255, 255, 255, ${0.9 * pulseFactor})`);
      glowGrad.addColorStop(0.2, `rgba(255, 20, 147, ${0.85 * pulseFactor})`);
      glowGrad.addColorStop(0.6, `rgba(186, 85, 211, ${0.4 * pulseFactor})`);
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius * 0.7, 0, Math.PI * 2);
      ctx.fill();

      // 3. Draw Rays (Starburst lines)
      rotation += 0.008;
      pulse += 0.05;

      rays.forEach((ray, idx) => {
        const currentAngle = ray.angle + rotation * (idx % 2 === 0 ? 1 : -0.5);
        const rayLen = maxRadius * ray.lengthRatio * (0.9 + Math.sin(pulse + idx) * 0.1);

        const startX = centerX + Math.cos(currentAngle) * 3;
        const startY = centerY + Math.sin(currentAngle) * 3;
        const endX = centerX + Math.cos(currentAngle) * rayLen;
        const endY = centerY + Math.sin(currentAngle) * rayLen;

        const lineGrad = ctx.createLinearGradient(startX, startY, endX, endY);
        lineGrad.addColorStop(0, '#ffffff');
        lineGrad.addColorStop(0.4, ray.color);
        lineGrad.addColorStop(1, 'rgba(255, 255, 255, 0.1)');

        ctx.strokeStyle = lineGrad;
        ctx.lineWidth = idx % 2 === 0 ? 1.8 : 1.1;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Tip spark particle dot
        ctx.fillStyle = idx % 2 === 0 ? '#ffffff' : '#ffea00';
        ctx.beginPath();
        ctx.arc(endX, endY, (idx % 2 === 0 ? 1.2 : 0.8) * (0.8 + Math.sin(pulse * 2 + idx) * 0.3), 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. White Core Sparkle (4-point star burst)
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(rotation * 2);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.8;
      
      ctx.beginPath();
      ctx.moveTo(-6, 0); ctx.lineTo(6, 0);
      ctx.moveTo(0, -6); ctx.lineTo(0, 6);
      ctx.stroke();

      ctx.rotate(Math.PI / 4);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-4, 0); ctx.lineTo(4, 0);
      ctx.moveTo(0, -4); ctx.lineTo(0, 4);
      ctx.stroke();

      ctx.restore();

      // Core center bright white dot
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [size]);

  return (
    <div
      className="firework-logo-wrapper"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: '#ffffff',
        padding: '3px',
        borderRadius: '6px',
        border: '1.5px solid #e2e8f0',
        boxShadow: '0 0 16px 3px rgba(217, 4, 41, 0.65), 0 2px 6px rgba(0, 0, 0, 0.12)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}
    >
      <canvas ref={canvasRef} style={{ borderRadius: '3px', display: 'block' }} />
    </div>
  );
};
