import React, { useState } from 'react';
import { Info, AlertCircle, ChevronDown, ChevronUp, Heart } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div id="disclaimer-footer" className="w-full max-w-xl mx-auto px-4 mt-6 mb-10">
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-center backdrop-blur-sm space-y-2">
        <div className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-black text-amber-400">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>免责声明：娱乐计数，不代表实际呼吸次数。</span>
        </div>

        <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
          正常成年人每日静息呼吸约 1.5 ~ 2.5 万次。本页面仅供摸鱼、减压与朋友间互相整蛊，请勿将其作为真实医疗或生命体征诊断依据。
        </p>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1 mt-1 transition-colors"
        >
          <span>{expanded ? '收起生存提示' : '查看荒谬生存守则'}</span>
          {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>

        {expanded && (
          <div className="pt-2 text-left text-xs text-slate-400 space-y-1.5 border-t border-slate-800/80 mt-2">
            <div className="flex items-start gap-1.5">
              <span className="text-cyan-400 font-bold">1.</span>
              <span>若发现好友「小李」连续多日未呼吸，请先确认他是否在开长会或通宵加班。</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-cyan-400 font-bold">2.</span>
              <span>如在现实生活中感到胸闷、憋气或心跳骤停，请立刻就医或呼叫 120，切勿在手机排行榜前盲目刷分。</span>
            </div>
            <div className="flex items-start gap-1.5">
              <span className="text-cyan-400 font-bold">3.</span>
              <span>多呼吸新鲜空气，少生闷气，祝您今天生命体征格外充沛！</span>
            </div>
          </div>
        )}
      </div>

      <div className="text-center mt-4 text-[11px] text-slate-600 font-medium flex items-center justify-center gap-1">
        <span>《呼吸》 · 愿世间每一个碳基生命都能畅快呼吸</span>
        <Heart className="w-3 h-3 text-rose-500/60 inline fill-rose-500/40" />
      </div>
    </div>
  );
};
