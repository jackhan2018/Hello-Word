import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Search, Globe, Mountain, Flag, Sparkles, BookOpen, Map, ChevronRight, Folder, FolderOpen, Edit, Trash2, Save, X } from 'lucide-react';
import { clsx } from 'clsx';
import { useWorldStore, categoryInfo } from '../store';
import type { WorldBuilding, WorldCategory } from '../types';

const categoryMeta: Record<WorldCategory, { icon: React.ElementType; description: string }> = {
  geography: { icon: Mountain, description: '山川河流、城市村镇' },
  faction: { icon: Flag, description: '宗门、家族、国家' },
  magic_system: { icon: Sparkles, description: '修炼体系、技能法术' },
  item: { icon: Map, description: '武器、丹药、法宝' },
  technique: { icon: BookOpen, description: '功法、秘籍、传承' },
  culture: { icon: Globe, description: '语言、信仰、节日' },
  history: { icon: Folder, description: '历史事件、神话传说' },
  glossary: { icon: FolderOpen, description: '术语、概念解释' },
};

export function WorldEditor() {
  const { id: novelId } = useParams();
  const { loadWorld, getWorldBuildings, addWorldBuilding, updateWorldBuilding, deleteWorldBuilding } = useWorldStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<WorldCategory | 'all'>('all');
  const [selectedBuilding, setSelectedBuilding] = useState<WorldBuilding | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['geography', 'faction']));

  useEffect(() => {
    if (novelId) loadWorld(novelId);
  }, [novelId, loadWorld]);

  const worldBuildings = novelId ? getWorldBuildings(novelId) : [];

  const filteredBuildings = worldBuildings.filter(building => {
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

  if (!novelId) {
    return (
      <div className="max-w-7xl mx-auto animate-fade-in flex flex-col items-center justify-center py-32">
        <div className="w-16 h-16 rounded-full bg-ink-100 flex items-center justify-center mb-4">
          <Globe className="w-8 h-8 text-ink-400" />
        </div>
        <h2 className="text-xl font-serif font-bold text-ink-900 mb-2">请先选择小说</h2>
        <p className="text-ink-500">世界观设定需要关联到具体的小说，请从小说列表进入</p>
      </div>
    );
  }

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
              ? { label: '全部', color: 'ink' }
              : categoryInfo[category];
            const Icon = category === 'all' ? Globe : categoryMeta[category as WorldCategory].icon;
            const count = category === 'all'
              ? worldBuildings.length
              : worldBuildings.filter(b => b.category === category).length;

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
                <Icon className="w-5 h-5" />
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
                const meta = categoryMeta[category as WorldCategory];
                return (
                  <div key={category}>
                    <button
                      onClick={() => toggleCategory(category)}
                      className="flex items-center gap-3 mb-3 group"
                    >
                      <meta.icon className={clsx(
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
            <BuildingDetail
              building={selectedBuilding}
              novelId={novelId}
              onUpdate={updateWorldBuilding}
              onDelete={deleteWorldBuilding}
              onDeleted={() => setSelectedBuilding(null)}
            />
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-ink-200/50 p-12 flex flex-col items-center justify-center text-center">
              <Globe className="w-12 h-12 text-ink-300 mb-4" />
              <p className="text-ink-500">选择一个设定查看详情</p>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <CreateWorldBuildingModal
          novelId={novelId}
          onClose={() => setShowCreateModal(false)}
          onCreated={(data) => {
            addWorldBuilding(novelId, data);
            setShowCreateModal(false);
          }}
        />
      )}
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
  const meta = categoryMeta[building.category];

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
        <meta.icon className={clsx(
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

function BuildingDetail({
  building,
  novelId,
  onUpdate,
  onDelete,
  onDeleted,
}: {
  building: WorldBuilding;
  novelId: string;
  onUpdate: (novelId: string, id: string, updates: Partial<WorldBuilding>) => void;
  onDelete: (novelId: string, id: string) => void;
  onDeleted: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: building.name,
    category: building.category,
    description: building.description,
    propertiesText: JSON.stringify(building.properties, null, 2),
  });

  useEffect(() => {
    setForm({
      name: building.name,
      category: building.category,
      description: building.description,
      propertiesText: JSON.stringify(building.properties, null, 2),
    });
  }, [building]);

  const handleSave = () => {
    let properties: Record<string, unknown> = {};
    try {
      properties = JSON.parse(form.propertiesText);
    } catch {
      properties = building.properties;
    }
    onUpdate(novelId, building.id, {
      name: form.name,
      category: form.category,
      description: form.description,
      properties,
    });
    setEditing(false);
  };

  const handleDelete = () => {
    onDelete(novelId, building.id);
    onDeleted();
  };

  const info = categoryInfo[building.category];
  const meta = categoryMeta[building.category];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-ink-200/50 p-6 sticky top-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className={clsx(
          'w-12 h-12 rounded-xl flex items-center justify-center',
          info.color === 'jade' && 'bg-jade-100 text-jade-600',
          info.color === 'vermillion' && 'bg-vermillion-100 text-vermillion-600',
          info.color === 'indigo' && 'bg-indigo-100 text-indigo-600',
          info.color === 'amber' && 'bg-amber-100 text-amber-600',
        )}>
          <meta.icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          {editing ? (
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
              className="text-lg font-serif font-bold text-ink-900 border-b border-indigo-300 outline-none bg-transparent w-full"
            />
          ) : (
            <h3 className="text-lg font-serif font-bold text-ink-900">{building.name}</h3>
          )}
          {editing ? (
            <select
              value={form.category}
              onChange={(e) => setForm(f => ({ ...f, category: e.target.value as WorldCategory }))}
              className="text-sm text-ink-500 mt-0.5 border border-ink-200 rounded px-1 py-0.5 outline-none"
            >
              {Object.entries(categoryInfo).map(([value, ci]) => (
                <option key={value} value={value}>{ci.label}</option>
              ))}
            </select>
          ) : (
            <span className="text-sm text-ink-500">{info.label}</span>
          )}
        </div>
        <div className="flex gap-1">
          {editing ? (
            <>
              <button onClick={handleSave} className="p-2 hover:bg-jade-100 rounded-lg" title="保存">
                <Save className="w-4 h-4 text-jade-600" />
              </button>
              <button onClick={() => setEditing(false)} className="p-2 hover:bg-ink-100 rounded-lg" title="取消">
                <X className="w-4 h-4 text-ink-600" />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(true)} className="p-2 hover:bg-ink-100 rounded-lg" title="编辑">
                <Edit className="w-4 h-4 text-ink-600" />
              </button>
              <button onClick={handleDelete} className="p-2 hover:bg-vermillion-100 rounded-lg" title="删除">
                <Trash2 className="w-4 h-4 text-vermillion-600" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-ink-500 mb-2">描述</h4>
        {editing ? (
          <textarea
            value={form.description}
            onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
            rows={3}
            className="w-full text-sm px-3 py-2 border border-ink-200 rounded-xl outline-none focus:border-indigo-400 resize-none"
          />
        ) : (
          <p className="text-ink-700 text-sm leading-relaxed">{building.description}</p>
        )}
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-ink-500 mb-2">属性</h4>
        {editing ? (
          <textarea
            value={form.propertiesText}
            onChange={(e) => setForm(f => ({ ...f, propertiesText: e.target.value }))}
            rows={4}
            className="w-full text-sm px-3 py-2 border border-ink-200 rounded-xl outline-none focus:border-indigo-400 resize-none font-mono"
            placeholder='{"key": "value"}'
          />
        ) : (
          Object.keys(building.properties).length > 0 && (
            <div className="space-y-1">
              {Object.entries(building.properties).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2 text-sm">
                  <span className="text-ink-500">{key}:</span>
                  <span className="text-ink-700 font-medium">
                    {Array.isArray(value) ? value.join(' → ') : String(value)}
                  </span>
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {!editing && (
        <div className="flex gap-2 pt-4 border-t border-ink-200">
          <button onClick={() => setEditing(true)} className="flex-1 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            编辑
          </button>
          <button onClick={handleDelete} className="flex-1 py-2 text-sm border border-ink-200 text-ink-600 rounded-lg hover:bg-ink-50">
            删除
          </button>
        </div>
      )}
    </div>
  );
}

function CreateWorldBuildingModal({
  novelId,
  onClose,
  onCreated,
}: {
  novelId: string;
  onClose: () => void;
  onCreated: (data: Omit<WorldBuilding, 'id' | 'novelId' | 'createdAt'>) => void;
}) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<WorldCategory>('geography');
  const [description, setDescription] = useState('');
  const [propertiesText, setPropertiesText] = useState('{}');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    let properties: Record<string, unknown> = {};
    try {
      properties = JSON.parse(propertiesText);
    } catch {
      properties = {};
    }
    onCreated({
      name: name.trim(),
      category,
      description: description.trim(),
      properties,
      importance: 2,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
        <h2 className="text-xl font-serif font-bold text-ink-900 mb-6">创建新设定</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">设定名称</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入设定名称"
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">分类</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(categoryInfo).map(([value, info]) => {
                const Icon = categoryMeta[value as WorldCategory].icon;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setCategory(value as WorldCategory)}
                    className={clsx(
                      'p-3 rounded-xl border text-left transition-all',
                      category === value
                        ? 'border-indigo-400 bg-indigo-50'
                        : 'border-ink-200 hover:border-indigo-300'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-ink-600" />
                      <span className="text-sm font-medium">{info.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="请输入设定描述"
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">属性</label>
            <textarea
              value={propertiesText}
              onChange={(e) => setPropertiesText(e.target.value)}
              placeholder='{"key": "value"}'
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none resize-none font-mono text-sm"
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
