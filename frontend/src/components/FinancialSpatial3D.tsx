import React, { useEffect, useRef, useState } from 'react';
import { Activity, ShieldCheck, Zap, RefreshCw, Eye } from 'lucide-react';

interface FinancialSpatial3DProps {
  className?: string;
  activeMode?: 'liquidity' | 'fraud' | 'risk' | 'leakage';
}

export const FinancialSpatial3D: React.FC<FinancialSpatial3DProps> = ({
  className = '',
  activeMode = 'liquidity'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hudStats, setHudStats] = useState({
    velocity: '₹85,400/day',
    activeNodes: 28,
    stability: '99.2%',
    modeLabel: 'Capital Flow Network'
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 420);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mouse / Cursor interaction state
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0;
    let targetRotY = 0;
    let rotX = 0;
    let rotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left - width / 2;
      const y = e.clientY - rect.top - height / 2;
      targetRotY = (x / width) * 1.2;
      targetRotX = -(y / height) * 1.2;
    };
    canvas.addEventListener('mousemove', handleMouseMove);

    // 3D Nodes generation
    const NODE_COUNT = 38;
    interface Node3D {
      x: number;
      y: number;
      z: number;
      radius: number;
      color: string;
      label: string;
      speed: number;
      phase: number;
    }

    const nodes: Node3D[] = [];
    const colors = {
      liquidity: ['#6D45CF', '#8B5CF6', '#16A879', '#38BDF8'],
      fraud: ['#E46D72', '#F43F5E', '#FB7185', '#6D45CF'],
      risk: ['#E5A33D', '#F59E0B', '#16A879', '#6D45CF'],
      leakage: ['#EC4899', '#E46D72', '#8B5CF6', '#16A879']
    }[activeMode] || ['#6D45CF', '#8B5CF6', '#16A879', '#38BDF8'];

    const labels = ['Inflow Node', 'OPEX Anchor', 'GSTIN Validator', 'Treasury Safe', 'Receivable Stream', 'Forecast Horizon'];

    for (let i = 0; i < NODE_COUNT; i++) {
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.random() * Math.PI * 2;
      const r = 110 + (Math.random() * 40 - 20);

      nodes.push({
        x: r * Math.sin(theta) * Math.cos(phi),
        y: r * Math.sin(theta) * Math.sin(phi),
        z: r * Math.cos(theta),
        radius: 2.2 + Math.random() * 3.5,
        color: colors[i % colors.length],
        label: labels[i % labels.length],
        speed: 0.002 + Math.random() * 0.004,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Particle streams
    const PARTICLE_COUNT = 45;
    const particles = Array.from({ length: PARTICLE_COUNT }).map(() => ({
      from: Math.floor(Math.random() * NODE_COUNT),
      to: Math.floor(Math.random() * NODE_COUNT),
      progress: Math.random(),
      speed: 0.008 + Math.random() * 0.012
    }));

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth camera interpolation
      rotX += (targetRotX - rotX) * 0.05;
      rotY += (targetRotY - rotY) * 0.05;
      angle += 0.004;

      const cosY = Math.cos(rotY + angle);
      const sinY = Math.sin(rotY + angle);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const fov = 340;
      const cx = width / 2;
      const cy = height / 2;

      // Project 3D to 2D
      const projected = nodes.map((node) => {
        // Rotate around Y
        let x1 = node.x * cosY - node.z * sinY;
        let z1 = node.z * cosY + node.x * sinY;

        // Rotate around X
        let y2 = node.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + node.y * sinX + 320;

        const scale = fov / Math.max(1, z2);
        return {
          px: cx + x1 * scale,
          py: cy + y2 * scale,
          scale,
          z2,
          node
        };
      });

      // Sort by depth for correct 3D occlusions
      projected.sort((a, b) => b.z2 - a.z2);

      // Draw Connection Lattice (Edges)
      ctx.lineWidth = 0.8;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const dx = projected[i].px - projected[j].px;
          const dy = projected[i].py - projected[j].py;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 75) {
            const alpha = Math.max(0.04, (1 - dist / 75) * 0.35);
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(projected[i].px, projected[i].py);
            ctx.lineTo(projected[j].px, projected[j].py);
            ctx.stroke();
          }
        }
      }

      // Draw particle flow along edges
      particles.forEach((p) => {
        p.progress += p.speed;
        if (p.progress >= 1) {
          p.progress = 0;
          p.from = Math.floor(Math.random() * NODE_COUNT);
          p.to = Math.floor(Math.random() * NODE_COUNT);
        }
        const p1 = projected[p.from % projected.length];
        const p2 = projected[p.to % projected.length];
        if (p1 && p2) {
          const curX = p1.px + (p2.px - p1.px) * p.progress;
          const curY = p1.py + (p2.py - p1.py) * p.progress;
          ctx.fillStyle = '#6D45CF';
          ctx.beginPath();
          ctx.arc(curX, curY, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw 3D Nodes
      projected.forEach((p) => {
        const rad = Math.max(1.5, p.node.radius * p.scale);
        
        // Node halo glow
        const glow = ctx.createRadialGradient(p.px, p.py, 0, p.px, p.py, rad * 3);
        glow.addColorStop(0, p.node.color);
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.px, p.py, rad * 2.8, 0, Math.PI * 2);
        ctx.fill();

        // Node core
        ctx.fillStyle = p.node.color;
        ctx.beginPath();
        ctx.arc(p.px, p.py, rad, 0, Math.PI * 2);
        ctx.fill();
      });

      // Center glowing neural core
      const coreGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 140);
      coreGlow.addColorStop(0, 'rgba(109, 69, 207, 0.12)');
      coreGlow.addColorStop(0.6, 'rgba(139, 92, 246, 0.04)');
      coreGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, 140, 0, Math.PI * 2);
      ctx.fill();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeMode]);

  return (
    <div className={`relative w-full h-[400px] lg:h-[460px] rounded-3xl overflow-hidden bg-[#0A0C14] border border-white/[0.08] shadow-2xl flex flex-col justify-between p-6 ${className}`}>
      {/* 3D Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
      />

      {/* Top HUD Overlay */}
      <div className="relative z-10 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.06] backdrop-blur-md border border-white/[0.1] text-white">
          <Activity className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
            3D Spatial Intelligence Matrix
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Real-Time Neural Engine</span>
        </div>
      </div>

      {/* Bottom HUD Metrics Bar */}
      <div className="relative z-10 grid grid-cols-3 gap-2.5 p-3.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/[0.08]">
        <div className="text-left">
          <span className="text-[10px] text-[#A1A1AE] uppercase font-bold tracking-wider block">
            Capital Velocity
          </span>
          <span className="text-xs sm:text-sm font-extrabold text-white font-mono mt-0.5 block">
            ₹85.4K / Day
          </span>
        </div>

        <div className="text-left border-l border-white/[0.08] pl-3">
          <span className="text-[10px] text-[#A1A1AE] uppercase font-bold tracking-wider block">
            Topology Nodes
          </span>
          <span className="text-xs sm:text-sm font-extrabold text-[#6D45CF] font-mono mt-0.5 block">
            38 Active
          </span>
        </div>

        <div className="text-left border-l border-white/[0.08] pl-3">
          <span className="text-[10px] text-[#A1A1AE] uppercase font-bold tracking-wider block">
            Risk Precision
          </span>
          <span className="text-xs sm:text-sm font-extrabold text-[#16A879] font-mono mt-0.5 block">
            99.2% Calibrated
          </span>
        </div>
      </div>
    </div>
  );
};
