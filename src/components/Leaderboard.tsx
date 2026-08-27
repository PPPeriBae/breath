import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  AlertTriangle,
  HeartPulse,
  Plus,
  Share2,
  Zap,
  CheckCircle2,
  Sparkles,
  UserPlus,
  Flame,
  Award,
  RefreshCcw,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FriendItem } from '../types';
import { playDefibrillatorZap, playHeartbeatBeep } from '../utils/audio';

interface LeaderboardProps {
  userCount: number;
  userName: string;
  setUserName: (name: string) => void;
  friends: FriendItem[];
  setFriends: React.Dispatch<React.SetStateAction<FriendItem[]>>;
  onOpenCertificate: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  userCount,
  userName,
  setUserName,
  friends,
  setFriends,
  onOpenCertificate,
}) => {
  const [isCprModalOpen, setIsCprModalOpen] = useState(false);
  const [cprTarget, setCprTarget] = useState<FriendItem | null>(null);
  const [cprProgress, setCprProgress] = useState(0);
  const [cprSuccessMessage, setCprSuccessMessage] = useState('');
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);
  const [newFriendName, setNewFriendName] = useState('');
  const [newFriendCount, setNewFriendCount] = useState('100');
  const [pokedFriendId, setPokedFriendId] = useState<string | null>(null);

  // Update user's count in friends list
  const allList: FriendItem[] = friends.map((f) => {
    if (f.isUser || f.id === 'user') {
      return {
        ...f,
        name: userName || '我 (你)',
        count: userCount,
        statusText:
          userCount === 0
            ? '尚未开始呼吸，快点击吸一口！'
            : userCount > 900
            ? '🔥 肺活量登顶，朋友圈耗氧霸主！'
            : userCount > 500
            ? '生命体征极佳，呼吸顺畅'
            : '正常碳基生命体征',
      };
    }
    return f;
  });

  // Sort descending by count
  const sortedList = [...allList].sort((a, b) => b.count - a.count);

  const userRankIndex = sortedList.findIndex((item) => item.isUser || item.id === 'user');
  const userRank = userRankIndex !== -1 ? userRankIndex + 1 : 1;

  // Xiao Li CPR Flow
  const handleStartCPR = (target: FriendItem) => {
    setCprTarget(target);
    setCprProgress(0);
    setCprSuccessMessage('');
    setIsCprModalOpen(true);
  };

  const handleCPRShock = () => {
    playDefibrillatorZap();
    const nextProg = cprProgress + 25;
    setCprProgress(nextProg);

    if (nextProg >= 100) {
      setTimeout(() => {
        playHeartbeatBeep();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });

        // Revive the friend!
        setFriends((prev) =>
          prev.map((f) => {
            if (f.id === cprTarget?.id) {
              return {
                ...f,
                count: f.count + 50,
                statusText: '🫁 抢救成功！已猛吸一大口冷气，生命体征恢复！',
                statusLevel: 'safe',
                cprCount: (f.cprCount || 0) + 1,
              };
            }
            return f;
          })
        );

        setCprSuccessMessage(`🎉 抢救成功！${cprTarget?.name} 猛吸了一大口新鲜空气，呼吸 +50！`);
      }, 400);
    }
  };

  const handlePoke = (friend: FriendItem) => {
    setPokedFriendId(friend.id);
    // Add +1 to friend for fun
    setFriends((prev) =>
      prev.map((f) => {
        if (f.id === friend.id) {
          return {
            ...f,
            count: f.count + 1,
          };
        }
        return f;
      })
    );
    setTimeout(() => {
      setPokedFriendId(null);
    }, 1800);
  };

  const handleAddCustomFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFriendName.trim()) return;

    const parsedCount = parseInt(newFriendCount, 10) || 0;
    const avatars = ['🥑', '🦥', '🚀', '🐼', '🤖', '👻', '🧜‍♂️', '🦔'];
    const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    let statusLevel: FriendItem['statusLevel'] = 'safe';
    let statusText = '正在健康呼吸';
    if (parsedCount <= 150) {
      statusLevel = 'danger';
      statusText = `⚠️ 疑似呼吸微弱，急需关注`;
    } else if (parsedCount > 1000) {
      statusLevel = 'super';
      statusText = '肺活量超神，狂吸不止';
    }

    const newFriend: FriendItem = {
      id: 'custom_' + Date.now(),
      name: newFriendName.trim(),
      avatar: randomAvatar,
      count: parsedCount,
      statusText,
      statusLevel,
      lastActive: '刚刚',
      comment: '被你拉来一起赛博呼吸',
    };

    setFriends((prev) => [...prev, newFriend]);
    setNewFriendName('');
    setNewFriendCount('100');
    setShowAddFriendModal(false);
  };

  return (
    <div id="leaderboard-container" className="w-full max-w-xl mx-auto px-4 pb-12">
      {/* Header & User Highlight Card */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-3xl p-5 sm:p-6 backdrop-blur-md shadow-xl mb-6">
        <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-700/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                今日呼吸排行榜
              </h2>
              <p className="text-xs text-slate-400">谁在努力活着，谁在偷偷缺氧</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="add-friend-btn"
              onClick={() => setShowAddFriendModal(true)}
              className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-200 border border-slate-600/40 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
              <span>加朋友</span>
            </button>
            <button
              id="get-certificate-btn"
              onClick={onOpenCertificate}
              className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/30 transition-colors shadow-sm"
            >
              <Award className="w-3.5 h-3.5" />
              <span>生存报告</span>
            </button>
          </div>
        </div>

        {/* Highlight Banner: "你今天呼吸：284 次" */}
        <div className="bg-gradient-to-r from-cyan-950/70 via-slate-900/90 to-teal-950/70 border border-cyan-500/40 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-28 h-28 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  当前排名 第 {userRank} 名
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  实时同步
                </span>
              </div>
              <div className="text-sm text-slate-300 font-medium">
                你今天呼吸：
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-emerald-400 font-mono">
                  {userCount}
                </span>
                <span className="text-lg font-bold text-slate-300">次</span>
              </div>
            </div>

            {/* User Quick Tag & Edit Nickname */}
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-xl">
                <span className="text-base">😎</span>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="自定义我的昵称"
                  maxLength={12}
                  className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none w-24 text-right"
                  title="点击修改昵称"
                />
              </div>
              <div className="text-[11px] text-teal-400 font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-teal-300" />
                <span>
                  {userCount > 500 ? '深吸猛吐 · 生机勃勃' : '氧气储备充足 · 正常运转'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Friends List Container */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-400">
          <span>排行榜详情</span>
          <span>今日呼吸频次</span>
        </div>

        {sortedList.map((friend, idx) => {
          const isDanger = friend.statusLevel === 'danger' || friend.id === 'li';
          const isSuper = friend.statusLevel === 'super' || friend.count > 800;
          const isCurrentRank1 = idx === 0;

          return (
            <motion.div
              key={friend.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative rounded-2xl p-4 transition-all duration-200 border backdrop-blur-sm ${
                friend.isUser
                  ? 'bg-cyan-950/40 border-cyan-500/60 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-500/40'
                  : isDanger
                  ? 'bg-rose-950/30 border-rose-500/50 shadow-rose-950/30 ring-1 ring-rose-500/30'
                  : 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800/90'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Left: Rank & Avatar & Info */}
                <div className="flex items-start gap-3">
                  {/* Rank Badge */}
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 mt-1 ${
                      idx === 0
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/30'
                        : idx === 1
                        ? 'bg-slate-300 text-slate-900'
                        : idx === 2
                        ? 'bg-amber-700 text-amber-100'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </div>

                  {/* Avatar */}
                  <div className="relative text-2xl shrink-0">
                    <span>{friend.avatar}</span>
                    {isDanger && (
                      <span className="absolute -top-1 -right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-sm sm:text-base text-slate-100">
                        {friend.name}
                      </span>
                      {friend.isUser && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                          你
                        </span>
                      )}
                      {isCurrentRank1 && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-0.5">
                          <Flame className="w-2.5 h-2.5" /> 呼吸榜首
                        </span>
                      )}
                      {friend.id === 'wang' && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          人肉抽风机
                        </span>
                      )}
                    </div>

                    {/* Status & Meme Note */}
                    <div className="text-xs">
                      {isDanger ? (
                        <div className="flex items-center gap-1.5 text-rose-400 font-bold animate-pulse">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>系统：{friend.name}疑似停止呼吸。</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">{friend.statusText}</span>
                      )}
                    </div>

                    {friend.comment && (
                      <div className="text-[11px] text-slate-500 italic">
                        "{friend.comment}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Count & Interaction Button */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <div className="text-right">
                    <span className="text-xl sm:text-2xl font-black font-mono text-slate-100">
                      {friend.count}
                    </span>
                    <span className="text-xs text-slate-400 ml-1 font-medium">次</span>
                  </div>

                  {/* Actions: If Xiao Li or Danger -> CPR button; otherwise Poke button */}
                  {isDanger ? (
                    <button
                      id={`cpr-btn-${friend.id}`}
                      onClick={() => handleStartCPR(friend)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-black text-xs flex items-center gap-1.5 shadow-md shadow-rose-900/50 animate-bounce"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                      <span>一键抢救{friend.name}</span>
                    </button>
                  ) : !friend.isUser ? (
                    <button
                      id={`poke-btn-${friend.id}`}
                      onClick={() => handlePoke(friend)}
                      className="px-2.5 py-1 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors border border-slate-600/40"
                    >
                      <span>
                        {pokedFriendId === friend.id ? '💨 已催促吸气+1' : '👉 戳一戳催呼吸'}
                      </span>
                    </button>
                  ) : null}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* CPR Rescue Modal */}
      <AnimatePresence>
        {isCprModalOpen && cprTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-slate-900 border-2 border-rose-500/60 rounded-3xl p-6 shadow-2xl relative overflow-hidden"
            >
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-3xl">
                  {cprProgress >= 100 ? '🫁' : '⚡️'}
                </div>

                <h3 className="text-xl font-black text-white">
                  {cprProgress >= 100 ? '抢救成功！' : `正在对「${cprTarget.name}」实施赛博人工呼吸`}
                </h3>

                <p className="text-xs text-slate-300">
                  {cprProgress >= 100
                    ? cprSuccessMessage
                    : `系统检测到「${cprTarget.name}」已停止呼吸，请快速点击下方电极进行除颤救治！`}
                </p>

                {/* CPR Progress Bar */}
                <div className="space-y-1.5 py-2">
                  <div className="flex justify-between text-xs font-bold text-slate-400">
                    <span>生命体征充能</span>
                    <span className="font-mono text-cyan-400">{Math.min(cprProgress, 100)}%</span>
                  </div>
                  <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                    <motion.div
                      className="h-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400"
                      style={{ width: `${Math.min(cprProgress, 100)}%` }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    />
                  </div>
                </div>

                {/* Actions */}
                {cprProgress < 100 ? (
                  <button
                    id="cpr-shock-button"
                    onClick={handleCPRShock}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-base shadow-lg shadow-rose-900/50 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  >
                    <HeartPulse className="w-5 h-5 animate-pulse" />
                    <span>⚡️ 按压心肺除颤 ({cprProgress}%)</span>
                  </button>
                ) : (
                  <button
                    id="cpr-finish-button"
                    onClick={() => setIsCprModalOpen(false)}
                    className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>好的，让{cprTarget.name}继续呼吸</span>
                  </button>
                )}

                {cprProgress < 100 && (
                  <button
                    onClick={() => setIsCprModalOpen(false)}
                    className="text-xs text-slate-500 hover:text-slate-400 underline pt-1"
                  >
                    放弃抢救 (放任{cprTarget.name}缺氧)
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Custom Friend Modal */}
      <AnimatePresence>
        {showAddFriendModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl"
            >
              <h3 className="text-lg font-black text-white mb-2">添加好友到呼吸榜</h3>
              <p className="text-xs text-slate-400 mb-4">
                把朋友的名字和呼吸数加上，随时监控他的生命体征！
              </p>

              <form onSubmit={handleAddCustomFriend} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    朋友名字 / 外号
                  </label>
                  <input
                    type="text"
                    required
                    value={newFriendName}
                    onChange={(e) => setNewFriendName(e.target.value)}
                    placeholder="如：同桌小王、部门领导、隔壁老张"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    初始呼吸次数
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="99999"
                    value={newFriendCount}
                    onChange={(e) => setNewFriendCount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    输入 0 ~ 138 会触发「停止呼吸」紧急警告哦！
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddFriendModal(false)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-cyan-500 text-slate-950 text-xs font-black hover:bg-cyan-400"
                  >
                    确认添加
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
