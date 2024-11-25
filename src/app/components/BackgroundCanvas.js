import React, { useEffect, useRef } from "react";

const BackgroundCanvas = () => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const numParticles = 200;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const mouse = { x: w / 2, y: h / 2 };

    // Utility functions
    const random = (min, max) => Math.random() * (max - min) + min;
    const dtr = (deg) => deg * (Math.PI / 180);

    class Particle {
      constructor() {
        this.x = random(0, w);
        this.y = random(0, h);
        this.z = random(0, 200);
        this.size = random(1, 3);
        this.color = `hsla(${Math.random() * 360}, 85%, 50%, 1)`;
        this.speed = random(0.5, 2);
        this.angle = random(0, 360);
      }

      update() {
        this.angle += this.speed;
        this.x += Math.cos(dtr(this.angle)) * 0.5;
        this.y += Math.sin(dtr(this.angle)) * 0.5;

        // Bounce back if out of bounds
        if (this.x < 0 || this.x > w) this.x = random(0, w);
        if (this.y < 0 || this.y > h) this.y = random(0, h);
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
      }
    }

    // Initialize particles
    for (let i = 0; i < numParticles; i++) {
      particles.current.push(new Particle());
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      particles.current.forEach((particle) => {
        particle.update();
        particle.draw();
      });
      requestAnimationFrame(draw);
    };

    draw();

    // Mousemove event
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;

      // React to mouse movement
      particles.current.forEach((particle) => {
        const dx = particle.x - mouse.x;
        const dy = particle.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          particle.x += dx / 10;
          particle.y += dy / 10;
        }
      });
    };

    // Resize event
    const handleResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      }}
    />
  );
};

export default BackgroundCanvas;
