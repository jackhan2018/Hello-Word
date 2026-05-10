import { useEffect, useMemo } from 'react';
import { BookOpen, Clock, TrendingUp, Sparkles, PenTool, Users, AlertCircle } from 'lucide-react';
import { useNovelsStore, useChaptersStore, useAppStore } from '../store';
import { clsx } from 'clsx';
import type { ChapterStatus } from '../types';

const chapterStatusMap: Record<ChapterStatus, { label: string; taskStatus: string; progress: number }> = {
  draft: { label: '待处理', taskStatus: 'pending', progress: 0 },
  writing: { label: '写作中', taskStatus: 'writing', progress: 50 },
  revising: { label: '审核中', taskStatus: 'review', progress: 80 },
  completed: { label: '已完成', taskStatus: 'review', progress: 100 },
  published: { label: '已发布', taskStatus: 'review', progress: 100 },
};

export function Dashboard() {
  const { novels } = useNovelsStore();
  const chaptersByNovel = useChaptersStore((s) => s.chaptersByNovel);
  const loadChapters = useChaptersStore((s) => s.loadChapters);
  const { user } = useAppStore();

  useEffect(() => {
    novels.forEach((novel) => {
      loadChapters(novel.id);
    });
  }, [novels, loadChapters]);

  const allChapters = useMemo(() => {
    const result: { title: string; novelTitle: string; status: ChapterStatus; wordCount: number; updatedAt: Date }[] = [];
    novels.forEach((novel) => {
      const chapters = chaptersByNovel[novel.id] || [];
      chapters.forEach((ch) => {
        result.push({
          title: ch.title,
          novelTitle: novel.title,
          status: ch.status,
          wordCount: ch.wordCount,
          updatedAt: ch.updatedAt,
        });
      });
    });
    return result;
  }, [novels, chaptersByNovel]);

  const totalWords = useMemo(() => novels.reduce((sum, n) => sum + n.wordCount, 0), [novels]);
  const totalChapters = useMemo(() => novels.reduce((sum, n) => sum + n.chapterCount, 0), [novels]);
  const activeNovels = useMemo(() => novels.filter((n) => n.status === 'writing').length, [novels]);

  const todayWords = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return allChapters
      .filter((ch) => ch.updatedAt >= todayStart)
      .reduce((sum, ch) => sum + ch.wordCount, 0);
  }, [allChapters]);

  const weeklyData = useMemo(() => {
    const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const now = new Date();
    const result: { day: string; words: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 86400000);

      const wordsForDay = allChapters
        .filter((ch) => ch.updatedAt >= dayStart && ch.updatedAt < dayEnd)
        .reduce((sum, ch) => sum + ch.wordCount, 0);

      result.push({ day: dayNames[date.getDay()], words: wordsForDay });
    }

    return result;
  }, [allChapters]);

  const recentTasks = useMemo(() => {
    return [...allChapters]
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 5)
      .map((ch) => ({
        id: `${ch.novelTitle}-${ch.title}`,
        title: ch.title,
        novel: ch.novelTitle,
        status: chapterStatusMap[ch.status].taskStatus,
        progress: chapterStatusMap[ch.status].progress,
      }));
  }, [allChapters]);

  const stats = [
    { label: '总字数', value: totalWords.toLocaleString(), icon: PenTool, color: 'vermillion' },
    { label: '今日字数', value: todayWords.toLocaleString(), icon: TrendingUp, color: 'jade' },
    { label: '总章节', value: totalChapters, icon: BookOpen, color: 'indigo' },
    { label: '活跃小说', value: activeNovels, icon: Clock, color: 'amber' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-ink-900">
            欢迎回来，{user?.name || '作者'}
          </h1>
          <p className="text-ink-600 mt-1">
            {new Date().toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-vermillion-500 text-white rounded-lg hover:bg-vermillion-600 transition-colors flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            AI续写
          </button>
          <button className="px-4 py-2 bg-ink-900 text-ink-50 rounded-lg hover:bg-ink-800 transition-colors flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            新建小说
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={clsx(
              'bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-ink-200/50',
              'hover:shadow-md transition-shadow',
              `animate-slide-up`
            )}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-ink-500">{stat.label}</p>
                <p className={clsx(
                  'text-2xl font-bold mt-1',
                  stat.color === 'vermillion' && 'text-vermillion-600',
                  stat.color === 'jade' && 'text-jade-600',
                  stat.color === 'indigo' && 'text-indigo-600',
                  stat.color === 'amber' && 'text-amber-600'
                )}>
                  {stat.value}
                </p>
              </div>
              <div className={clsx(
                'w-12 h-12 rounded-xl flex items-center justify-center',
                stat.color === 'vermillion' && 'bg-vermillion-100 text-vermillion-600',
                stat.color === 'jade' && 'bg-jade-100 text-jade-600',
                stat.color === 'indigo' && 'bg-indigo-100 text-indigo-600',
                stat.color === 'amber' && 'bg-amber-100 text-amber-600'
              )}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-ink-200/50">
          <h2 className="text-lg font-serif font-bold text-ink-900 mb-4">本周创作趋势</h2>
          {weeklyData.some((d) => d.words > 0) ? (
            <div className="h-48 flex items-end gap-2">
              {weeklyData.map((day) => {
                const maxWords = Math.max(...weeklyData.map((d) => d.words), 1);
                const height = (day.words / maxWords) * 100;
                return (
                  <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg transition-all hover:from-indigo-500 hover:to-indigo-300 cursor-pointer"
                      style={{ height: `${height}%`, minHeight: day.words > 0 ? '20px' : '4px' }}
                    />
                    <span className="text-xs text-ink-500">{day.day}</span>
                    <span className="text-xs text-ink-400">{day.words}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-ink-400">
              暂无本周创作数据
            </div>
          )}
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-ink-200/50">
          <h2 className="text-lg font-serif font-bold text-ink-900 mb-4">待办任务</h2>
          {recentTasks.length > 0 ? (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-xl bg-ink-50/50 hover:bg-ink-100/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-ink-900">{task.title}</p>
                      <p className="text-sm text-ink-500 mt-0.5">{task.novel}</p>
                    </div>
                    <span className={clsx(
                      'px-2 py-0.5 text-xs rounded-full',
                      task.status === 'writing' && 'bg-indigo-100 text-indigo-700',
                      task.status === 'pending' && 'bg-amber-100 text-amber-700',
                      task.status === 'review' && 'bg-jade-100 text-jade-700'
                    )}>
                      {task.status === 'writing' && '写作中'}
                      {task.status === 'pending' && '待处理'}
                      {task.status === 'review' && '审核中'}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 bg-ink-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all"
                      style={{ width: `${task.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 flex items-center justify-center text-ink-400">
              暂无待办任务
            </div>
          )}
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm border border-ink-200/50">
        <h2 className="text-lg font-serif font-bold text-ink-900 mb-4">AI写作助手提示</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-200/50">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span className="font-medium text-indigo-900">上下文记忆优化</span>
            </div>
            <p className="text-sm text-indigo-700/80">
              检测到当前章节与第12章存在世界观冲突，建议检查势力设定。
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-jade-50 to-jade-100/50 border border-jade-200/50">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-jade-600" />
              <span className="font-medium text-jade-900">人设一致性</span>
            </div>
            <p className="text-sm text-jade-700/80">
              主角"林风"的语言风格在过去5章保持一致，继续保持！
            </p>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200/50">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <span className="font-medium text-amber-900">时间线提醒</span>
            </div>
            <p className="text-sm text-amber-700/80">
              第23章的事件时间线与第45章存在3天偏差，已自动修正。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
