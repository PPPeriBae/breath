import React, { useState, useEffect } from 'react';
import { BreathingHero } from './components/BreathingHero';
import { Leaderboard } from './components/Leaderboard';
import { MemeTicker } from './components/MemeTicker';
import { AbsurdDiagnosisModal } from './components/AbsurdDiagnosisModal';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { INITIAL_FRIENDS } from './utils/mockFriends';
import { FriendItem } from './types';
import { Wind, Award, RotateCcw, Sparkles } from 'lucide-react';

const STORAGE_KEYS = {
  USER_COUNT: 'breathe_app_user_count',
  USER_NAME: 'breathe_app_user_name',
  FRIENDS: 'breathe_app_friends',
  SOUND: 'breathe_app_sound',
};

export default function App() {
  const [userCount, setUserCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USER_COUNT);
      return saved !== null ? parseInt(saved, 10) : 284;
    } catch {
      return 284;
    }
  });

  const [userName, setUserName] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.USER_NAME) || '我 (你)';
    } catch {
      return '我 (你)';
    }
  });

  const [friends, setFriends] = useState<FriendItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FRIENDS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_FRIENDS;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SOUND);
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_COUNT, userCount.toString());
    } catch {
      // ignore
    }
  }, [userCount]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER_NAME, userName);
    } catch {
      // ignore
    }
  }, [userName]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FRIENDS, JSON.stringify(friends));
    } catch {
      // ignore
    }
  }, [friends]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SOUND, JSON.stringify(soundEnabled));
    } catch {
      // ignore
    }
  }, [soundEnabled]);

  const handleBreathe = (amount: number = 1) => {
    setUserCount((prev) => prev + amount);
  };

  const handleResetCount = () => {
    if (window.confirm('确定要清空今天的呼吸次数吗？（这不会导致您现实中窒息）')) {
      setUserCount(0);
    }
  };

  const handleRestoreAllData = () => {
    if (window.confirm('重置为初始数据（恢复小李停止呼吸状态和初始榜单）？')) {
      setUserCount(284);
      setFriends(INITIAL_FRIENDS);
      localStorage.removeItem(STORAGE_KEYS.FRIENDS);
      localStorage.removeItem(STORAGE_KEYS.USER_COUNT);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Dynamic Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      {/* App Header */}
      <header className="relative z-10 w-full max-w-xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-teal-400 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20">
            <Wind className="w-5 h-5 font-bold" />
          </div>
          <div>
            <span className="text-lg font-black tracking-tight text-white">《呼吸》</span>
            <span className="text-[10px] ml-1.5 px-1.5 py-0.2 rounded bg-slate-800 text-cyan-400 font-mono border border-slate-700">
              v1.0 活体版
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCertificateOpen(true)}
            className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
          >
            <Award className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">生存证明</span>
          </button>
          <button
            onClick={handleRestoreAllData}
            title="恢复初始示例数据"
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Live System Meme Ticker */}
      <div className="relative z-10">
        <MemeTicker />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 w-full max-w-xl mx-auto flex flex-col">
        {/* Top Breathing Section: "你今天呼吸了吗？", "吸——", "呼——", "呼吸 +1" */}
        <BreathingHero
          userCount={userCount}
          onBreathe={handleBreathe}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          onReset={handleResetCount}
        />

        {/* Leaderboard Section: "你今天呼吸：284次", 小王 921次, 小李 138次, "系统：小李疑似停止呼吸。" */}
        <Leaderboard
          userCount={userCount}
          userName={userName}
          setUserName={setUserName}
          friends={friends}
          setFriends={setFriends}
          onOpenCertificate={() => setIsCertificateOpen(true)}
        />

        {/* Disclaimer Banner: "娱乐计数，不代表实际呼吸次数。" */}
        <DisclaimerBanner />
      </main>

      {/* Diagnosis Report / Meme Certificate Modal */}
      <AbsurdDiagnosisModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        userCount={userCount}
        userName={userName}
      />
    </div>
  );
}
