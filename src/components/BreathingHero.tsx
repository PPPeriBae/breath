import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wind, Volume2, VolumeX, Sparkles, Flame, Play, Pause, RefreshCw, Clock, Activity } from 'lucide-react';
import { FloatingNumber, RhythmConfig } from '../types';
import { playInhaleSound, playExhaleSound, playBreathePopSound } from '../utils/audio';

interface BreathingHeroProps {
  userCount: number;
  onBreathe: (amount?: number) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean | ((prev: boolean) => boolean)) => void;
  onReset: () => void;
}

const RHYTHMS: RhythmConfig[] = [
  { id: 'normal', label: '日常节奏', inhaleSec: 3.5, exhaleSec: 3.5, tag: '推荐' },
  { id: 'deep', label: '深呼吸', inhaleSec: 4.5, exhaleSec: 4.5, tag: '放松' },
  { id: 'fast', label: '急促喘气', inhaleSec: 1.8, exhaleSec: 1.8, tag: '高能' },
];

export const BreathingHero: React.FC<BreathingHeroProps> = ({
  userCount,
  onBreathe,
  soundEnabled,
  setSoundEnabled,
  onReset,
}) => {
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [selectedRhythm, setSelectedRhythm] = useState<RhythmConfig>(RHYTHMS[0]);
  const [isHovered, setIsHovered] = useState(false);
  const [elapsedInPhase, setElapsedInPhase] = useState(0); // in seconds
  const [isAutoBreathing, setIsAutoBreathing] = useState(false);
  const [floatingNumbers, setFloatingNumbers] = useState<FloatingNumber[]>([]);
  const [combo, setCombo] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  
  const comboTimerRef = useRef<NodeJS.Timeout | null>(null);
  const floatIdCounter = useRef(0);
  const phaseStartTimeRef = useRef<number>(Date.now());
  const onBreatheRef = useRef(onBreathe);
  onBreatheRef.current = onBreathe;
  const isAutoBreathingRef = useRef(isAutoBreathing);
  isAutoBreathingRef.current = isAutoBreathing;

  const phaseTotalDuration = phase === 'inhale' ? selectedRhythm.inhaleSec : selectedRhythm.exhaleSec;

  // Real-time animation ticker for accurate remaining seconds and SVG progress
  useEffect(() => {
    phaseStartTimeRef.current = Date.now();
    setElapsedInPhase(0);

    if (soundEnabled) {
      if (phase === 'inhale') {
        playInhaleSound();
      } else if (phase === 'exhale') {
        playExhaleSound();
      }
    }

    const interval = setInterval(() => {
      const elapsed = (Date.now() - phaseStartTimeRef.current) / 1000;
      if (elapsed >= phaseTotalDuration) {
        const nextPhase = phase === 'inhale' ? 'exhale' : 'inhale';
        setPhase(nextPhase);
        if (isAutoBreathingRef.current && nextPhase === 'exhale') {
          onBreatheRef.current(1);
        }
        setElapsedInPhase(0);
        phaseStartTimeRef.current = Date.now();
      } else {
        setElapsedInPhase(elapsed);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [phase, selectedRhythm, soundEnabled, phaseTotalDuration]);

  // Derived progress values
  const remainingSec = Math.max(0, phaseTotalDuration - elapsedInPhase);
  const progressRatio = Math.min(1, Math.max(0, elapsedInPhase / phaseTotalDuration));

  // Dynamic visual scale
  const currentVisualScale = useMemo(() => {
    const minScale = 0.86;
    const maxScale = isHovered ? 1.35 : 1.22;
    if (phase === 'inhale') {
      return minScale + (maxScale - minScale) * progressRatio;
    } else {
      return maxScale - (maxScale - minScale) * progressRatio;
    }
  }, [phase, progressRatio, isHovered]);

  const handleManualBreathe = (e: React.MouseEvent | React.TouchEvent) => {
    let clientX = window.innerWidth / 2;
    let clientY = window.innerHeight / 2;

    if ('clientX' in e && (e as React.MouseEvent).clientX !== 0) {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    } else if ('touches' in e && (e as React.TouchEvent).touches?.[0]) {
      clientX = (e as React.TouchEvent).touches[0].clientX;
      clientY = (e as React.TouchEvent).touches[0].clientY;
    }

    const nextCombo = combo + 1;
    setCombo(nextCombo);

    if (soundEnabled) {
      playBreathePopSound(nextCombo);
    }

    onBreathe(1);

    // Floating meme text
    const funnyTexts = ['+1 呼吸', '+1 吸入新鲜氧气', '+1 活体认证', '+1 维持心跳', '+1 续命成功', '+1 肺部舒畅', '+1 耗氧达人'];
    const text = nextCombo % 5 === 0 ? `+1 连击 x${nextCombo}! 🔥` : funnyTexts[Math.floor(Math.random() * funnyTexts.length)];
    
    const newFloat: FloatingNumber = {
      id: ++floatIdCounter.current,
      x: clientX + (Math.random() * 80 - 40),
      y: clientY - 30 + (Math.random() * 20 - 10),
      text,
      color: nextCombo >= 10 ? '#38bdf8' : '#34d399',
    };

    setFloatingNumbers((prev) => [...prev.slice(-8), newFloat]);

    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    comboTimerRef.current = setTimeout(() => {
      setCombo(0);
    }, 2500);
  };

  const removeFloat = (id: number) => {
    setFloatingNumbers((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div id="breathing-hero-section" className="relative flex flex-col items-center justify-center pt-2 pb-6 px-4">
      {/* Floating Click Particles */}
      <AnimatePresence>
        {floatingNumbers.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 1, y: item.y, x: item.x, scale: 0.8 }}
            animate={{ opacity: 0, y: item.y - 95, scale: 1.25 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut' }}
            onAnimationComplete={() => removeFloat(item.id)}
            className="fixed pointer-events-none z-50 font-extrabold text-sm md:text-base drop-shadow-md px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-700/80 shadow-lg"
            style={{ color: item.color || '#34d399', left: 0, top: 0 }}
          >
            {item.text}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main Catchphrase */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wide mb-2 shadow-inner">
          <Wind className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>今日生存基本纲领</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-sm">
          你今天呼吸了吗？
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1.5 font-medium">
          鼠标悬浮圆圈体验律动 · 实时秒数倒数 · 随心呼吸 +1
        </p>
      </motion.div>

      {/* Breathing Bubble Canvas Container */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center my-3 select-none">
        {/* Ambient Outer Halo with Hover Flare */}
        <motion.div
          animate={{
            scale: isHovered ? [currentVisualScale * 1.2, currentVisualScale * 1.4] : currentVisualScale * 1.2,
            opacity: isHovered ? (phase === 'inhale' ? 0.7 : 0.5) : (phase === 'inhale' ? 0.45 : 0.25),
          }}
          transition={{ duration: 0.3 }}
          className={`absolute inset-0 rounded-full blur-3xl pointer-events-none transition-colors duration-500 ${
            phase === 'inhale'
              ? 'bg-gradient-to-tr from-cyan-500/30 via-teal-400/40 to-blue-500/30'
              : 'bg-gradient-to-tr from-teal-500/20 via-emerald-400/30 to-indigo-600/20'
          }`}
        />

        {/* Multiple Pulsing Concentric Rings */}
        <motion.div
          animate={{
            scale: isHovered ? currentVisualScale * 1.18 : currentVisualScale * 1.1,
            opacity: isHovered ? 0.85 : 0.4,
            rotate: phase === 'inhale' ? 180 : 360,
          }}
          transition={{ duration: 0.5, ease: 'linear' }}
          className={`absolute inset-2 sm:inset-3 rounded-full border-2 border-dashed pointer-events-none transition-all duration-300 ${
            isHovered ? 'border-cyan-300/90 shadow-[0_0_25px_rgba(6,182,212,0.5)]' : 'border-cyan-400/30'
          }`}
        />

        {/* SVG Live Countdown Circular Ring */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <svg className="w-60 h-60 sm:w-68 sm:h-68 transform -rotate-90">
            {/* Background Track */}
            <circle
              cx="50%"
              cy="50%"
              r="105"
              className="stroke-slate-800/80"
              strokeWidth={isHovered ? '6' : '4'}
              fill="transparent"
            />
            {/* Animated Active Progress Track */}
            <circle
              cx="50%"
              cy="50%"
              r="105"
              className={`transition-colors duration-300 ${
                phase === 'inhale' ? 'stroke-cyan-400' : 'stroke-teal-300'
              }`}
              strokeWidth={isHovered ? '6' : '4'}
              strokeDasharray={2 * Math.PI * 105}
              strokeDashoffset={
                phase === 'inhale'
                  ? 2 * Math.PI * 105 * (1 - progressRatio)
                  : 2 * Math.PI * 105 * progressRatio
              }
              strokeLinecap="round"
              fill="transparent"
              style={{
                filter: isHovered ? 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.9))' : 'drop-shadow(0 0 4px rgba(6, 182, 212, 0.4))',
              }}
            />
          </svg>
        </div>

        {/* Primary Interactive Breathing Circle */}
        <motion.div
          id="interactive-breath-circle"
          style={{ scale: currentVisualScale }}
          whileTap={{ scale: currentVisualScale * 0.93 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleManualBreathe}
          className={`relative w-48 h-48 sm:w-56 sm:h-56 rounded-full cursor-pointer flex flex-col items-center justify-center p-4 backdrop-blur-xl transition-shadow duration-300 select-none ${
            isHovered
              ? 'bg-gradient-to-b from-slate-800/95 via-slate-900/95 to-cyan-950/90 border-2 border-cyan-300 shadow-[0_0_40px_rgba(6,182,212,0.7)]'
              : 'bg-gradient-to-b from-slate-800/90 to-slate-900/95 border-2 border-cyan-400/50 shadow-2xl shadow-cyan-950/60 hover:border-cyan-300'
          }`}
        >
          {/* Dynamic Floating Live Time HUD when hovering */}
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20 whitespace-nowrap">
            <motion.div
              animate={{ y: isHovered ? -5 : 0, scale: isHovered ? 1.1 : 1 }}
              className={`px-3 py-1 rounded-full text-xs font-mono font-black flex items-center gap-1.5 shadow-lg border transition-all duration-200 ${
                isHovered
                  ? 'bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-950 border-cyan-100 shadow-cyan-400/60 ring-2 ring-cyan-400/40'
                  : 'bg-slate-900/90 text-cyan-300 border-slate-700'
              }`}
            >
              <Clock className={`w-3.5 h-3.5 ${isHovered ? 'animate-spin' : ''}`} />
              <span>
                {phase === 'inhale' ? '吸气' : '呼气'}倒计时: {remainingSec.toFixed(1)}s
              </span>
            </motion.div>
          </div>

          {/* Big Breathing Text: "吸——" / "呼——" */}
          <div className="text-center mt-2">
            <motion.div
              key={phase}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className={`text-4xl sm:text-5xl font-black tracking-widest text-transparent bg-clip-text transition-all duration-300 ${
                phase === 'inhale'
                  ? 'bg-gradient-to-r from-cyan-200 via-teal-200 to-emerald-300 drop-shadow-[0_0_14px_rgba(6,182,212,0.7)]'
                  : 'bg-gradient-to-r from-teal-200 via-emerald-200 to-cyan-300 drop-shadow-[0_0_14px_rgba(52,211,153,0.7)]'
              }`}
            >
              {phase === 'inhale' ? '吸——' : '呼——'}
            </motion.div>

            {/* Subtitle */}
            <div className="text-[11px] sm:text-xs text-slate-300 font-medium mt-1">
              {phase === 'inhale' ? '扩张胸腔 · 纳气' : '放松身心 · 吐浊'}
            </div>
          </div>

          {/* Interactive Hint / Click to +1 */}
          <div className="mt-2.5 flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-950/70 border border-slate-700/60 text-[11px] text-cyan-300 font-mono">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>{isHovered ? '点击圆圈直接 +1' : `${selectedRhythm.label} · ${phaseTotalDuration}s`}</span>
          </div>

          {/* Dynamic Percentage Pill on Hover */}
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-[10px] text-emerald-300 font-bold whitespace-nowrap shadow-md"
            >
              周期完成度 {Math.round(progressRatio * 100)}%
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Primary Action Button: "呼吸 +1" */}
      <div className="w-full max-w-sm flex flex-col items-center gap-3 mt-1">
        <motion.button
          id="main-breathe-button"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.94 }}
          onClick={handleManualBreathe}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onTouchStart={() => setIsPressed(true)}
          onTouchEnd={() => setIsPressed(false)}
          className={`w-full py-3.5 sm:py-4 px-8 rounded-2xl text-xl sm:text-2xl font-black tracking-wide text-white shadow-xl transition-all duration-150 flex items-center justify-center gap-3 border cursor-pointer ${
            isPressed
              ? 'bg-gradient-to-r from-teal-500 to-emerald-500 border-teal-300 shadow-teal-500/50'
              : 'bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 border-cyan-300/40 shadow-cyan-500/30 hover:shadow-cyan-500/50'
          }`}
        >
          <Wind className={`w-6 h-6 sm:w-7 sm:h-7 text-white ${isPressed ? 'animate-spin' : 'animate-pulse'}`} />
          <span>呼吸 +1</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-white/20 text-white backdrop-blur-sm">
            点击续命
          </span>
        </motion.button>

        {/* Combo / Streak notification */}
        <div className="h-6 flex items-center justify-center">
          {combo > 1 ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-950/40 border border-amber-500/30 px-3 py-0.5 rounded-full"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>疯狂呼吸连击 x{combo}！含氧量暴增 ⚡️</span>
            </motion.div>
          ) : (
            <span className="text-xs text-slate-500">点击大按钮或直接点击上方呼吸圆圈均可计数</span>
          )}
        </div>
      </div>

      {/* Control Tools Bar (Rhythm Switcher, Auto-Breathe, Sound, Reset) */}
      <div className="w-full max-w-md mt-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50 backdrop-blur-sm flex flex-wrap items-center justify-between gap-2">
        {/* Rhythm Presets */}
        <div className="flex items-center gap-1">
          {RHYTHMS.map((r) => (
            <button
              key={r.id}
              id={`rhythm-btn-${r.id}`}
              onClick={() => setSelectedRhythm(r)}
              className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                selectedRhythm.id === r.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            id="toggle-sound-button"
            onClick={() => setSoundEnabled((prev) => !prev)}
            title={soundEnabled ? '静音' : '开启呼吸音效'}
            className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors border cursor-pointer ${
              soundEnabled
                ? 'bg-teal-500/20 border-teal-500/40 text-teal-300'
                : 'bg-slate-700/40 border-slate-600/40 text-slate-400 hover:text-slate-200'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{soundEnabled ? '音效开' : '静音'}</span>
          </button>

          {/* Auto Breathe Toggle */}
          <button
            id="toggle-auto-breathe-button"
            onClick={() => setIsAutoBreathing((prev) => !prev)}
            title={isAutoBreathing ? '暂停自动呼吸' : '开启自动呼吸'}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors border cursor-pointer ${
              isAutoBreathing
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-700/40 border-slate-600/40 text-slate-300 hover:bg-slate-700/80'
            }`}
          >
            {isAutoBreathing ? (
              <>
                <Pause className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>自动中</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-slate-400" />
                <span>自动呼吸</span>
              </>
            )}
          </button>

          {/* Reset Today Count */}
          <button
            id="reset-counter-button"
            onClick={onReset}
            title="重置今日计数"
            className="p-2 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
