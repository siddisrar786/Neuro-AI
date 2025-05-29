
import { motion } from "framer-motion";
import { Activity, Brain } from "lucide-react";
import { useEffect, useState } from "react";

interface ScanningAnimationProps {
  imageUrl: string;
}

interface Dot {
  id: number;
  x: number;
  y: number;
  color: 'red' | 'green';
  visible: boolean;
}

const ScanningAnimation = ({ imageUrl }: ScanningAnimationProps) => {
  const [dots, setDots] = useState<Dot[]>([]);

  useEffect(() => {
    const createRandomDot = (): Dot => ({
      id: Math.random(),
      x: Math.random() * 80 + 10, // 10% to 90% of width
      y: Math.random() * 80 + 10, // 10% to 90% of height
      color: Math.random() > 0.5 ? 'red' : 'green',
      visible: true
    });

    const interval = setInterval(() => {
      setDots(prevDots => {
        // Remove old dots
        const activeDots = prevDots.filter(dot => dot.visible);
        
        // Add new dots randomly
        if (Math.random() > 0.3) { // 70% chance to add a new dot
          const newDot = createRandomDot();
          return [...activeDots, newDot];
        }
        
        return activeDots;
      });
    }, 200);

    // Hide dots randomly
    const hideInterval = setInterval(() => {
      setDots(prevDots => 
        prevDots.map(dot => ({
          ...dot,
          visible: Math.random() > 0.3 // 70% chance to stay visible
        }))
      );
    }, 300);

    return () => {
      clearInterval(interval);
      clearInterval(hideInterval);
    };
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Base Image Container */}
      <div className="relative overflow-hidden rounded-lg shadow-xl bg-black">
        <img 
          src={imageUrl} 
          alt="MRI Scan being analyzed" 
          className="w-full h-auto opacity-90"
        />
        
        {/* Scanning Line */}
        <motion.div
          className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-lg z-10"
          initial={{ top: "0%" }}
          animate={{ top: "100%" }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Analysis Dots */}
        {dots.map(dot => (
          <motion.div
            key={dot.id}
            className={`absolute w-2 h-2 rounded-full ${
              dot.color === 'red' ? 'bg-red-500' : 'bg-green-500'
            } shadow-lg z-20`}
            style={{
              left: `${dot.x}%`,
              top: `${dot.y}%`,
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: dot.visible ? [0, 1.5, 1] : 0,
              opacity: dot.visible ? [0, 1, 0.8] : 0
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: Math.random() * 0.6 + 0.1, // 0.1 to 0.7 seconds
              ease: "easeOut"
            }}
          />
        ))}
        
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 z-5">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(79, 70, 229, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(79, 70, 229, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }} />
        </div>
        
        {/* Scanning Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-cyan-400/15 via-transparent to-transparent z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Corner Indicators */}
        <div className="absolute top-2 left-2 z-15">
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-6 h-6 border-l-2 border-t-2 border-cyan-400 shadow-lg"
          />
        </div>
        <div className="absolute top-2 right-2 z-15">
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.25 }}
            className="w-6 h-6 border-r-2 border-t-2 border-cyan-400 shadow-lg"
          />
        </div>
        <div className="absolute bottom-2 left-2 z-15">
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
            className="w-6 h-6 border-l-2 border-b-2 border-cyan-400 shadow-lg"
          />
        </div>
        <div className="absolute bottom-2 right-2 z-15">
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.75 }}
            className="w-6 h-6 border-r-2 border-b-2 border-cyan-400 shadow-lg"
          />
        </div>
      </div>
      
      {/* Analysis Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 text-center"
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="h-5 w-5 text-indigo-600" />
          </motion.div>
          <span className="text-sm font-medium text-gray-700">AI Analysis in Progress</span>
        </div>
        
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>Atrophy Detection</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Healthy Regions</span>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mt-2">
          <div className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            <span>RegNet-150 Processing</span>
          </div>
          <div className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            <span>TxGemma Analysis</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ScanningAnimation;
