import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Sparkles,
  List,
  Clock,
  Users,
  Globe,
  FileText,
  MoreVertical,
  Plus,
  Search,
  AlignLeft,
  AlignCenter,
  Bold,
  Italic,
  MessageSquare
} from 'lucide-react';
import { clsx } from 'clsx';
import { useChaptersStore, useCharactersStore, useWorldStore, useAIWritingStore } from '../store';

export function WritingEditor() {
  const { id: novelId, chapterId } = useParams();
  const loadChapters = useChaptersStore((s) => s.loadChapters);
  const getChapters = useChaptersStore((s) => s.getChapters);
  const addChapter = useChaptersStore((s) => s.addChapter);
  const updateChapter = useChaptersStore((s) => s.updateChapter);
  const loadCharacters = useCharactersStore((s) => s.loadCharacters);
  const getCharacters = useCharactersStore((s) => s.getCharacters);
  const loadWorld = useWorldStore((s) => s.loadWorld);
  const getWorldBuildings = useWorldStore((s) => s.getWorldBuildings);
  const { isGenerating, setIsGenerating, generatedContent, setGeneratedContent } = useAIWritingStore();

  const [showChapterList, setShowChapterList] = useState(true);
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [content, setContent] = useState('');
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [currentChapterId, setCurrentChapterId] = useState<string | null>(null);
  const [showNewChapter, setShowNewChapter] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (novelId) {
      loadChapters(novelId);
      loadCharacters(novelId);
      loadWorld(novelId);
    }
  }, [novelId, loadChapters, loadCharacters, loadWorld]);

  const chapters = novelId ? getChapters(novelId) : [];
  const characters = novelId ? getCharacters(novelId) : [];
  const worldSettings = novelId ? getWorldBuildings(novelId) : [];

  const current = chapters.find(c => c.id === (currentChapterId || chapterId)) || chapters[0] || null;

  useEffect(() => {
    if (current && current.id !== currentChapterId) {
      setCurrentChapterId(current.id);
    }
  }, [current]);

  useEffect(() => {
    if (current) {
      setContent(current.content || '');
    }
  }, [current?.id]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    if (current && novelId) {
      updateChapter(novelId, current.id, {
        content: newContent,
        wordCount: newContent.length,
      });
    }
  };

  const handleAISuggest = async () => {
    setIsGenerating(true);
    setShowAISuggestions(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    setGeneratedContent(`就在这时，一道凌厉的剑气从远处袭来！

"小心！"林风瞳孔一缩，身形暴退，同时抽出腰间的长剑。

剑光交错，金铁交鸣。偷袭之人是一名身穿黑袍的男子，脸上带着诡异的面具。

"你是谁？"林风沉声问道。

黑袍男子没有回答，只是再次发动了攻击。他的剑法狠辣无比，每一招都直取要害。

周围的人群惊呼起来，纷纷后退。苏婉儿脸色苍白，紧紧攥着衣角。

林风且战且退，心中却在飞速思考对策。这个人的实力，至少在金丹后期！

"看来，不能再隐藏了。"林风眼中闪过一丝精光。

他深吸一口气，体内的灵力开始沸腾。古老的功法在经脉中运转，一股前所未有的力量涌上心头。

这是他从未展示过的底牌——来自上古传承的禁忌之术！

"受死吧！"林风低喝一声，手中长剑爆发出耀眼的光芒。

黑袍男子脸色大变，想要躲避却已经来不及了...`);

    setIsGenerating(false);
  };

  const insertAIGeneratedContent = () => {
    if (generatedContent) {
      const newContent = content + '\n\n' + generatedContent;
      handleContentChange(newContent);
      setShowAISuggestions(false);
      setGeneratedContent('');
    }
  };

  const handleAddChapter = () => {
    if (!novelId || !newTitle.trim()) return;
    const chapter = addChapter(novelId, {
      orderIndex: chapters.length + 1,
      title: newTitle.trim(),
      content: '',
      status: 'writing',
    });
    setCurrentChapterId(chapter.id);
    setNewTitle('');
    setShowNewChapter(false);
  };

  if (chapters.length === 0) {
    return (
      <div className="h-[calc(100vh-3rem)] flex items-center justify-center bg-ink-50/50">
        <div className="text-center">
          <FileText className="w-16 h-16 text-ink-300 mx-auto mb-4" />
          <h2 className="text-xl font-serif font-bold text-ink-900 mb-2">暂无章节</h2>
          <p className="text-ink-500 mb-6">请先创建一个章节开始写作</p>
          <button
            onClick={() => setShowNewChapter(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2 mx-auto"
          >
            <Plus className="w-4 h-4" />
            新建章节
          </button>
        </div>

        {showNewChapter && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
              <h3 className="text-lg font-serif font-bold text-ink-900 mb-4">新建章节</h3>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="章节标题"
                className="w-full px-4 py-2 border border-ink-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 outline-none mb-4"
                autoFocus
                onKeyDown={(e) => { if (e.key === 'Enter') handleAddChapter(); }}
              />
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => { setShowNewChapter(false); setNewTitle(''); }}
                  className="px-4 py-2 text-sm text-ink-600 hover:bg-ink-50 rounded-lg"
                >
                  取消
                </button>
                <button
                  onClick={handleAddChapter}
                  disabled={!newTitle.trim()}
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  创建
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-3rem)] flex">
      {showChapterList && (
        <div className="w-72 bg-white border-r border-ink-200 flex flex-col">
          <div className="p-4 border-b border-ink-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
              <input
                type="text"
                placeholder="搜索章节..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-ink-50 border-0 focus:ring-2 focus:ring-indigo-100 outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2">
            {chapters.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => setCurrentChapterId(chapter.id)}
                className={clsx(
                  'w-full p-3 text-left rounded-lg mb-1 transition-all',
                  current?.id === chapter.id
                    ? 'bg-indigo-100 text-indigo-900'
                    : 'hover:bg-ink-50 text-ink-700'
                )}
              >
                <div className="text-sm font-medium truncate">{chapter.title}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-ink-400">{chapter.wordCount}字</span>
                  <span className={clsx(
                    'text-xs px-1.5 py-0.5 rounded',
                    chapter.status === 'published' && 'bg-jade-100 text-jade-700',
                    chapter.status === 'completed' && 'bg-indigo-100 text-indigo-700',
                    chapter.status === 'writing' && 'bg-amber-100 text-amber-700',
                    chapter.status === 'draft' && 'bg-ink-100 text-ink-600',
                    chapter.status === 'revising' && 'bg-amber-100 text-amber-700',
                  )}>
                    {chapter.status === 'published' && '已发布'}
                    {chapter.status === 'completed' && '待发'}
                    {chapter.status === 'writing' && '写作中'}
                    {chapter.status === 'draft' && '草稿'}
                    {chapter.status === 'revising' && '修订中'}
                  </span>
                </div>
              </button>
            ))}
          </div>

          <div className="p-3 border-t border-ink-200">
            <button
              onClick={() => setShowNewChapter(true)}
              className="w-full py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              新建章节
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col bg-ink-50/50">
        <header className="h-14 bg-white border-b border-ink-200 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowChapterList(!showChapterList)}
              className={clsx(
                'p-2 rounded-lg transition-colors',
                showChapterList ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-ink-100'
              )}
            >
              <List className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={current?.title || ''}
              className="text-lg font-serif font-bold bg-transparent border-0 outline-none text-ink-900 w-64"
              readOnly
            />
            <span className="text-sm text-ink-400">
              {content.length} 字
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm text-ink-600 hover:bg-ink-100 rounded-lg flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              自动保存
            </button>
            <button className="px-3 py-1.5 text-sm text-ink-600 hover:bg-ink-100 rounded-lg flex items-center gap-1.5">
              <Save className="w-4 h-4" />
              保存
            </button>
            <button
              onClick={handleAISuggest}
              className="px-3 py-1.5 text-sm bg-vermillion-500 text-white rounded-lg hover:bg-vermillion-600 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              AI续写
            </button>
            <button
              onClick={() => setShowAIPanel(!showAIPanel)}
              className={clsx(
                'p-2 rounded-lg transition-colors',
                showAIPanel ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-ink-100'
              )}
            >
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-ink-200 p-8 min-h-full">
              <div className="mb-6 flex gap-1">
                {[Bold, Italic, AlignLeft, AlignCenter].map((Icon, i) => (
                  <button key={i} className="p-2 hover:bg-ink-100 rounded">
                    <Icon className="w-4 h-4 text-ink-600" />
                  </button>
                ))}
              </div>

              <div
                ref={editorRef}
                contentEditable
                className="min-h-[600px] outline-none font-serif text-lg leading-relaxed text-ink-800"
                onInput={(e) => handleContentChange(e.currentTarget.textContent || '')}
                suppressContentEditableWarning
              >
                {content.split('\n').map((line, i) => (
                  <p key={i} className="mb-4">{line || <br />}</p>
                ))}
              </div>
            </div>
          </div>

          {showAIPanel && (
            <div className="w-80 bg-white border-l border-ink-200 flex flex-col">
              <div className="p-4 border-b border-ink-200">
                <h3 className="font-medium text-ink-900">AI写作助手</h3>
                <p className="text-xs text-ink-500 mt-1">上下文已同步：世界观、人物、记忆</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <span className="text-sm font-medium text-indigo-900">当前场景人物</span>
                  </div>
                  {characters.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {characters.slice(0, 5).map(char => (
                        <span key={char.id} className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded">
                          {char.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-ink-400">暂无角色数据</p>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-jade-50 border border-jade-100">
                  <div className="flex items-center gap-2 mb-2">
                    <Globe className="w-4 h-4 text-jade-600" />
                    <span className="text-sm font-medium text-jade-900">当前世界观</span>
                  </div>
                  {worldSettings.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {worldSettings.slice(0, 4).map(setting => (
                        <span key={setting.id} className="px-2 py-0.5 text-xs bg-jade-100 text-jade-700 rounded">
                          {setting.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-ink-400">暂无世界观数据</p>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-amber-600" />
                    <span className="text-sm font-medium text-amber-900">当前章节</span>
                  </div>
                  <p className="text-xs text-amber-700">
                    {current ? `${current.title} · ${current.wordCount}字` : '未选择章节'}
                  </p>
                </div>

                {showAISuggestions && (
                  <div className="p-4 rounded-xl bg-gradient-to-br from-vermillion-50 to-amber-50 border border-vermillion-100">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-4 h-4 text-vermillion-600" />
                      <span className="text-sm font-medium text-vermillion-900">AI续写建议</span>
                    </div>

                    {isGenerating ? (
                      <div className="space-y-2">
                        <div className="h-3 bg-ink-200 rounded animate-pulse" />
                        <div className="h-3 bg-ink-200 rounded w-4/5 animate-pulse" />
                        <div className="h-3 bg-ink-200 rounded w-3/5 animate-pulse" />
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-ink-700 whitespace-pre-wrap leading-relaxed">
                          {generatedContent}
                        </p>
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={insertAIGeneratedContent}
                            className="flex-1 py-2 text-sm bg-vermillion-500 text-white rounded-lg hover:bg-vermillion-600"
                          >
                            采纳
                          </button>
                          <button
                            onClick={() => setShowAISuggestions(false)}
                            className="flex-1 py-2 text-sm border border-ink-200 text-ink-600 rounded-lg hover:bg-ink-50"
                          >
                            拒绝
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-ink-200">
                <button
                  onClick={handleAISuggest}
                  className="w-full py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
                >
                  继续生成
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showNewChapter && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-lg font-serif font-bold text-ink-900 mb-4">新建章节</h3>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="章节标题"
              className="w-full px-4 py-2 border border-ink-200 rounded-lg focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300 outline-none mb-4"
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddChapter(); }}
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => { setShowNewChapter(false); setNewTitle(''); }}
                className="px-4 py-2 text-sm text-ink-600 hover:bg-ink-50 rounded-lg"
              >
                取消
              </button>
              <button
                onClick={handleAddChapter}
                disabled={!newTitle.trim()}
                className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
