import React, { useRef, useEffect } from 'react';
import { audioEngine } from '../lib/audioEngine';

interface VisualizerProps {
  color?: string;
  height?: number;
}

export const Visualizer: React.FC<VisualizerProps> = ({ 
  color = '#b1d43d', 
  height = 40 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;

    const draw = () => {
      const data = audioEngine.getWaveformData();
      if (!data) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      const width = canvas.width;
      const height = canvas.height;

      // Clear with slight fade for trail effect
      ctx.fillStyle = '#05151d';
      ctx.fillRect(0, 0, width, height);

      // Draw Grid (Retro style)
      ctx.strokeStyle = '#12212a';
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }
      for (let i = 0; i < height; i += 10) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
      }

      // Draw Waveform
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineJoin = 'round';

      const sliceWidth = width / data.length;
      let x = 0;

      for (let i = 0; i < data.length; i++) {
        // Analyser data is Float32 between -1 and 1
        const v = (data[i] as number) * 0.8; 
        const y = (height / 2) + (v * (height / 2));

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.stroke();

      // Add a scanline effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      for (let i = 0; i < height; i += 2) {
        ctx.fillRect(0, i, width, 1);
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, [color]);

  return (
    <div className="pixel-border-debossed bg-[#05151d] overflow-hidden" style={{ height }}>
      <canvas 
        ref={canvasRef} 
        width={300} 
        height={height} 
        className="w-full h-full block"
      />
    </div>
  );
};
