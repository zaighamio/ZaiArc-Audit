import React, { useEffect, useRef } from 'react';

export const CyberBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Handle Resize
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // --------------------------------------------------
    // Layer 1 — Red Matrix Code Rain Configuration
    // --------------------------------------------------
    const fontSize = 14;
    const columnsCount = Math.floor(width / fontSize) + 1;
    const characters = '01$#@'.split('');
    const drops: number[] = Array.from({ length: columnsCount }, () => Math.random() * -100);
    const rainSpeeds: number[] = Array.from({ length: columnsCount }, () => 1 + Math.random() * 1.5);

    // --------------------------------------------------
    // Layer 2 — Horizontal Scan Line Configuration
    // --------------------------------------------------
    let scanLineY = 0;
    const scanLineSpeed = 2; // Speed of vertical motion

    // --------------------------------------------------
    // Layer 3 — Silver Circuit Lines Configuration
    // --------------------------------------------------
    interface Node {
      x: number;
      y: number;
      connected: number[];
    }
    const nodes: Node[] = [];
    const nodeCount = 18;

    // Generate random nodes across spatial fields
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        connected: [],
      });
    }

    // Connect near nodes
    for (let i = 0; i < nodeCount; i++) {
      const connectionsNeeded = 1 + Math.floor(Math.random() * 2);
      const distances = nodes
        .map((n, idx) => ({ idx, dist: Math.hypot(nodes[i].x - n.x, nodes[i].y - n.y) }))
        .filter((item) => item.idx !== i)
        .sort((a, b) => a.dist - b.dist);

      for (let j = 0; j < Math.min(connectionsNeeded, distances.length); j++) {
        if (!nodes[i].connected.includes(distances[j].idx)) {
          nodes[i].connected.push(distances[j].idx);
        }
      }
    }

    // --------------------------------------------------
    // Layer 4 — Pulse Rings Configuration
    // --------------------------------------------------
    interface PulseRing {
      r: number;
      opacity: number;
    }
    const pulseRings: PulseRing[] = [
      { r: 0, opacity: 1 },
      { r: 150, opacity: 0.6 },
      { r: 300, opacity: 0.3 },
    ];

    // --------------------------------------------------
    // Global Loop Clock
    // --------------------------------------------------
    let time = 0;

    const animate = () => {
      time += 0.016; // Increment by ~1 frame step

      // 1. Clear background to ultra rich deep red-black
      ctx.fillStyle = 'rgba(8, 0, 0, 0.22)'; // slightly higher than 0.15 to crisp up trails enormously
      ctx.fillRect(0, 0, width, height);

      // --------------------------------------------------
      // LAYER 5 — CORNER GLOWS (Slow 6s pulse opacity)
      // --------------------------------------------------
      const glowPulse = Math.sin(time * (Math.PI / 3)) * 0.5 + 0.5; // slow 6s period
      const cornerGlowAlpha = 0.05 + glowPulse * 0.05;

      // Top-Left Red Glow
      const gradTL = ctx.createRadialGradient(0, 0, 0, 0, 0, Math.min(width, height) * 0.7);
      gradTL.addColorStop(0, `rgba(255, 0, 0, ${cornerGlowAlpha * 1.6})`);
      gradTL.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradTL;
      ctx.fillRect(0, 0, width, height);

      // Bottom-Right Silver Glow
      const gradBR = ctx.createRadialGradient(width, height, 0, width, height, Math.min(width, height) * 0.7);
      gradBR.addColorStop(0, `rgba(192, 192, 192, ${cornerGlowAlpha * 1.2})`);
      gradBR.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = gradBR;
      ctx.fillRect(0, 0, width, height);

      // --------------------------------------------------
      // LAYER 1 — RED MATRIX CODE RAIN
      // --------------------------------------------------
      ctx.font = `bold ${fontSize}px monospace`;
      ctx.fillStyle = 'rgba(255, 0, 0, 0.13)'; // higher opacity for more definition

      for (let i = 0; i < drops.length; i++) {
        // Draw a random character
        const text = characters[Math.floor(Math.random() * characters.length)];
        const xCoord = i * fontSize;
        const yCoord = drops[i] * fontSize;

        // Draw character
        ctx.fillText(text, xCoord, yCoord);

        // Advance vertical drop
        drops[i] += rainSpeeds[i] * 0.38;

        // Draw head highlight character with higher brightness for crispy tech style
        if (Math.random() > 0.98) {
          ctx.fillStyle = 'rgba(255, 90, 90, 0.75)';
          ctx.fillText(text, xCoord, yCoord);
          ctx.fillStyle = 'rgba(255, 0, 0, 0.13)';
        }

        // Wrap around at bottom
        if (yCoord > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
      }

      // --------------------------------------------------
      // LAYER 3 — SILVER CIRCUIT LINES (Slowly morphing alphas)
      // --------------------------------------------------
      ctx.strokeStyle = `rgba(180, 190, 210, ${0.07 + Math.sin(time) * 0.03})`;
      ctx.lineWidth = 1.3;
      ctx.fillStyle = `rgba(180, 190, 210, ${0.11 + Math.sin(time) * 0.04})`;

      nodes.forEach((node) => {
        // Subtle offset nodes over time to make background feel alive
        const offsetX = Math.cos(time * 0.5 + node.y) * 20;
        const offsetY = Math.sin(time * 0.5 + node.x) * 20;
        const currentX = node.x + offsetX;
        const currentY = node.y + offsetY;

        // Draw connections
        node.connected.forEach((connIdx) => {
          const target = nodes[connIdx];
          const targetOffsetX = Math.cos(time * 0.5 + target.y) * 20;
          const targetOffsetY = Math.sin(time * 0.5 + target.x) * 20;
          const targetX = target.x + targetOffsetX;
          const targetY = target.y + targetOffsetY;

          ctx.beginPath();
          ctx.moveTo(currentX, currentY);
          // Create circuit board "L" shape path for sci-fi look
          if (Math.abs(targetX - currentX) > Math.abs(targetY - currentY)) {
            ctx.lineTo(targetX, currentY);
          } else {
            ctx.lineTo(currentX, targetY);
          }
          ctx.lineTo(targetX, targetY);
          ctx.stroke();
        });

        // Draw node points
        ctx.beginPath();
        ctx.arc(currentX, currentY, 2.5, 0, Math.PI * 2); // refine node point radius from 3.5 to 2.5
        ctx.fill();
      });

      // --------------------------------------------------
      // LAYER 4 — PULSE RINGS (Center expanding)
      // --------------------------------------------------
      const centerX = width / 2;
      const centerY = height / 2;

      pulseRings.forEach((ring) => {
        ring.r += 1.4; // Expand
        // Decreasing opacity as it reaches max boundaries
        ring.opacity = Math.max(0, 1 - ring.r / 600) * 0.15;

        if (ring.r > 600) {
          ring.r = 0; // reset
        }

        ctx.strokeStyle = `rgba(255, 30, 30, ${ring.opacity})`;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(centerX, centerY, ring.r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // --------------------------------------------------
      // LAYER 2 — HORIZONTAL SCAN LINE
      // --------------------------------------------------
      scanLineY += scanLineSpeed;
      if (scanLineY > height) {
        scanLineY = 0; // Repeat after crossing screen
      }

      // Draw horizontal line
      ctx.strokeStyle = 'rgba(255, 0, 0, 0.22)';
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(0, scanLineY);
      ctx.lineTo(width, scanLineY);
      ctx.stroke();

      // Laser Glow
      const laserGlowHeight = 10;
      const scanLineGlow = ctx.createLinearGradient(0, scanLineY - laserGlowHeight, 0, scanLineY + laserGlowHeight);
      scanLineGlow.addColorStop(0, 'rgba(255, 0, 0, 0)');
      scanLineGlow.addColorStop(0.5, 'rgba(255, 0, 0, 0.12)');
      scanLineGlow.addColorStop(1, 'rgba(255, 0, 0, 0)');
      ctx.fillStyle = scanLineGlow;
      ctx.fillRect(0, scanLineY - laserGlowHeight, width, laserGlowHeight * 2);

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0" id="cyber-background-container">
      {/* Background canvas simulation */}
      <canvas
        ref={canvasRef}
        id="cyber-background-canvas"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ mixBlendMode: 'screen' }}
      />

      {/* Floating Design HTML Overlays */}
      <div className="absolute inset-0 opacity-15 pointer-events-none overflow-hidden">
        <div className="absolute top-24 left-8 text-[#FF0000] text-[10px] font-mono leading-none">
          101010110<br />$AUDIT<br />#X02<br />01010<br />#Bounty<br />10101<br />$USDC
        </div>
        <div className="absolute top-32 right-12 text-[#FF0000] text-[10px] font-mono leading-none text-right">
          0101<br />#SEC<br />001011<br />$EURC<br />1101<br />#ARC
        </div>
        <div className="absolute bottom-24 left-1/4 text-[#FF0000] text-[12px] font-mono opacity-20">
          0x3600000000000000000000000000000000000000
        </div>
      </div>

      {/* Scanline Gradient Screen Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,0,0,0.05)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-20"></div>
      
      {/* Blurry Glowing Orbs */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-[#FF0000] opacity-[0.05] blur-[100px] rounded-full"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#C0C0C0] opacity-[0.03] blur-[100px] rounded-full"></div>
    </div>
  );
};
