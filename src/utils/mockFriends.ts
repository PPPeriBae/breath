import { FriendItem } from '../types';

export const INITIAL_FRIENDS: FriendItem[] = [
  {
    id: 'user',
    name: '我 (你)',
    avatar: '😎',
    count: 284,
    statusText: '生命体征平稳，正在均匀耗氧',
    statusLevel: 'safe',
    lastActive: '刚刚',
    isUser: true,
    comment: '努力维持碳基生物的基本尊严',
  },
  {
    id: 'wang',
    name: '小王',
    avatar: '🏃‍♂️',
    count: 921,
    statusText: '肺活量超标，疑似人肉鼓风机',
    statusLevel: 'super',
    lastActive: '1分钟前',
    comment: '每秒都在深呼吸，地球氧气减少的主要原因',
  },
  {
    id: 'li',
    name: '小李',
    avatar: '🪦',
    count: 138,
    statusText: '⚠️ 疑似停止呼吸，请立即确认其生命体征！',
    statusLevel: 'danger',
    lastActive: '48分钟前',
    comment: '系统检测到极度缺氧，急需赛博心肺复苏',
    cprCount: 0,
  },
  {
    id: 'zhang',
    name: '小张',
    avatar: '⚡️',
    count: 1540,
    statusText: '呼吸过速！疑似刚跑完八百米',
    statusLevel: 'hyper',
    lastActive: '30秒前',
    comment: '喘得像老式蒸汽火车',
  },
  {
    id: 'chen',
    name: '老陈',
    avatar: '🧘‍♂️',
    count: 12,
    statusText: '辟谷龟息中，医学奇迹',
    statusLevel: 'alien',
    lastActive: '3小时前',
    comment: '已经学会了皮肤光合作用',
  },
  {
    id: 'cat',
    name: '邻居的猫',
    avatar: '🐱',
    count: 420,
    statusText: '呼噜呼噜呼吸中',
    statusLevel: 'safe',
    lastActive: '5分钟前',
    comment: '边睡边吸，十分惬意',
  },
];

export const SYSTEM_TICKER_MESSAGES = [
  '🚨 系统警报：好友「小李」疑似停止呼吸已达 48 分钟，建议去微信发个问号！',
  '📢 喜报：好友「小王」今日呼吸次数已突破 920 次，被评为本周吸氧标兵！',
  '💨 气象台预警：今日全国空气含氧量正常，请大家放心大口喘气。',
  '💡 专家提示：虽然呼吸免费，但过度通气容易头晕，请保持节奏。',
  '✨ 宇宙广播：碳基生命每日平均呼吸约 20,000 次，您今日份额尚有充裕！',
  '🌿 绿植留言：感谢大家的二氧化碳供应，花草树木表示很赞。',
];

export const BREATHING_LEVELS = [
  { min: 0, max: 50, title: '初级活体', desc: '微弱生存中，建议多吸两口' },
  { min: 51, max: 200, title: '摸鱼人类', desc: '呼吸平缓，生存欲望适中' },
  { min: 201, max: 500, title: '健康打工人', desc: '生命体征平稳，持续耗氧' },
  { min: 501, max: 1000, title: '资深活人', desc: '肺活量惊人，朋友圈吸氧大佬' },
  { min: 1001, max: 5000, title: '人肉鼓风机', desc: '所到之处，空气流动加剧' },
  { min: 5001, max: Infinity, title: '赛博空气净化器', desc: '已经掌握天地吐纳真理' },
];

export function getBreathRankTitle(count: number) {
  const level = BREATHING_LEVELS.find((l) => count >= l.min && count <= l.max);
  return level || BREATHING_LEVELS[0];
}
