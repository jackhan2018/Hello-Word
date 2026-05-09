import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, BookOpen, Clock, TrendingUp, MoreVertical, Edit, Trash2, Copy } from 'lucide-react';
import { clsx } from 'clsx';
import { useNovelsStore } from '../store';
import type { Novel, NovelGenre } from '../types';

const mockNovels: Novel[] = [
  {
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
  },
  {
    id: '2',
    userId: '1',
    title: '都市兵王',
    subtitle: '王者归来',
    genre: 'urban',
    synopsis: '特种兵王回归都市，面对各路势力的挑衅，他一一粉碎敌人阴谋，保护身边之人，最终站在都市之巅。',
    targetPlatforms: ['qidian', 'wechat'],
    status: 'writing',
    wordCount: 420000,
    chapterCount: 89,
    settings: { writingMode: 'ai_auto' },
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date(),
  },
  {
    id: '3',
    userId: '1',
    title: '末世重生之我有系统',
    subtitle: '',
    genre: 'science',
    synopsis: '重生到末世前一个月，凭借前世记忆和神秘系统，在丧尸横行的世界中建立人类最后堡垒。',
    targetPlatforms: ['kuaibao'],
    status: 'draft',
    wordCount: 0,
    chapterCount: 0,
    settings: { writingMode: 'ai_collaboration' },
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date(),
  },
];

const genreLabels: Record<NovelGenre, string> = {
  xianxia: '仙侠',
  youth: '都市青春',
  urban: '都市',
  historical: '历史',
  game: '游戏',
  science: '科幻',
  psychological: '心理',
  horror: '悬疑',
  martial_arts: '武侠',
  other: '其他',
};

export function Novels() {
  const { novels, setNovels, addNovel } = useNovelsStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGenre, setFilterGenre] = useState<NovelGenre | 'all'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const displayNovels = novels.length > 0 ? novels : mockNovels;

  const filteredNovels = displayNovels.filter(novel => {
    const matchesSearch = novel.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          novel.synopsis.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = filterGenre === 'all' || novel.genre === filterGenre;
    return matchesSearch && matchesGenre;
  });

  const handleCreateNovel = () => {
    setShowCreateModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-ink-900">我的小说</h1>
          <p className="text-ink-600 mt-1">管理你的创作项目</p>
        </div>
        <button 
          onClick={handleCreateNovel}
          className="px-4 py-2 bg-vermillion-500 text-white rounded-lg hover:bg-vermillion-600 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          新建小说
        </button>
      </header>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
          <input
            type="text"
            placeholder="搜索小说标题或简介..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 border border-ink-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
          <select
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value as NovelGenre | 'all')}
            className="pl-10 pr-8 py-2.5 rounded-xl bg-white/80 border border-ink-200 focus:border-indigo-400 outline-none appearance-none cursor-pointer"
          >
            <option value="all">全部分类</option>
            {Object.entries(genreLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNovels.map((novel, index) => (
          <NovelCard key={novel.id} novel={novel} index={index} />
        ))}
        
        <button
          onClick={handleCreateNovel}
          className="min-h-[280px] border-2 border-dashed border-ink-300 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer group"
        >
          <div className="w-16 h-16 rounded-full bg-ink-100 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
            <Plus className="w-8 h-8 text-ink-400 group-hover:text-indigo-500" />
          </div>
          <span className="text-ink-500 group-hover:text-indigo-600 font-medium">创建新小说</span>
        </button>
      </div>

      {showCreateModal && (
        <CreateNovelModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

function NovelCard({ novel, index }: { novel: Novel; index: number }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div 
      className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-ink-200/50 overflow-hidden hover:shadow-lg transition-all group"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="h-32 bg-gradient-to-br from-indigo-500 via-indigo-600 to-vermillion-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 text-xs font-medium bg-white/90 text-ink-900 rounded-md">
            {genreLabels[novel.genre]}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg bg-white/80 hover:bg-white transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-ink-700" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-ink-200 py-1 z-10">
                <button className="w-full px-3 py-2 text-left text-sm text-ink-700 hover:bg-ink-50 flex items-center gap-2">
                  <Edit className="w-4 h-4" /> 编辑
                </button>
                <button className="w-full px-3 py-2 text-left text-sm text-ink-700 hover:bg-ink-50 flex items-center gap-2">
                  <Copy className="w-4 h-4" /> 复制
                </button>
                <button className="w-full px-3 py-2 text-left text-sm text-vermillion-600 hover:bg-vermillion-50 flex items-center gap-2">
                  <Trash2 className="w-4 h-4" /> 删除
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-lg font-serif font-bold text-white drop-shadow-lg line-clamp-1">
            {novel.title}
          </h3>
          {novel.subtitle && (
            <p className="text-sm text-white/80 mt-0.5">{novel.subtitle}</p>
          )}
        </div>
      </div>

      <div className="p-4">
        <p className="text-sm text-ink-600 line-clamp-2 mb-4">{novel.synopsis}</p>
        
        <div className="flex items-center gap-4 text-sm text-ink-500 mb-4">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            <span>{novel.chapterCount}章</span>
          </div>
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" />
            <span>{(novel.wordCount / 10000).toFixed(1)}万字</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>{novel.updatedAt.toLocaleDateString('zh-CN')}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className={clsx(
            'px-2 py-1 text-xs rounded-full',
            novel.status === 'writing' && 'bg-jade-100 text-jade-700',
            novel.status === 'draft' && 'bg-amber-100 text-amber-700',
            novel.status === 'completed' && 'bg-indigo-100 text-indigo-700',
          )}>
            {novel.status === 'writing' && '创作中'}
            {novel.status === 'draft' && '草稿'}
            {novel.status === 'completed' && '已完成'}
          </span>
          
          <Link 
            to={`/novels/${novel.id}`}
            className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
          >
            进入工作台 →
          </Link>
        </div>
      </div>
    </div>
  );
}

function CreateNovelModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('');
  const [genre, setGenre] = useState<NovelGenre>('xianxia');
  const [synopsis, setSynopsis] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('创建小说:', { title, genre, synopsis });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
        <h2 className="text-xl font-serif font-bold text-ink-900 mb-6">创建新小说</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">小说标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入小说标题"
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">小说类型</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value as NovelGenre)}
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-indigo-400 outline-none"
            >
              {Object.entries(genreLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">简介</label>
            <textarea
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              placeholder="请输入小说简介..."
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-ink-200 text-ink-700 rounded-xl hover:bg-ink-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-vermillion-500 text-white rounded-xl hover:bg-vermillion-600 transition-colors"
            >
              创建
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
