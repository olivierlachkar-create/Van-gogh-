import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue, AnimatePresence } from 'motion/react';

export function MagicalEnvironment({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 150 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      const target = e.target as HTMLElement;
      const isClickable = target.tagName === 'A' || 
                         target.tagName === 'BUTTON' || 
                         target.closest('button') || 
                         target.closest('a') ||
                         window.getComputedStyle(target).cursor === 'pointer';
      setIsHovering(!!isClickable);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      {/* Background Canvas Effect — Subtle moving stars/particles */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-30">
        <div className="absolute inset-0 bg-v-atmosphere" />
        <StarField />
      </div>

      {/* Global Grain/Canvas Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/canvas-orange.png')` }} />
      <div className="fixed inset-0 pointer-events-none z-[10000] opacity-[0.05] bg-noise" />

      {/* Floating Paint Blobs — Decorative elements */}
      <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
        <motion.div 
            animate={{ 
                x: [0, 100, 0], 
                y: [0, 50, 0],
                rotate: [0, 180, 360] 
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -left-20 w-96 h-96 bg-v-violet/5 rounded-full blur-[100px]"
        />
        <motion.div 
            animate={{ 
                x: [0, -80, 0], 
                y: [0, 120, 0],
                rotate: [360, 180, 0] 
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 -right-20 w-80 h-80 bg-gold/5 rounded-full blur-[100px]"
        />
      </div>

      {/* Custom Cursor — The Brushstroke */}
      {!isMobile && (
        <motion.div
           className="fixed top-0 left-0 z-[99999] pointer-events-none mix-blend-difference flex items-center justify-center"
           animate={{
             width: isHovering ? 64 : 32,
             height: isHovering ? 64 : 32,
           }}
           style={{
             x: cursorXSpring,
             y: cursorYSpring,
             translateX: '-50%',
             translateY: '-50%',
           }}
        >
          <div className={`w-full h-full rounded-full transition-all duration-500 ${isHovering ? 'bg-gold/40 border border-gold scale-110 blur-[2px]' : 'bg-gold/20 border border-gold/40'}`} />
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -inset-2 rounded-full border border-gold/10"
          />
          {isHovering && (
             <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute inset-0 flex items-center justify-center"
             >
                <div className="w-1 h-1 bg-gold rounded-full" />
             </motion.div>
          )}
        </motion.div>
      )}

      {children}
    </>
  );
}

function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: any[] = [];
    const starCount = 150;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5,
          speed: Math.random() * 0.2 + 0.1,
          opacity: Math.random(),
          direction: Math.random() * Math.PI * 2
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${star.opacity * 0.5})`; // Gold STARS
        ctx.fill();

        // Star movement - swirling
        star.x += Math.cos(star.direction) * star.speed;
        star.y += Math.sin(star.direction) * star.speed;

        // Wrap around
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        // Subtle twinkling
        star.opacity += (Math.random() - 0.5) * 0.05;
        if (star.opacity < 0.1) star.opacity = 0.1;
        if (star.opacity > 0.8) star.opacity = 0.8;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}
