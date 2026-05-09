import { useState } from 'react';
import { Plus, Search, Filter, User, MoreVertical, Edit, Trash2, Heart, Swords, Users, Star, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { useCharactersStore } from '../store';
import type { Character, CharacterRole } from '../types';

const mockCharacters: Character[] = [
  {
    id: '1',
    novelId: '1',
    name: '林风',
    roleType: 'protagonist',
    avatar: '',
    personality: { 
      tags: ['坚韧', '善良', '执着'], 
      fears: ['失去亲人'], 
      desires: ['修仙成神'],
      habits: ['修炼时喜欢打坐']
    },
    appearance: { age: '18岁', height: '175cm', build: '偏瘦但有力', features: ['剑眉星目', '黑发'] },
    background: '青石镇普通少年，父亲早亡，与母亲相依为命。意外获得上古传承后踏上修仙之路。',
    speechStyle: '沉稳有力，关键时刻果断，但平时话不多',
    relationships: [
      { characterId: '2', characterName: '苏婉儿', relationshipType: 'romantic', description: '青梅竹马' },
      { characterId: '3', characterName: '玄清真人', relationshipType: 'mentor', description: '师徒' },
    ],
    arcDescription: '从凡人到真仙的蜕变之路',
    importance: 3,
    createdAt: new Date(),
  },
  {
    id: '2',
    novelId: '1',
    name: '苏婉儿',
    roleType: 'supporting',
    avatar: '',
    personality: { tags: ['温柔', '聪慧', '独立'] },
    appearance: { age: '17岁', height: '165cm', features: ['长发及腰', '瓜子脸'] },
    background: '青云宗掌门之女，自幼聪慧过人',
    speechStyle: '柔和细腻，但内心坚定',
    relationships: [],
    importance: 2,
    createdAt: new Date(),
  },
  {
    id: '3',
    novelId: '1',
    name: '魔尊重楼',
    roleType: 'antagonist',
    avatar: '',
    personality: { tags: ['傲慢', '冷酷', '执着'] },
    appearance: { age: '外表30岁', height: '185cm', features: ['银发', '赤红眼瞳'] },
    background: '魔界至尊，追求极致力量',
    speechStyle: '傲慢霸道',
    relationships: [],
    importance: 3,
    createdAt: new Date(),
  },
  {
    id: '4',
    novelId: '1',
    name: '张三',
    roleType: 'supporting',
    avatar: '',
    personality: { tags: ['憨厚', '忠诚'] },
    appearance: { age: '20岁', height: '180cm' },
    background: '林风的同门师兄',
    speechStyle: '豪爽直接',
    relationships: [],
    importance: 1,
    createdAt: new Date(),
  },
];

const roleLabels: Record<CharacterRole, { label: string; color: string; icon: React.ElementType }> = {
  protagonist: { label: '主角', color: 'vermillion', icon: Star },
  antagonist: { label: '反派', color: 'ink', icon: Swords },
  supporting: { label: '配角', color: 'indigo', icon: User },
  minor: { label: '龙套', color: 'jade', icon: Users },
};

export function Characters() {
  const { characters, addCharacter } = useCharactersStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<CharacterRole | 'all'>('all');
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const displayCharacters = characters.length > 0 ? characters : mockCharacters;

  const filteredCharacters = displayCharacters.filter(char => {
    const matchesSearch = char.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || char.roleType === filterRole;
    return matchesSearch && matchesRole;
  });

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
          {filteredCharacters.map((char, index) => {
            const roleInfo = roleLabels[char.roleType];
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
          })}
        </div>

        <div className="lg:col-span-2">
          {selectedCharacter ? (
            <CharacterDetail character={selectedCharacter} />
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
        <CreateCharacterModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}

function CharacterDetail({ character }: { character: Character }) {
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
            <h2 className="text-2xl font-serif font-bold text-ink-900">{character.name}</h2>
            <span className={clsx(
              'px-2 py-0.5 text-xs rounded mt-1 inline-block',
              roleInfo.color === 'vermillion' && 'bg-vermillion-100 text-vermillion-700',
              roleInfo.color === 'ink' && 'bg-ink-100 text-ink-700',
              roleInfo.color === 'indigo' && 'bg-indigo-100 text-indigo-700',
              roleInfo.color === 'jade' && 'bg-jade-100 text-jade-700',
            )}>
              {roleInfo.label}
            </span>
          </div>
        </div>
        <button className="p-2 hover:bg-ink-100 rounded-lg">
          <Edit className="w-5 h-5 text-ink-600" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-xl bg-ink-50/50">
          <h4 className="text-sm font-medium text-ink-500 mb-2">性格标签</h4>
          <div className="flex flex-wrap gap-1">
            {character.personality.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-700 rounded">
                {tag}
              </span>
            ))}
          </div>
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
        <p className="text-ink-700 leading-relaxed">{character.background}</p>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-medium text-ink-500 mb-2">语言风格</h4>
        <p className="text-ink-700 italic">{character.speechStyle}</p>
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

function CreateCharacterModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [roleType, setRoleType] = useState<CharacterRole>('supporting');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('创建角色:', { name, roleType });
    onClose();
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
              {Object.entries(roleLabels).map(([value, info]) => (
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
                    <info.icon className="w-4 h-4 text-ink-600" />
                    <span className="text-sm font-medium">{info.label}</span>
                  </div>
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
