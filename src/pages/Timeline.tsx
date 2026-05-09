import { useState, useMemo } from 'react';
import { Plus, Search, Calendar, ChevronLeft, ChevronRight, Clock, Users, BookOpen, Filter } from 'lucide-react';
import { clsx } from 'clsx';
import type { TimelineEvent } from '../types';

const mockEvents: TimelineEvent[] = [
  {
    id: '1',
    novelId: '1',
    eventTime: '修仙历元年春',
    title: '林风出生',
    description: '青石镇普通家庭，父亲林远山，母亲王氏',
    characters: ['林风', '林远山', '王氏'],
    relatedChapters: ['第1章'],
    importance: 3,
    createdAt: new Date(),
  },
  {
    id: '2',
    novelId: '1',
    eventTime: '修仙历十五年夏',
    title: '灵根觉醒',
    description: '林风在山中采药时意外触发上古传承，灵根觉醒',
    characters: ['林风'],
    relatedChapters: ['第5章', '第6章'],
    importance: 3,
    createdAt: new Date(),
  },
  {
    id: '3',
    novelId: '1',
    eventTime: '修仙历十五年秋',
    title: '拜入青云宗',
    description: '玄清真人看中林风天赋，收为亲传弟子',
    characters: ['林风', '玄清真人'],
    relatedChapters: ['第8章', '第9章'],
    importance: 3,
    createdAt: new Date(),
  },
  {
    id: '4',
    novelId: '1',
    eventTime: '修仙历十六年春',
    title: '初遇苏婉儿',
    description: '在宗门大比预选赛中首次遇见苏婉儿',
    characters: ['林风', '苏婉儿'],
    relatedChapters: ['第15章'],
    importance: 2,
    createdAt: new Date(),
  },
  {
    id: '5',
    novelId: '1',
    eventTime: '修仙历十六年夏',
    title: '宗门大比',
    description: '林风在宗门大比中展现惊人实力，引起各方关注',
    characters: ['林风', '苏婉儿', '魔尊重楼'],
    relatedChapters: ['第20章', '第21章', '第22章'],
    importance: 3,
    createdAt: new Date(),
  },
  {
    id: '6',
    novelId: '1',
    eventTime: '修仙历十七年春',
    title: '魔界入侵',
    description: '万魔窟大举进攻，修仙界陷入危机',
    characters: ['林风', '魔尊重楼', '玄清真人'],
    relatedChapters: ['第45章', '第46章'],
    importance: 3,
    createdAt: new Date(),
  },
  {
    id: '7',
    novelId: '1',
    eventTime: '修仙历十八年',
    title: '突破金丹',
    description: '林风闭关三月，成功突破金丹境',
    characters: ['林风'],
    relatedChapters: ['第60章'],
    importance: 2,
    createdAt: new Date(),
  },
  {
    id: '8',
    novelId: '1',
    eventTime: '修仙历二十年',
    title: '正魔大战',
    description: '正道联盟与万魔窟决战，林风担任先锋',
    characters: ['林风', '魔尊重楼', '苏婉儿'],
    relatedChapters: ['第80章', '第81章', '第82章'],
    importance: 3,
    createdAt: new Date(),
  },
];

const mockCharacters = ['林风', '苏婉儿', '玄清真人', '魔尊重楼', '张三'];

export function Timeline() {
  const [events, setEvents] = useState(mockEvents);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCharacter, setFilterCharacter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'gantt'>('gantt');
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [currentPosition, setCurrentPosition] = useState(0);

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
      const timeKey = event.eventTime.match(/^修仙历\d+年/)?.[0] || '其他';
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
          <button className="px-4 py-2 bg-vermillion-500 text-white rounded-lg hover:bg-vermillion-600 transition-colors flex items-center gap-2">
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
            {mockCharacters.map(char => (
              <option key={char} value={char}>{char}</option>
            ))}
          </select>
        </div>
      </div>

      {viewMode === 'gantt' ? (
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
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-ink-200/50 p-6 sticky top-6">
                <span className="text-xs font-medium text-indigo-600">{selectedEvent.eventTime}</span>
                <h3 className="text-lg font-serif font-bold text-ink-900 mt-1 mb-3">{selectedEvent.title}</h3>
                <p className="text-sm text-ink-700 mb-4">{selectedEvent.description}</p>
                
                <div className="mb-4">
                  <h4 className="text-xs font-medium text-ink-500 mb-2">涉及人物</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedEvent.characters.map(char => (
                      <span key={char} className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded">
                        {char}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xs font-medium text-ink-500 mb-2">相关章节</h4>
                  <div className="flex flex-wrap gap-1">
                    {selectedEvent.relatedChapters.map(ch => (
                      <span key={ch} className="px-2 py-0.5 text-xs bg-ink-100 text-ink-700 rounded">
                        {ch}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
