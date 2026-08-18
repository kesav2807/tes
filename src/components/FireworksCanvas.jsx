import React, { useEffect, useRef } from 'react';

export const FireworksCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    // Set canvas dimensions
    const resizeCanvas = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      } else {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Color Palette
    const colors = ['#ffc107', '#ff3b30', '#ff9500', '#4cd964', '#5ac8fa', '#007aff', '#e11d48', '#f59e0b', '#ec4899'];

    // Particles Array
    let particles = [];
    let fireworks = [];

    class Firework {
      constructor(x, y, targetY) {
        this.x = x;
        this.y = y;
        this.targetY = targetY;
        this.speed = 3 + Math.random() * 3;
        this.angle = Math.PI / 2 + (Math.random() * 0.2 - 0.1);
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = -Math.sin(this.angle) * this.speed;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.trail = [];
        this.trailLength = 5;
        this.exploded = false;
      }

      update() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.trailLength) {
          this.trail.shift();
        }

        this.x += this.vx;
        this.y += this.vy;

        if (this.y <= this.targetY || this.vy >= 0) {
          this.exploded = true;
          this.createParticles();
        }
      }

      draw() {
        ctx.beginPath();
        for (let i = 0; i < this.trail.length - 1; i++) {
          const pt = this.trail[i];
          const nextPt = this.trail[i + 1];
          ctx.strokeStyle = this.color;
          ctx.lineWidth = 2 * (i / this.trail.length);
          ctx.moveTo(pt.x, pt.y);
          ctx.lineTo(nextPt.x, nextPt.y);
        }
        ctx.stroke();
      }

      createParticles() {
        const particleCount = 35 + Math.floor(Math.random() * 25);
        for (let i = 0; i < particleCount; i++) {
          particles.push(new Particle(this.x, this.y, this.color));
        }
      }
    }

    class Particle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 1;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.015;
        this.gravity = 0.06;
        this.size = Math.random() * 2.5 + 1;
      }

      update() {
        this.vx *= 0.96;
        this.vy *= 0.96;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Embers / Sparks floating continuously
    class Ember {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 20;
        this.size = Math.random() * 2 + 0.8;
        this.speedY = Math.random() * 1.2 + 0.4;
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.alpha = Math.random() * 0.8 + 0.2;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.alpha -= 0.003;
        if (this.y < 0 || this.alpha <= 0) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = Math.max(0, this.alpha);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    const embers = Array.from({ length: 40 }, () => new Ember());

    let tick = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Randomly launch fireworks
      tick++;
      if (tick % 45 === 0) {
        const startX = Math.random() * (canvas.width * 0.8) + canvas.width * 0.1;
        const startY = canvas.height;
        const targetY = Math.random() * (canvas.height * 0.5) + canvas.height * 0.1;
        fireworks.push(new Firework(startX, startY, targetY));
      }

      // Update & Draw Fireworks
      for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update();
        fireworks[i].draw();
        if (fireworks[i].exploded) {
          fireworks.splice(i, 1);
        }
      }

      // Update & Draw Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].alpha <= 0) {
          particles.splice(i, 1);
        }
      }

      // Update & Draw Embers
      embers.forEach(ember => {
        ember.update();
        ember.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1
      }}
    />
  );
};
