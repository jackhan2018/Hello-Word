import { useState, useEffect } from 'react';
import { useParams, Link, Outlet } from 'react-router-dom';
import { 
  ChevronLeft, 
  Settings, 
  Users, 
  Globe, 
  Clock, 
  BookOpen,
  PenTool,
  FileText,
  TrendingUp,
  Sparkles,
  Share2,
  MoreVertical,
  Plus
} from 'lucide-react';
import { clsx } from 'clsx';
import type { Novel, Chapter } from '../types';

const mockNovel: Novel = {
  id: '1',
  userId: '1',
  title: '修仙：从凡人到飞升',
  subtitle: '逆天改命，踏上仙途',
  genre: 'xianxia',
  synopsis: '一个平凡的少年意外获得上古修仙传承，从此踏上逆天改命的修仙之路。看他如何在这个弱肉强食的修仙世界中，一步步走向巅峰，最终飞升成仙。',
  targetPlatforms: ['fanqie', 'qimao'],
  status: 'writing',
  wordCount: 856000,
  chapterCount: 156,
  settings: { writingMode: 'ai_collaboration' },
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date(),
};

const mockChapters: Chapter[] = Array.from({ length: 10 }, (_, i) => ({
  id: String(i + 1),
  novelId: '1',
  orderIndex: 150 + i,
  title: `第${150 + i + 1}章：${['宗门大比', '初露锋芒', '强敌环伺', '绝地反击', '突破境界', '新的征程', '意外收获', '危机四伏', '力挽狂澜', '决战时刻'][i]}`,
  content: '',
  wordCount: Math.floor(Math.random() * 2000) + 4000,
  status: i < 9 ? 'published' : 'completed' as const,
  createdAt: new Date(),
  updatedAt: new Date(),
}));

const recentChapters = mockChapters.slice(-5);

export function NovelWorkspace() {
  const { id } = useParams();
  const [novel] = useState<Novel>(mockNovel);

  const menuItems = [
    { icon: FileText, label: '章节管理', path: `/novels/${id}`, desc: '查看和编辑章节' },
    { icon: Users, label: '角色档案', path: `/novels/${id}/characters`, desc: '管理人物设定' },
    { icon: Globe, label: '世界观', path: `/novels/${id}/world`, desc: '构建世界设定' },
    { icon: Clock, label: '时间线', path: `/novels/${id}/timeline`, desc: '追踪剧情脉络' },
    { icon: Share2, label: '发布', path: `/novels/${id}/publish`, desc: '多平台发布' },
    { icon: Settings, label: '设置', path: `/novels/${id}/settings`, desc: '项目设置' },
  ];

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <header className="mb-6">
        <Link 
          to="/novels" 
          className="inline-flex items-center gap-2 text-ink-600 hover:text-indigo-600 transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4" />
          返回小说列表
        </Link>
        
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-16 h-20 rounded-lg bg-gradient-to-br from-indigo-500 via-indigo-600 to-vermillion-500 flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg">
              {novel.title.charAt(0)}
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-ink-900">{novel.title}</h1>
              {novel.subtitle && (
                <p className="text-ink-500 mt-0.5">{novel.subtitle}</p>
              )}
              <div className="flex items-center gap-3 mt-2">
                <span className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded">
                  {novel.genre === 'xianxia' ? '仙侠' : novel.genre}
                </span>
                <span className={clsx(
                  'px-2 py-0.5 text-xs rounded',
                  novel.status === 'writing' && 'bg-jade-100 text-jade-700',
                )}>
                  创作中
                </span>
                <span className="text-sm text-ink-400">
                  {novel.updatedAt.toLocaleDateString('zh-CN')}
                </span>
              </div>
            </div>
          </div>
          
          <button className="p-2 hover:bg-ink-100 rounded-lg">
            <MoreVertical className="w-5 h-5 text-ink-600" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={BookOpen}
          label="总章节"
          value={novel.chapterCount}
          color="indigo"
          trend="+2 本周"
        />
        <StatCard 
          icon={FileText}
          label="总字数"
          value={`${(novel.wordCount / 10000).toFixed(1)}万`}
          color="jade"
          trend="+3.2万 本周"
        />
        <StatCard 
          icon={TrendingUp}
          label="日均更新"
          value="3200字"
          color="amber"
          trend="↑ 稳定"
        />
        <StatCard 
          icon={Sparkles}
          label="AI协作"
          value="开启"
          color="vermillion"
          trend="效率提升 40%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-2xl border border-ink-200/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-serif font-bold text-ink-900">快速入口</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="p-4 rounded-xl bg-ink-50/50 hover:bg-indigo-50 border border-ink-100 hover:border-indigo-200 transition-all group"
              >
                <item.icon className="w-6 h-6 text-indigo-600 mb-2" />
                <p className="font-medium text-ink-900 group-hover:text-indigo-900">{item.label}</p>
                <p className="text-xs text-ink-500 mt-0.5">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-ink-200/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-serif font-bold text-ink-900">最近章节</h2>
            <Link to={`/novels/${id}`} className="text-sm text-indigo-600 hover:text-indigo-700">
              查看全部 →
            </Link>
          </div>
          <div className="space-y-2">
            {recentChapters.map((chapter) => (
              <Link
                key={chapter.id}
                to={`/novels/${id}/chapter/${chapter.id}`}
                className="block p-3 rounded-xl hover:bg-ink-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-ink-900 truncate">{chapter.title}</span>
                  <span className={clsx(
                    'px-2 py-0.5 text-xs rounded',
                    chapter.status === 'published' && 'bg-jade-100 text-jade-700',
                    chapter.status === 'completed' && 'bg-indigo-100 text-indigo-700',
                  )}>
                    {chapter.status === 'published' ? '已发布' : '已完成'}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-ink-400">
                  <span>{chapter.wordCount}字</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-vermillion-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium mb-1">开始写作</h3>
            <p className="text-indigo-100 text-sm">继续上一章的创作，或开始新章节</p>
          </div>
          <div className="flex gap-3">
            <Link 
              to={`/novels/${id}/chapter/${recentChapters[recentChapters.length - 1]?.id}`}
              className="px-6 py-3 bg-white text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors font-medium flex items-center gap-2"
            >
              <PenTool className="w-4 h-4" />
              继续写作
            </Link>
            <button className="px-6 py-3 bg-white/20 text-white rounded-xl hover:bg-white/30 transition-colors font-medium flex items-center gap-2">
              <Plus className="w-4 h-4" />
              新建章节
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  color, 
  trend 
}: { 
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
  trend: string;
}) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-ink-200/50 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className={clsx(
          'w-10 h-10 rounded-xl flex items-center justify-center',
          color === 'indigo' && 'bg-indigo-100 text-indigo-600',
          color === 'jade' && 'bg-jade-100 text-jade-600',
          color === 'amber' && 'bg-amber-100 text-amber-600',
          color === 'vermillion' && 'bg-vermillion-100 text-vermillion-600',
        )}>
          <Icon className="w-5 h-5" />
        </span>
        <span className={clsx(
          'text-xs px-2 py-0.5 rounded-full',
          trend.includes('↑') ? 'bg-jade-100 text-jade-700' : 'bg-ink-100 text-ink-600'
        )}>
          {trend}
        </span>
      </div>
      <p className="text-2xl font-bold text-ink-900">{value}</p>
      <p className="text-sm text-ink-500">{label}</p>
    </div>
  );
}
