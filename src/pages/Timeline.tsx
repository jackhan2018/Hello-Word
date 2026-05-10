import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Search, Calendar, ChevronLeft, ChevronRight, Clock, Users, BookOpen, Filter, Edit, Trash2, Save, X } from 'lucide-react';
import { clsx } from 'clsx';
import { useTimelineStore, useCharactersStore } from '../store';
import type { TimelineEvent } from '../types';

export function Timeline() {
  const { id: novelId } = useParams();
  const { loadEvents, getEvents, addEvent, updateEvent, deleteEvent } = useTimelineStore();
  const { loadCharacters, getCharacters } = useCharactersStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCharacter, setFilterCharacter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'gantt'>('gantt');
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (novelId) {
      loadEvents(novelId);
      loadCharacters(novelId);
    }
  }, [novelId, loadEvents, loadCharacters]);

  const events = novelId ? getEvents(novelId) : [];
  const characters = novelId ? getCharacters(novelId) : [];
  const characterNames = characters.map(c => c.name);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCharacter = filterCharacter === 'all' || event.characters.includes(filterCharacter);
    return matchesSearch && matchesCharacter;
  });

  const sortedEvents = useMemo(() => {
    return [...filteredEvents].sort((a, b) => a.eventTime.localeCompare(b.eventTime, undefined, { numeric: true }));
  }, [filteredEvents]);

  const timeGroups = useMemo(() => {
    const groups: Record<string, TimelineEvent[]> = {};
    sortedEvents.forEach(event => {
      const timeKey = event.eventTime.match(/^\S+?\d+年/)?.[0] || '其他';
      if (!groups[timeKey]) {
        groups[timeKey] = [];
      }
      groups[timeKey].push(event);
    });
    return groups;
  }, [sortedEvents]);

  const navigateTimeline = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentPosition > 0) {
      setCurrentPosition(currentPosition - 1);
    } else if (direction === 'next' && currentPosition < sortedEvents.length - 1) {
      setCurrentPosition(currentPosition + 1);
    }
  };

  if (!novelId) {
    return (
      <div className="max-w-7xl mx-auto animate-fade-in flex flex-col items-center justify-center py-32">
        <div className="w-16 h-16 rounded-full bg-ink-100 flex items-center justify-center mb-4">
          <Calendar className="w-8 h-8 text-ink-400" />
        </div>
        <h2 className="text-xl font-serif font-bold text-ink-900 mb-2">请先选择小说</h2>
        <p className="text-ink-500">时间线需要关联到具体的小说，请从小说列表进入</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-ink-900">时间线视图</h1>
          <p className="text-ink-600 mt-1">追踪小说剧情发展脉络</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-white/80 rounded-lg p-1">
            <button
              onClick={() => setViewMode('gantt')}
              className={clsx(
                'px-3 py-1.5 text-sm rounded-md transition-all',
                viewMode === 'gantt' ? 'bg-indigo-600 text-white' : 'text-ink-600 hover:bg-ink-100'
              )}
            >
              甘特图
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={clsx(
                'px-3 py-1.5 text-sm rounded-md transition-all',
                viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-ink-600 hover:bg-ink-100'
              )}
            >
              列表
            </button>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-vermillion-500 text-white rounded-lg hover:bg-vermillion-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            添加事件
          </button>
        </div>
      </header>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
          <input
            type="text"
            placeholder="搜索事件..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 border border-ink-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
          <select
            value={filterCharacter}
            onChange={(e) => setFilterCharacter(e.target.value)}
            className="pl-10 pr-8 py-2.5 rounded-xl bg-white/80 border border-ink-200 focus:border-indigo-400 outline-none appearance-none cursor-pointer"
          >
            <option value="all">全部人物</option>
            {characterNames.map(char => (
              <option key={char} value={char}>{char}</option>
            ))}
          </select>
        </div>
      </div>

      {sortedEvents.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-ink-200/50 p-12 flex flex-col items-center justify-center text-center">
          <Calendar className="w-12 h-12 text-ink-300 mb-4" />
          <p className="text-ink-500">暂无事件，点击右上角添加</p>
        </div>
      ) : viewMode === 'gantt' ? (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-ink-200/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <span className="font-medium text-ink-900">剧情时间轴</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateTimeline('prev')}
                className="p-2 hover:bg-ink-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-ink-600" />
              </button>
              <span className="px-4 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                {sortedEvents[currentPosition]?.eventTime || '起点'}
              </span>
              <button
                onClick={() => navigateTimeline('next')}
                className="p-2 hover:bg-ink-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-ink-600" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-400 via-vermillion-400 to-amber-400" />

            <div className="space-y-6 pl-16">
              {sortedEvents.map((event, index) => (
                <div
                  key={event.id}
                  className={clsx(
                    'relative transition-all cursor-pointer',
                    index === currentPosition && 'transform scale-[1.02]'
                  )}
                  onClick={() => setCurrentPosition(index)}
                >
                  <div className={clsx(
                    'absolute -left-[52px] top-1 w-4 h-4 rounded-full border-4 border-white shadow-sm',
                    event.importance === 3 && 'bg-vermillion-500',
                    event.importance === 2 && 'bg-indigo-500',
                    event.importance === 1 && 'bg-jade-500',
                    index === currentPosition && 'ring-4 ring-indigo-200'
                  )} />

                  <div className={clsx(
                    'p-4 rounded-xl transition-all',
                    index === currentPosition
                      ? 'bg-indigo-50 border-2 border-indigo-400 shadow-md'
                      : 'bg-ink-50/50 hover:bg-ink-100/50'
                  )}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-xs font-medium text-indigo-600">{event.eventTime}</span>
                        <h3 className="text-lg font-serif font-bold text-ink-900">{event.title}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={clsx(
                          'px-2 py-0.5 text-xs rounded-full',
                          event.importance === 3 && 'bg-vermillion-100 text-vermillion-700',
                          event.importance === 2 && 'bg-indigo-100 text-indigo-700',
                          event.importance === 1 && 'bg-jade-100 text-jade-700',
                        )}>
                          {event.importance === 3 && '重要'}
                          {event.importance === 2 && '中等'}
                          {event.importance === 1 && '一般'}
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}
                          className="p-1 hover:bg-ink-100 rounded"
                          title="查看详情"
                        >
                          <Edit className="w-3.5 h-3.5 text-ink-400" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-ink-600 mb-3">{event.description}</p>

                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-ink-400" />
                        <span className="text-ink-500">{event.characters.join('、')}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-ink-400" />
                        <span className="text-ink-500">{event.relatedChapters.join('、')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {Object.entries(timeGroups).map(([timeKey, groupEvents]) => (
              <div key={timeKey}>
                <h3 className="text-sm font-medium text-indigo-600 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {timeKey}
                </h3>
                <div className="space-y-3">
                  {groupEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={() => setSelectedEvent(event)}
                      className={clsx(
                        'p-4 bg-white/80 rounded-xl border cursor-pointer transition-all',
                        selectedEvent?.id === event.id
                          ? 'border-indigo-400 shadow-md'
                          : 'border-ink-200/50 hover:border-indigo-300'
                      )}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-ink-900">{event.title}</h4>
                        <span className="text-xs text-ink-400">{event.eventTime}</span>
                      </div>
                      <p className="text-sm text-ink-600 line-clamp-2">{event.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div>
            {selectedEvent && (
              <EventDetail
                event={selectedEvent}
                novelId={novelId}
                onUpdate={updateEvent}
                onDelete={deleteEvent}
                onDeleted={() => setSelectedEvent(null)}
              />
            )}
          </div>
        </div>
      )}

      {showCreateModal && (
        <CreateEventModal
          novelId={novelId}
          characterNames={characterNames}
          onClose={() => setShowCreateModal(false)}
          onCreated={(data) => {
            addEvent(novelId, data);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}

function EventDetail({
  event,
  novelId,
  onUpdate,
  onDelete,
  onDeleted,
}: {
  event: TimelineEvent;
  novelId: string;
  onUpdate: (novelId: string, id: string, updates: Partial<TimelineEvent>) => void;
  onDelete: (novelId: string, id: string) => void;
  onDeleted: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    eventTime: event.eventTime,
    title: event.title,
    description: event.description,
    charactersText: event.characters.join('、'),
    importance: event.importance,
  });

  useEffect(() => {
    setForm({
      eventTime: event.eventTime,
      title: event.title,
      description: event.description,
      charactersText: event.characters.join('、'),
      importance: event.importance,
    });
  }, [event]);

  const handleSave = () => {
    onUpdate(novelId, event.id, {
      eventTime: form.eventTime,
      title: form.title,
      description: form.description,
      characters: form.charactersText.split(/[,、，]/).map(t => t.trim()).filter(Boolean),
      importance: form.importance,
    });
    setEditing(false);
  };

  const handleDelete = () => {
    onDelete(novelId, event.id);
    onDeleted();
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-ink-200/50 p-6 sticky top-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          {editing ? (
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm(f => ({ ...f, title: e.target.value }))}
              className="text-lg font-serif font-bold text-ink-900 border-b border-indigo-300 outline-none bg-transparent w-full"
            />
          ) : (
            <h3 className="text-lg font-serif font-bold text-ink-900">{event.title}</h3>
          )}
          {editing ? (
            <input
              type="text"
              value={form.eventTime}
              onChange={(e) => setForm(f => ({ ...f, eventTime: e.target.value }))}
              className="text-xs font-medium text-indigo-600 border-b border-indigo-200 outline-none bg-transparent mt-1"
            />
          ) : (
            <span className="text-xs font-medium text-indigo-600">{event.eventTime}</span>
          )}
        </div>
        <div className="flex gap-1 ml-2">
          {editing ? (
            <>
              <button onClick={handleSave} className="p-1.5 hover:bg-jade-100 rounded-lg" title="保存">
                <Save className="w-4 h-4 text-jade-600" />
              </button>
              <button onClick={() => setEditing(false)} className="p-1.5 hover:bg-ink-100 rounded-lg" title="取消">
                <X className="w-4 h-4 text-ink-600" />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(true)} className="p-1.5 hover:bg-ink-100 rounded-lg" title="编辑">
                <Edit className="w-4 h-4 text-ink-600" />
              </button>
              <button onClick={handleDelete} className="p-1.5 hover:bg-vermillion-100 rounded-lg" title="删除">
                <Trash2 className="w-4 h-4 text-vermillion-600" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-xs font-medium text-ink-500 mb-1">描述</h4>
        {editing ? (
          <textarea
            value={form.description}
            onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
            rows={3}
            className="w-full text-sm px-3 py-2 border border-ink-200 rounded-xl outline-none focus:border-indigo-400 resize-none"
          />
        ) : (
          <p className="text-sm text-ink-700">{event.description}</p>
        )}
      </div>

      <div className="mb-4">
        <h4 className="text-xs font-medium text-ink-500 mb-1">涉及人物</h4>
        {editing ? (
          <input
            type="text"
            value={form.charactersText}
            onChange={(e) => setForm(f => ({ ...f, charactersText: e.target.value }))}
            placeholder="用顿号分隔人物名"
            className="w-full text-sm px-3 py-2 border border-ink-200 rounded-xl outline-none focus:border-indigo-400"
          />
        ) : (
          <div className="flex flex-wrap gap-1">
            {event.characters.map(char => (
              <span key={char} className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded">
                {char}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="mb-4">
        <h4 className="text-xs font-medium text-ink-500 mb-1">重要性</h4>
        {editing ? (
          <select
            value={form.importance}
            onChange={(e) => setForm(f => ({ ...f, importance: Number(e.target.value) as 1 | 2 | 3 }))}
            className="text-sm px-2 py-1 border border-ink-200 rounded outline-none"
          >
            <option value={3}>重要</option>
            <option value={2}>中等</option>
            <option value={1}>一般</option>
          </select>
        ) : (
          <span className={clsx(
            'px-2 py-0.5 text-xs rounded-full',
            event.importance === 3 && 'bg-vermillion-100 text-vermillion-700',
            event.importance === 2 && 'bg-indigo-100 text-indigo-700',
            event.importance === 1 && 'bg-jade-100 text-jade-700',
          )}>
            {event.importance === 3 && '重要'}
            {event.importance === 2 && '中等'}
            {event.importance === 1 && '一般'}
          </span>
        )}
      </div>

      <div>
        <h4 className="text-xs font-medium text-ink-500 mb-1">相关章节</h4>
        <div className="flex flex-wrap gap-1">
          {event.relatedChapters.map(ch => (
            <span key={ch} className="px-2 py-0.5 text-xs bg-ink-100 text-ink-700 rounded">
              {ch}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function CreateEventModal({
  novelId,
  characterNames,
  onClose,
  onCreated,
}: {
  novelId: string;
  characterNames: string[];
  onClose: () => void;
  onCreated: (data: Omit<TimelineEvent, 'id' | 'novelId' | 'createdAt'>) => void;
}) {
  const [eventTime, setEventTime] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [importance, setImportance] = useState<1 | 2 | 3>(2);

  const toggleCharacter = (name: string) => {
    setSelectedCharacters(prev =>
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !eventTime.trim()) return;
    onCreated({
      eventTime: eventTime.trim(),
      title: title.trim(),
      description: description.trim(),
      characters: selectedCharacters,
      relatedChapters: [],
      importance,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
        <h2 className="text-xl font-serif font-bold text-ink-900 mb-6">创建新事件</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">时间</label>
            <input
              type="text"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
              placeholder="如：修仙历元年春"
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">事件标题</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入事件标题"
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">事件描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="请输入事件描述"
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
            />
          </div>

          {characterNames.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1.5">涉及角色</label>
              <div className="flex flex-wrap gap-2">
                {characterNames.map(name => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => toggleCharacter(name)}
                    className={clsx(
                      'px-3 py-1.5 text-sm rounded-lg border transition-all',
                      selectedCharacters.includes(name)
                        ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                        : 'border-ink-200 text-ink-600 hover:border-indigo-300'
                    )}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">重要性</label>
            <div className="flex gap-2">
              {([1, 2, 3] as const).map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setImportance(level)}
                  className={clsx(
                    'flex-1 py-2 text-sm rounded-lg border transition-all',
                    importance === level
                      ? level === 3 ? 'border-vermillion-400 bg-vermillion-50 text-vermillion-700'
                        : level === 2 ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                        : 'border-jade-400 bg-jade-50 text-jade-700'
                      : 'border-ink-200 text-ink-600 hover:border-indigo-300'
                  )}
                >
                  {level === 3 ? '重要' : level === 2 ? '中等' : '一般'}
                </button>
              ))}
            </div>
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
