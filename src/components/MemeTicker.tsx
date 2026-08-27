import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Megaphone, AlertCircle } from 'lucide-react';
import { SYSTEM_TICKER_MESSAGES } from '../utils/mockFriends';

export const MemeTicker: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SYSTEM_TICKER_MESSAGES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div id="meme-ticker-bar" className="w-full bg-slate-950/70 border-y border-slate-800/80 py-2 px-4 backdrop-blur-sm">
      <div className="max-w-xl mx-auto flex items-center gap-2.5 overflow-hidden">
        <div className="flex items-center gap-1 text-[11px] font-extrabold text-amber-400 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-md shrink-0">
          <Megaphone className="w-3 h-3 text-amber-400 animate-pulse" />
          <span>快讯</span>
        </div>

        <div className="relative h-5 flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="absolute inset-0 text-xs text-slate-300 truncate font-medium flex items-center"
            >
              {SYSTEM_TICKER_MESSAGES[index]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
