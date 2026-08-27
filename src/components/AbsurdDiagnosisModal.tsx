import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  X,
  Copy,
  Check,
  Share2,
  Sparkles,
  ShieldCheck,
  HeartPulse,
  Wind,
} from 'lucide-react';
import { getBreathRankTitle } from '../utils/mockFriends';

interface AbsurdDiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  userCount: number;
  userName: string;
}

export const AbsurdDiagnosisModal: React.FC<AbsurdDiagnosisModalProps> = ({
  isOpen,
  onClose,
  userCount,
  userName,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const rankInfo = getBreathRankTitle(userCount);
  const approxLitersO2 = (userCount * 0.5).toFixed(1);
  const co2Kg = (userCount * 0.0004).toFixed(3);
  const dateStr = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const shareText = `🫁【今日人类生存证明】\n名字：${userName || '我'}\n今日有效呼吸：${userCount} 次\n吸入氧气：约 ${approxLitersO2} 升\n评定称号：【${rankInfo.title}】\n生命体征：极度平稳，正在均匀耗氧。\n⚠️ 友情提示：榜单上小李疑似停止呼吸，大家快去确认一下他的情况！\n#你今天呼吸了吗 #呼吸排行榜`;

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl my-8 overflow-hidden"
        >
          {/* Decorative Background Stamp & Grid */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Certificate Header */}
          <div className="text-center space-y-1 pb-4 border-b border-slate-800">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold mb-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>地球碳基生物管理局认证</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              活体呼吸合格鉴定书
            </h2>
            <p className="text-[11px] text-slate-400 font-mono">
              CERTIFICATE NO: BREATHE-{Date.now().toString().slice(-6)}
            </p>
          </div>

          {/* Body Content */}
          <div className="py-5 space-y-4 text-slate-200">
            <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/60 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">被鉴定人：</span>
                <span className="font-bold text-white text-sm">{userName || '我 (碳基人类)'}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">鉴定日期：</span>
                <span className="font-mono text-slate-300">{dateStr}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">今日累计呼吸：</span>
                <span className="font-black text-cyan-400 font-mono text-lg">
                  {userCount} 次
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">估算消耗氧气：</span>
                <span className="font-bold text-teal-300">约 {approxLitersO2} 升 (L)</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">对植物贡献(CO₂)：</span>
                <span className="font-bold text-emerald-300">约 {co2Kg} kg</span>
              </div>
            </div>

            {/* Title Badge & Meme Verdict */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-teal-950/40 border border-cyan-500/30 space-y-2">
              <div className="text-xs font-bold text-cyan-400 uppercase">
                官方鉴定评级：
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400 shrink-0" />
                <span className="text-lg font-black text-white">{rankInfo.title}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                  正常活着
                </span>
              </div>
              <p className="text-xs text-slate-300 italic">
                “经审查，该人类今日持续维持了肺部舒缩运动，各项生理指标显示并未成仙，准予继续在地球生活。”
              </p>
            </div>

            {/* Absurd Official Meme Stamp */}
            <div className="flex justify-end pt-1">
              <div className="inline-block border-2 border-rose-500/80 rounded-xl p-2 px-3 text-center transform rotate-6 bg-rose-950/20">
                <div className="text-[10px] font-black text-rose-400 tracking-widest uppercase">
                  【已检阅 · 尚在人世】
                </div>
                <div className="text-[9px] text-rose-500/80 font-mono">
                  VERIFIED LIVING BEING
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={handleCopyText}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 transition-all"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-950" />
                  <span>已复制整活文案到剪贴板！</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>复制报告分享到群里炫耀</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors"
            >
              返回继续呼吸
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
