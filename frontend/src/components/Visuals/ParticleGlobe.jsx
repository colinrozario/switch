import React, { useRef, useEffect } from 'react';

export default function ParticleGlobe({ size = 380 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const DPR = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width  = size * DPR;
      canvas.height = size * DPR;
      ctx.scale(DPR, DPR);
    };
    resize();

    const N = 260;
    const particles = Array.from({ length: N }, (_, i) => {
      const phi   = Math.acos(1 - 2 * (i + 0.5) / N);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      return { phi, theta, op: Math.random() * 0.55 + 0.2 };
    });

    const R = size * 0.42;
    let rot = 0;

    const draw = () => {
      const W = size, H = size;
      ctx.clearRect(0, 0, W, H);
      rot += 0.0016;

      const cx = W / 2, cy = H / 2;

      const proj = particles.map(p => {
        const sx = Math.sin(p.phi) * Math.cos(p.theta + rot);
        const sy = Math.sin(p.phi) * Math.sin(p.theta + rot);
        const sz = Math.cos(p.phi);
        const scale = (sy + 1) / 2;
        return {
          x:  cx + sx * R,
          y:  cy + sz * R * 0.88,
          z:  sy,
          op: p.op * (0.35 + scale * 0.65),
          r:  1.2 + scale * 0.9,
        };
      });

      // Lines
      for (let i = 0; i < proj.length; i++) {
        for (let j = i + 1; j < proj.length; j++) {
          const dx = proj[i].x - proj[j].x;
          const dy = proj[i].y - proj[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 48) {
            ctx.beginPath();
            ctx.moveTo(proj[i].x, proj[i].y);
            ctx.lineTo(proj[j].x, proj[j].y);
            ctx.strokeStyle = `rgba(120,190,255,${(1 - d / 48) * 0.14})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Dots
      proj.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(165,215,255,${p.op})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [size]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size, display: 'block', opacity: 0.85 }}
    />
  );
}
