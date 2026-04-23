import { motion } from 'motion/react';

export function SoulVisualizer({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;

  return (
    <div className="relative flex items-center justify-center w-24 h-12 overflow-hidden">
      {/* Background Glow */}
      <motion.div 
        animate={{ 
          scale: [1, 1.5, 1],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0 bg-gold rounded-full blur-xl"
      />
      
      {/* Organic Particles/Bars */}
      <div className="flex items-center gap-2 h-full relative z-10">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <motion.div
            key={i}
            animate={{
              height: [4, 28, 4],
              opacity: [0.3, 0.8, 0.3],
              backgroundColor: i % 2 === 0 ? '#D4AF37' : '#6B21A8'
            }}
            transition={{
              duration: 1.2 + (i * 0.2),
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-1 rounded-full shadow-[0_0_15px_rgba(214,175,55,0.4)]"
          />
        ))}
      </div>

      {/* Floating Sparkles */}
      {[1, 2, 3].map((i) => (
        <motion.div 
          key={`sparkle-${i}`}
          animate={{ 
            x: [0, (i - 2) * 20, 0],
            y: [0, -15, 0],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 2 + i,
            repeat: Infinity,
            delay: i * 0.5
          }}
          className="absolute w-1 h-1 bg-white rounded-full blur-[1px]"
        />
      ))}
    </div>
  );
}
