import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Plus, Search, User, Edit, Trash2, Swords, Users, Star, ChevronRight, Save, X } from 'lucide-react';
import { clsx } from 'clsx';
import { useCharactersStore, roleLabels } from '../store';
import type { Character, CharacterRole } from '../types';

const roleIcons: Record<CharacterRole, React.ElementType> = {
  protagonist: Star,
  antagonist: Swords,
  supporting: User,
  minor: Users,
};

export function Characters() {
  const { id: novelId } = useParams();
  const { loadCharacters, getCharacters, addCharacter, updateCharacter, deleteCharacter } = useCharactersStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<CharacterRole | 'all'>('all');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (novelId) loadCharacters(novelId);
  }, [novelId, loadCharacters]);

  const characters = novelId ? getCharacters(novelId) : [];

  const filteredCharacters = characters.filter(char => {
    const matchesSearch = char.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || char.roleType === filterRole;
    return matchesSearch && matchesRole;
  });

  if (!novelId) {
    return (
      <div className="max-w-7xl mx-auto animate-fade-in flex flex-col items-center justify-center py-32">
        <div className="w-16 h-16 rounded-full bg-ink-100 flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-ink-400" />
        </div>
        <h2 className="text-xl font-serif font-bold text-ink-900 mb-2">请先选择小说</h2>
        <p className="text-ink-500">角色档案需要关联到具体的小说，请从小说列表进入</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-ink-900">角色档案库</h1>
          <p className="text-ink-600 mt-1">管理小说中的所有人物角色</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-vermillion-500 text-white rounded-lg hover:bg-vermillion-600 transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          添加角色
        </button>
      </header>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
          <input
            type="text"
            placeholder="搜索角色名称..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/80 border border-ink-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'protagonist', 'antagonist', 'supporting', 'minor'] as const).map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={clsx(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                filterRole === role
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/80 text-ink-600 hover:bg-ink-100'
              )}
            >
              {role === 'all' ? '全部' : roleLabels[role].label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-3">
          {filteredCharacters.length === 0 ? (
            <div className="p-8 text-center text-ink-400">
              <User className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p>暂无角色，点击右上角添加</p>
            </div>
          ) : (
            filteredCharacters.map((char, index) => {
              const roleInfo = roleLabels[char.roleType];
              const RoleIcon = roleIcons[char.roleType];
              return (
                <button
                  key={char.id}
                  onClick={() => setSelectedCharacter(char)}
                  className={clsx(
                    'w-full p-4 bg-white/80 backdrop-blur-sm rounded-2xl border transition-all text-left',
                    selectedCharacter?.id === char.id
                      ? 'border-indigo-400 shadow-md'
                      : 'border-ink-200/50 hover:border-indigo-300 hover:shadow-sm'
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className={clsx(
                      'w-12 h-12 rounded-xl flex items-center justify-center',
                      char.roleType === 'protagonist' && 'bg-gradient-to-br from-vermillion-400 to-vermillion-600',
                      char.roleType === 'antagonist' && 'bg-gradient-to-br from-ink-600 to-ink-800',
                      char.roleType === 'supporting' && 'bg-gradient-to-br from-indigo-400 to-indigo-600',
                      char.roleType === 'minor' && 'bg-gradient-to-br from-jade-400 to-jade-600'
                    )}>
                      <span className="text-lg font-bold text-white">
                        {char.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-ink-900 truncate">{char.name}</span>
                        <span className={clsx(
                          'px-2 py-0.5 text-xs rounded',
                          roleInfo.color === 'vermillion' && 'bg-vermillion-100 text-vermillion-700',
                          roleInfo.color === 'ink' && 'bg-ink-100 text-ink-700',
                          roleInfo.color === 'indigo' && 'bg-indigo-100 text-indigo-700',
                          roleInfo.color === 'jade' && 'bg-jade-100 text-jade-700',
                        )}>
                          {roleInfo.label}
                        </span>
                      </div>
                      <p className="text-sm text-ink-500 truncate mt-0.5">
                        {char.personality.tags.join('、')}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-ink-400" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div className="lg:col-span-2">
          {selectedCharacter ? (
            <CharacterDetail
              character={selectedCharacter}
              novelId={novelId}
              onUpdate={updateCharacter}
              onDelete={deleteCharacter}
              onDeleted={() => setSelectedCharacter(null)}
            />
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-ink-200/50 p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-ink-100 flex items-center justify-center mb-4">
                <User className="w-8 h-8 text-ink-400" />
              </div>
              <p className="text-ink-500">选择一个角色查看详情</p>
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <CreateCharacterModal
          novelId={novelId}
          onClose={() => setShowCreateModal(false)}
          onCreated={(char) => {
            addCharacter(novelId, char);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}

function CharacterDetail({
  character,
  novelId,
  onUpdate,
  onDelete,
  onDeleted,
}: {
  character: Character;
  novelId: string;
  onUpdate: (novelId: string, id: string, updates: Partial<Character>) => void;
  onDelete: (novelId: string, id: string) => void;
  onDeleted: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: character.name,
    roleType: character.roleType,
    background: character.background,
    speechStyle: character.speechStyle,
    personalityTags: character.personality.tags.join('、'),
  });

  useEffect(() => {
    setForm({
      name: character.name,
      roleType: character.roleType,
      background: character.background,
      speechStyle: character.speechStyle,
      personalityTags: character.personality.tags.join('、'),
    });
  }, [character]);

  const handleSave = () => {
    onUpdate(novelId, character.id, {
      name: form.name,
      roleType: form.roleType,
      background: form.background,
      speechStyle: form.speechStyle,
      personality: { ...character.personality, tags: form.personalityTags.split(/[,、，]/).map(t => t.trim()).filter(Boolean) },
    });
    setEditing(false);
  };

  const handleDelete = () => {
    onDelete(novelId, character.id);
    onDeleted();
  };

  const roleInfo = roleLabels[character.roleType];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-ink-200/50 p-6 animate-fade-in">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className={clsx(
            'w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white',
            character.roleType === 'protagonist' && 'bg-gradient-to-br from-vermillion-400 to-vermillion-600',
            character.roleType === 'antagonist' && 'bg-gradient-to-br from-ink-600 to-ink-800',
            character.roleType === 'supporting' && 'bg-gradient-to-br from-indigo-400 to-indigo-600',
            character.roleType === 'minor' && 'bg-gradient-to-br from-jade-400 to-jade-600'
          )}>
            {character.name.charAt(0)}
          </div>
          <div>
            {editing ? (
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                className="text-2xl font-serif font-bold text-ink-900 border-b border-indigo-300 outline-none bg-transparent"
              />
            ) : (
              <h2 className="text-2xl font-serif font-bold text-ink-900">{character.name}</h2>
            )}
            {editing ? (
              <select
                value={form.roleType}
                onChange={(e) => setForm(f => ({ ...f, roleType: e.target.value as CharacterRole }))}
                className="mt-1 text-xs px-2 py-0.5 rounded border border-ink-200 outline-none"
              >
                {Object.entries(roleLabels).map(([value, info]) => (
                  <option key={value} value={value}>{info.label}</option>
                ))}
              </select>
            ) : (
              <span className={clsx(
                'px-2 py-0.5 text-xs rounded mt-1 inline-block',
                roleInfo.color === 'vermillion' && 'bg-vermillion-100 text-vermillion-700',
                roleInfo.color === 'ink' && 'bg-ink-100 text-ink-700',
                roleInfo.color === 'indigo' && 'bg-indigo-100 text-indigo-700',
                roleInfo.color === 'jade' && 'bg-jade-100 text-jade-700',
              )}>
                {roleInfo.label}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {editing ? (
            <>
              <button onClick={handleSave} className="p-2 hover:bg-jade-100 rounded-lg" title="保存">
                <Save className="w-5 h-5 text-jade-600" />
              </button>
              <button onClick={() => setEditing(false)} className="p-2 hover:bg-ink-100 rounded-lg" title="取消">
                <X className="w-5 h-5 text-ink-600" />
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setEditing(true)} className="p-2 hover:bg-ink-100 rounded-lg" title="编辑">
                <Edit className="w-5 h-5 text-ink-600" />
              </button>
              <button onClick={handleDelete} className="p-2 hover:bg-vermillion-100 rounded-lg" title="删除">
                <Trash2 className="w-5 h-5 text-vermillion-600" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-ink-50/50">
          <h4 className="text-sm font-medium text-ink-500 mb-2">性格标签</h4>
          {editing ? (
            <input
              type="text"
              value={form.personalityTags}
              onChange={(e) => setForm(f => ({ ...f, personalityTags: e.target.value }))}
              placeholder="用顿号分隔，如：坚韧、善良、执着"
              className="w-full text-sm px-2 py-1 border border-ink-200 rounded outline-none focus:border-indigo-400"
            />
          ) : (
            <div className="flex flex-wrap gap-1">
              {character.personality.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="p-4 rounded-xl bg-ink-50/50">
          <h4 className="text-sm font-medium text-ink-500 mb-2">外貌特征</h4>
          <p className="text-sm text-ink-700">
            {character.appearance.age} · {character.appearance.height}
            {character.appearance.features?.map(f => ` · ${f}`)}
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-ink-500 mb-2">角色背景</h4>
        {editing ? (
          <textarea
            value={form.background}
            onChange={(e) => setForm(f => ({ ...f, background: e.target.value }))}
            rows={3}
            className="w-full text-sm px-3 py-2 border border-ink-200 rounded-xl outline-none focus:border-indigo-400 resize-none"
          />
        ) : (
          <p className="text-ink-700 leading-relaxed">{character.background}</p>
        )}
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-ink-500 mb-2">语言风格</h4>
        {editing ? (
          <input
            type="text"
            value={form.speechStyle}
            onChange={(e) => setForm(f => ({ ...f, speechStyle: e.target.value }))}
            className="w-full text-sm px-3 py-2 border border-ink-200 rounded-xl outline-none focus:border-indigo-400"
          />
        ) : (
          <p className="text-ink-700 italic">{character.speechStyle}</p>
        )}
      </div>

      {character.relationships.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-ink-500 mb-3">人物关系</h4>
          <div className="space-y-2">
            {character.relationships.map((rel) => (
              <div key={rel.characterId} className="p-3 rounded-xl bg-gradient-to-r from-indigo-50 to-transparent border border-indigo-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-indigo-900">{rel.characterName}</span>
                    <span className="text-xs text-indigo-500">
                      {rel.relationshipType === 'romantic' && '恋人'}
                      {rel.relationshipType === 'mentor' && '师徒'}
                      {rel.relationshipType === 'friend' && '朋友'}
                      {rel.relationshipType === 'enemy' && '敌人'}
                      {rel.relationshipType === 'family' && '家人'}
                      {rel.relationshipType === 'rival' && '对手'}
                      {rel.relationshipType === 'colleague' && '同门'}
                    </span>
                  </div>
                  {rel.description && (
                    <span className="text-sm text-indigo-600">{rel.description}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CreateCharacterModal({
  novelId,
  onClose,
  onCreated,
}: {
  novelId: string;
  onClose: () => void;
  onCreated: (data: Omit<Character, 'id' | 'novelId' | 'createdAt'>) => void;
}) {
  const [name, setName] = useState('');
  const [roleType, setRoleType] = useState<CharacterRole>('supporting');
  const [personalityTags, setPersonalityTags] = useState('');
  const [background, setBackground] = useState('');
  const [speechStyle, setSpeechStyle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreated({
      name: name.trim(),
      roleType,
      personality: { tags: personalityTags.split(/[,、，]/).map(t => t.trim()).filter(Boolean) },
      appearance: {},
      background: background.trim(),
      speechStyle: speechStyle.trim(),
      relationships: [],
      importance: roleType === 'protagonist' || roleType === 'antagonist' ? 3 : roleType === 'supporting' ? 2 : 1,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl">
        <h2 className="text-xl font-serif font-bold text-ink-900 mb-6">创建新角色</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">角色名称</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入角色名称"
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">角色定位</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(roleLabels).map(([value, info]) => {
                const Icon = roleIcons[value as CharacterRole];
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRoleType(value as CharacterRole)}
                    className={clsx(
                      'p-3 rounded-xl border text-left transition-all',
                      roleType === value
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
            <label className="block text-sm font-medium text-ink-700 mb-1.5">性格标签</label>
            <input
              type="text"
              value={personalityTags}
              onChange={(e) => setPersonalityTags(e.target.value)}
              placeholder="用顿号分隔，如：坚韧、善良、执着"
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">角色背景</label>
            <textarea
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              placeholder="请输入角色背景故事"
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">语言风格</label>
            <input
              type="text"
              value={speechStyle}
              onChange={(e) => setSpeechStyle(e.target.value)}
              placeholder="请描述角色的语言风格"
              className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none"
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
