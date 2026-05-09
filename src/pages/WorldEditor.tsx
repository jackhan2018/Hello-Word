import { useState } from 'react';
import { Plus, Search, Filter, Globe, Mountain, Flag, Sparkles, BookOpen, Map, ChevronRight, Folder, FolderOpen } from 'lucide-react';
import { clsx } from 'clsx';
import type { WorldBuilding, WorldCategory } from '../types';

const mockWorldBuildings: WorldBuilding[] = [
  {
    id: '1',
    novelId: '1',
    category: 'geography',
    name: '青云山脉',
    properties: { type: '山脉', altitude: '3000-5000米', climate: '四季如春' },
    description: '青云宗所在之地，山脉连绵，云雾缭绕灵气充沛',
    importance: 3,
    createdAt: new Date(),
  },
  {
    id: '2',
    novelId: '1',
    category: 'geography',
    name: '青石镇',
    properties: { type: '小镇', population: '约2000人' },
    description: '林风的故乡，平凡而宁静的小镇',
    importance: 2,
    createdAt: new Date(),
  },
  {
    id: '3',
    novelId: '1',
    category: 'faction',
    name: '青云宗',
    properties: { level: '一流宗门', leader: '苏青云', members: '约500人' },
    description: '修仙界顶级宗门之一，主修剑道',
    importance: 3,
    createdAt: new Date(),
  },
  {
    id: '4',
    novelId: '1',
    category: 'faction',
    name: '万魔窟',
    properties: { level: '魔道魁首', leader: '重楼' },
    description: '魔界大势力，与正道为敌',
    importance: 3,
    createdAt: new Date(),
  },
  {
    id: '5',
    novelId: '1',
    category: 'magic_system',
    name: '灵气修炼体系',
    properties: { 
      levels: ['练气', '筑基', '金丹', '元婴', '化神', '渡劫', '大乘', '真仙'],
      source: '吸收天地灵气'
    },
    description: '主流修炼体系，通过吸收灵气提升修为',
    importance: 3,
    createdAt: new Date(),
  },
  {
    id: '6',
    novelId: '1',
    category: 'magic_system',
    name: '剑道',
    properties: { type: '战斗技法', difficulty: '极高' },
    description: '以剑为媒介的战斗技法，威力强大',
    importance: 2,
    createdAt: new Date(),
  },
  {
    id: '7',
    novelId: '1',
    category: 'item',
    name: '青云剑',
    properties: { grade: '上品灵器', material: '玄铁精英' },
    description: '青云宗传承之剑，锋利无比',
    importance: 3,
    createdAt: new Date(),
  },
  {
    id: '8',
    novelId: '1',
    category: 'glossary',
    name: '灵根',
    properties: { types: ['金木水火土', '风雷冰'] },
    description: '修仙资质决定修炼速度',
    importance: 3,
    createdAt: new Date(),
  },
];

const categoryInfo: Record<WorldCategory, { label: string; icon: React.ElementType; color: string; description: string }> = {
  geography: { label: '地理', icon: Mountain, color: 'jade', description: '山川河流、城市村镇' },
  faction: { label: '势力', icon: Flag, color: 'vermillion', description: '宗门、家族、国家' },
  magic_system: { label: '力量体系', icon: Sparkles, color: 'indigo', description: '修炼体系、技能法术' },
  item: { label: '物品法宝', icon: Map, color: 'amber', description: '武器、丹药、法宝' },
  technique: { label: '功法秘术', icon: BookOpen, color: 'purple', description: '功法、秘籍、传承' },
  culture: { label: '文化习俗', icon: Globe, color: 'pink', description: '语言、信仰、节日' },
  history: { label: '历史传说', icon: Folder, color: 'slate', description: '历史事件、神话传说' },
  glossary: { label: '专有名词', icon: FolderOpen, color: 'zinc', description: '术语、概念解释' },
};

export function WorldEditor() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<WorldCategory | 'all'>('all');
  const [selectedBuilding, setSelectedBuilding] = useState<WorldBuilding | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['geography', 'faction']));

  const filteredBuildings = mockWorldBuildings.filter(building => {
    const matchesSearch = building.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          building.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || building.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedBuildings = filteredBuildings.reduce((acc, building) => {
    if (!acc[building.category]) {
      acc[building.category] = [];
    }
    acc[building.category].push(building);
    return acc;
  }, {} as Record<string, WorldBuilding[]>);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-ink-900">世界观编辑器</h1>
          <p className="text-ink-600 mt-1">构建完整的小说世界观设定</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-vermillion-500 text-white rounded-lg hover:bg-vermillion-600 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          添加设定
        </button>
      </header>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
          <input
            type="text"
            placeholder="搜索设定..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 border border-ink-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          />
        </div>
      </div>

      <div className="flex gap-6">
        <div className="w-80 space-y-3">
          {(['all', ...Object.keys(categoryInfo)] as const).map((category) => {
            const info = category === 'all' 
              ? { label: '全部', icon: Globe, color: 'ink' } 
              : categoryInfo[category];
            const count = category === 'all' 
              ? mockWorldBuildings.length 
              : mockWorldBuildings.filter(b => b.category === category).length;
            
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category as WorldCategory | 'all')}
                className={clsx(
                  'w-full p-3 rounded-xl flex items-center gap-3 transition-all',
                  activeCategory === category
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                    : 'bg-white/80 hover:bg-ink-50 text-ink-700'
                )}
              >
                <info.icon className="w-5 h-5" />
                <span className="flex-1 text-left text-sm font-medium">{info.label}</span>
                <span className={clsx(
                  'px-2 py-0.5 text-xs rounded-full',
                  activeCategory === category ? 'bg-white/20' : 'bg-ink-100'
                )}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex-1">
          {activeCategory === 'all' ? (
            <div className="space-y-6">
              {Object.entries(groupedBuildings).map(([category, buildings]) => {
                const info = categoryInfo[category as WorldCategory];
                return (
                  <div key={category}>
                    <button
                      onClick={() => toggleCategory(category)}
                      className="flex items-center gap-3 mb-3 group"
                    >
                      <info.icon className={clsx(
                        'w-5 h-5',
                        info.color === 'jade' && 'text-jade-600',
                        info.color === 'vermillion' && 'text-vermillion-600',
                        info.color === 'indigo' && 'text-indigo-600',
                        info.color === 'amber' && 'text-amber-600',
                      )} />
                      <h3 className="text-lg font-serif font-bold text-ink-900">{info.label}</h3>
                      <ChevronRight className={clsx(
                        'w-4 h-4 text-ink-400 transition-transform',
                        expandedCategories.has(category) && 'rotate-90'
                      )} />
                    </button>
                    
                    {expandedCategories.has(category) && (
                      <div className="grid grid-cols-2 gap-3 animate-fade-in">
                        {(buildings as WorldBuilding[]).map((building) => (
                          <BuildingCard 
                            key={building.id} 
                            building={building}
                            isSelected={selectedBuilding?.id === building.id}
                            onClick={() => setSelectedBuilding(building)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredBuildings.map((building) => (
                <BuildingCard 
                  key={building.id} 
                  building={building}
                  isSelected={selectedBuilding?.id === building.id}
                  onClick={() => setSelectedBuilding(building)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="w-96">
          {selectedBuilding ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-ink-200/50 p-6 sticky top-6 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className={clsx(
                  'w-12 h-12 rounded-xl flex items-center justify-center',
                  categoryInfo[selectedBuilding.category].color === 'jade' && 'bg-jade-100 text-jade-600',
                  categoryInfo[selectedBuilding.category].color === 'vermillion' && 'bg-vermillion-100 text-vermillion-600',
                  categoryInfo[selectedBuilding.category].color === 'indigo' && 'bg-indigo-100 text-indigo-600',
                  categoryInfo[selectedBuilding.category].color === 'amber' && 'bg-amber-100 text-amber-600',
                )}>
                  {(() => {
                    const Icon = categoryInfo[selectedBuilding.category].icon;
                    return <Icon className="w-6 h-6" />;
                  })()}
                </div>
                <div>
                  <h3 className="text-lg font-serif font-bold text-ink-900">{selectedBuilding.name}</h3>
                  <span className="text-sm text-ink-500">
                    {categoryInfo[selectedBuilding.category].label}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-ink-500 mb-2">描述</h4>
                <p className="text-ink-700 text-sm leading-relaxed">{selectedBuilding.description}</p>
              </div>

              {Object.keys(selectedBuilding.properties).length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-ink-500 mb-2">属性</h4>
                  <div className="space-y-1">
                    {Object.entries(selectedBuilding.properties).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2 text-sm">
                        <span className="text-ink-500">{key}:</span>
                        <span className="text-ink-700 font-medium">
                          {Array.isArray(value) ? value.join(' → ') : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-ink-200">
                <button className="flex-1 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  编辑
                </button>
                <button className="flex-1 py-2 text-sm border border-ink-200 text-ink-600 rounded-lg hover:bg-ink-50">
                  删除
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-ink-200/50 p-12 flex flex-col items-center justify-center text-center">
              <Globe className="w-12 h-12 text-ink-300 mb-4" />
              <p className="text-ink-500">选择一个设定查看详情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function BuildingCard({ 
  building, 
  isSelected, 
  onClick 
}: { 
  building: WorldBuilding; 
  isSelected: boolean;
  onClick: () => void;
}) {
  const info = categoryInfo[building.category];
  
  return (
    <button
      onClick={onClick}
      className={clsx(
        'p-4 rounded-xl text-left transition-all',
        isSelected
          ? 'bg-indigo-50 border-2 border-indigo-400 shadow-md'
          : 'bg-white/80 border border-ink-200/50 hover:border-indigo-300 hover:shadow-sm'
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <info.icon className={clsx(
          'w-4 h-4',
          info.color === 'jade' && 'text-jade-600',
          info.color === 'vermillion' && 'text-vermillion-600',
          info.color === 'indigo' && 'text-indigo-600',
          info.color === 'amber' && 'text-amber-600',
        )} />
        <span className="font-medium text-ink-900 truncate">{building.name}</span>
      </div>
      <p className="text-sm text-ink-500 line-clamp-2">{building.description}</p>
      {Object.keys(building.properties).length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {Object.values(building.properties).slice(0, 2).map((val, i) => (
            <span key={i} className="px-2 py-0.5 text-xs bg-ink-100 text-ink-600 rounded">
              {Array.isArray(val) ? val[0] : String(val).slice(0, 10)}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}
