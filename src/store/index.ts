import { create } from 'zustand';

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw, (_key, value) => {
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
        return new Date(value);
      }
      return value;
    });
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch { /* ignore */ }
}

export { generateId };

import type {
  User, Novel, Chapter, Character, WorldBuilding, TimelineEvent,
  AIContext, PublishConfig, PublishSchedule, Platform, NovelGenre,
  CharacterRole, WorldCategory, ChapterStatus, NovelStatus
} from '../types';

export const genreLabels: Record<NovelGenre, string> = {
  xianxia: '仙侠', youth: '都市青春', urban: '都市', historical: '历史',
  game: '游戏', science: '科幻', psychological: '心理', horror: '悬疑',
  martial_arts: '武侠', other: '其他',
};

export const platformInfo: Record<Platform, { name: string; color: string }> = {
  fanqie: { name: '番茄小说', color: 'vermillion' },
  qimao: { name: '七猫小说', color: 'jade' },
  qidian: { name: '起点中文', color: 'indigo' },
  wechat: { name: '微信公众号', color: 'jade' },
  kuaibao: { name: '快手小说', color: 'amber' },
};

export const roleLabels: Record<CharacterRole, { label: string; color: string }> = {
  protagonist: { label: '主角', color: 'vermillion' },
  antagonist: { label: '反派', color: 'ink' },
  supporting: { label: '配角', color: 'indigo' },
  minor: { label: '龙套', color: 'jade' },
};

export const categoryInfo: Record<WorldCategory, { label: string; color: string }> = {
  geography: { label: '地理', color: 'jade' },
  faction: { label: '势力', color: 'vermillion' },
  magic_system: { label: '力量体系', color: 'indigo' },
  item: { label: '物品法宝', color: 'amber' },
  technique: { label: '功法秘术', color: 'indigo' },
  culture: { label: '文化习俗', color: 'jade' },
  history: { label: '历史传说', color: 'amber' },
  glossary: { label: '专有名词', color: 'jade' },
};

export const statusLabels: Record<NovelStatus, string> = {
  draft: '草稿', writing: '创作中', completed: '已完成', suspended: '已暂停',
};

export const chapterStatusLabels: Record<ChapterStatus, string> = {
  draft: '草稿', revising: '修订中', completed: '已完成', published: '已发布', writing: '写作中',
};

interface AppState {
  user: User;
  setUser: (user: User) => void;
  activeNovelId: string | null;
  setActiveNovelId: (id: string | null) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const defaultUser: User = {
  id: '1',
  email: 'author@example.com',
  name: '墨韵作者',
  role: 'author',
  createdAt: new Date(),
};

export const useAppStore = create<AppState>((set) => ({
  user: loadFromStorage<User>('moyu_user', defaultUser),
  setUser: (user) => { saveToStorage('moyu_user', user); set({ user }); },
  activeNovelId: null,
  setActiveNovelId: (id) => set({ activeNovelId: id }),
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  theme: loadFromStorage<'light' | 'dark'>('moyu_theme', 'light'),
  setTheme: (theme) => { saveToStorage('moyu_theme', theme); set({ theme }); },
}));

interface NovelsState {
  novels: Novel[];
  addNovel: (data: Omit<Novel, 'id' | 'wordCount' | 'chapterCount' | 'createdAt' | 'updatedAt'>) => Novel;
  updateNovel: (id: string, updates: Partial<Novel>) => void;
  deleteNovel: (id: string) => void;
  getNovel: (id: string) => Novel | undefined;
}

export const useNovelsStore = create<NovelsState>((set, get) => ({
  novels: loadFromStorage<Novel[]>('moyu_novels', []),
  addNovel: (data) => {
    const novel: Novel = {
      ...data,
      id: generateId(),
      wordCount: 0,
      chapterCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((s) => {
      const novels = [...s.novels, novel];
      saveToStorage('moyu_novels', novels);
      return { novels };
    });
    return novel;
  },
  updateNovel: (id, updates) => set((s) => {
    const novels = s.novels.map((n) => n.id === id ? { ...n, ...updates, updatedAt: new Date() } : n);
    saveToStorage('moyu_novels', novels);
    return { novels };
  }),
  deleteNovel: (id) => set((s) => {
    const novels = s.novels.filter((n) => n.id !== id);
    saveToStorage('moyu_novels', novels);
    localStorage.removeItem(`moyu_chapters_${id}`);
    localStorage.removeItem(`moyu_characters_${id}`);
    localStorage.removeItem(`moyu_world_${id}`);
    localStorage.removeItem(`moyu_timeline_${id}`);
    localStorage.removeItem(`moyu_publish_${id}`);
    return { novels };
  }),
  getNovel: (id) => get().novels.find((n) => n.id === id),
}));

interface ChaptersState {
  chaptersByNovel: Record<string, Chapter[]>;
  loadChapters: (novelId: string) => void;
  addChapter: (novelId: string, data: Omit<Chapter, 'id' | 'novelId' | 'wordCount' | 'createdAt' | 'updatedAt'>) => Chapter;
  updateChapter: (novelId: string, id: string, updates: Partial<Chapter>) => void;
  deleteChapter: (novelId: string, id: string) => void;
  getChapters: (novelId: string) => Chapter[];
}

export const useChaptersStore = create<ChaptersState>((set, get) => ({
  chaptersByNovel: {},
  loadChapters: (novelId) => {
    const chapters = loadFromStorage<Chapter[]>(`moyu_chapters_${novelId}`, []);
    set((s) => ({
      chaptersByNovel: { ...s.chaptersByNovel, [novelId]: chapters },
    }));
  },
  addChapter: (novelId, data) => {
    const chapters = get().getChapters(novelId);
    const chapter: Chapter = {
      ...data,
      id: generateId(),
      novelId,
      wordCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const updated = [...chapters, chapter];
    saveToStorage(`moyu_chapters_${novelId}`, updated);
    set((s) => ({ chaptersByNovel: { ...s.chaptersByNovel, [novelId]: updated } }));
    const novelStore = useNovelsStore.getState();
    novelStore.updateNovel(novelId, { chapterCount: updated.length });
    return chapter;
  },
  updateChapter: (novelId, id, updates) => {
    const chapters = get().getChapters(novelId);
    const updated = chapters.map((c) => c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c);
    saveToStorage(`moyu_chapters_${novelId}`, updated);
    set((s) => ({ chaptersByNovel: { ...s.chaptersByNovel, [novelId]: updated } }));
    const totalWords = updated.reduce((sum, c) => sum + c.wordCount, 0);
    useNovelsStore.getState().updateNovel(novelId, { wordCount: totalWords });
  },
  deleteChapter: (novelId, id) => {
    const chapters = get().getChapters(novelId);
    const updated = chapters.filter((c) => c.id !== id);
    saveToStorage(`moyu_chapters_${novelId}`, updated);
    set((s) => ({ chaptersByNovel: { ...s.chaptersByNovel, [novelId]: updated } }));
    useNovelsStore.getState().updateNovel(novelId, { chapterCount: updated.length });
  },
  getChapters: (novelId) => get().chaptersByNovel[novelId] || [],
}));

interface CharactersState {
  charactersByNovel: Record<string, Character[]>;
  loadCharacters: (novelId: string) => void;
  addCharacter: (novelId: string, data: Omit<Character, 'id' | 'novelId' | 'createdAt'>) => Character;
  updateCharacter: (novelId: string, id: string, updates: Partial<Character>) => void;
  deleteCharacter: (novelId: string, id: string) => void;
  getCharacters: (novelId: string) => Character[];
}

export const useCharactersStore = create<CharactersState>((set, get) => ({
  charactersByNovel: {},
  loadCharacters: (novelId) => {
    const characters = loadFromStorage<Character[]>(`moyu_characters_${novelId}`, []);
    set((s) => ({ charactersByNovel: { ...s.charactersByNovel, [novelId]: characters } }));
  },
  addCharacter: (novelId, data) => {
    const characters = get().getCharacters(novelId);
    const character: Character = { ...data, id: generateId(), novelId, createdAt: new Date() };
    const updated = [...characters, character];
    saveToStorage(`moyu_characters_${novelId}`, updated);
    set((s) => ({ charactersByNovel: { ...s.charactersByNovel, [novelId]: updated } }));
    return character;
  },
  updateCharacter: (novelId, id, updates) => {
    const characters = get().getCharacters(novelId);
    const updated = characters.map((c) => c.id === id ? { ...c, ...updates } : c);
    saveToStorage(`moyu_characters_${novelId}`, updated);
    set((s) => ({ charactersByNovel: { ...s.charactersByNovel, [novelId]: updated } }));
  },
  deleteCharacter: (novelId, id) => {
    const characters = get().getCharacters(novelId);
    const updated = characters.filter((c) => c.id !== id);
    saveToStorage(`moyu_characters_${novelId}`, updated);
    set((s) => ({ charactersByNovel: { ...s.charactersByNovel, [novelId]: updated } }));
  },
  getCharacters: (novelId) => get().charactersByNovel[novelId] || [],
}));

interface WorldState {
  worldByNovel: Record<string, WorldBuilding[]>;
  loadWorld: (novelId: string) => void;
  addWorldBuilding: (novelId: string, data: Omit<WorldBuilding, 'id' | 'novelId' | 'createdAt'>) => WorldBuilding;
  updateWorldBuilding: (novelId: string, id: string, updates: Partial<WorldBuilding>) => void;
  deleteWorldBuilding: (novelId: string, id: string) => void;
  getWorldBuildings: (novelId: string) => WorldBuilding[];
}

export const useWorldStore = create<WorldState>((set, get) => ({
  worldByNovel: {},
  loadWorld: (novelId) => {
    const buildings = loadFromStorage<WorldBuilding[]>(`moyu_world_${novelId}`, []);
    set((s) => ({ worldByNovel: { ...s.worldByNovel, [novelId]: buildings } }));
  },
  addWorldBuilding: (novelId, data) => {
    const buildings = get().getWorldBuildings(novelId);
    const building: WorldBuilding = { ...data, id: generateId(), novelId, createdAt: new Date() };
    const updated = [...buildings, building];
    saveToStorage(`moyu_world_${novelId}`, updated);
    set((s) => ({ worldByNovel: { ...s.worldByNovel, [novelId]: updated } }));
    return building;
  },
  updateWorldBuilding: (novelId, id, updates) => {
    const buildings = get().getWorldBuildings(novelId);
    const updated = buildings.map((w) => w.id === id ? { ...w, ...updates } : w);
    saveToStorage(`moyu_world_${novelId}`, updated);
    set((s) => ({ worldByNovel: { ...s.worldByNovel, [novelId]: updated } }));
  },
  deleteWorldBuilding: (novelId, id) => {
    const buildings = get().getWorldBuildings(novelId);
    const updated = buildings.filter((w) => w.id !== id);
    saveToStorage(`moyu_world_${novelId}`, updated);
    set((s) => ({ worldByNovel: { ...s.worldByNovel, [novelId]: updated } }));
  },
  getWorldBuildings: (novelId) => get().worldByNovel[novelId] || [],
}));

interface TimelineState {
  eventsByNovel: Record<string, TimelineEvent[]>;
  loadEvents: (novelId: string) => void;
  addEvent: (novelId: string, data: Omit<TimelineEvent, 'id' | 'novelId' | 'createdAt'>) => TimelineEvent;
  updateEvent: (novelId: string, id: string, updates: Partial<TimelineEvent>) => void;
  deleteEvent: (novelId: string, id: string) => void;
  getEvents: (novelId: string) => TimelineEvent[];
}

export const useTimelineStore = create<TimelineState>((set, get) => ({
  eventsByNovel: {},
  loadEvents: (novelId) => {
    const events = loadFromStorage<TimelineEvent[]>(`moyu_timeline_${novelId}`, []);
    set((s) => ({ eventsByNovel: { ...s.eventsByNovel, [novelId]: events } }));
  },
  addEvent: (novelId, data) => {
    const events = get().getEvents(novelId);
    const event: TimelineEvent = { ...data, id: generateId(), novelId, createdAt: new Date() };
    const updated = [...events, event];
    saveToStorage(`moyu_timeline_${novelId}`, updated);
    set((s) => ({ eventsByNovel: { ...s.eventsByNovel, [novelId]: updated } }));
    return event;
  },
  updateEvent: (novelId, id, updates) => {
    const events = get().getEvents(novelId);
    const updated = events.map((e) => e.id === id ? { ...e, ...updates } : e);
    saveToStorage(`moyu_timeline_${novelId}`, updated);
    set((s) => ({ eventsByNovel: { ...s.eventsByNovel, [novelId]: updated } }));
  },
  deleteEvent: (novelId, id) => {
    const events = get().getEvents(novelId);
    const updated = events.filter((e) => e.id !== id);
    saveToStorage(`moyu_timeline_${novelId}`, updated);
    set((s) => ({ eventsByNovel: { ...s.eventsByNovel, [novelId]: updated } }));
  },
  getEvents: (novelId) => get().eventsByNovel[novelId] || [],
}));

interface PublishState {
  configsByNovel: Record<string, PublishConfig[]>;
  schedulesByNovel: Record<string, PublishSchedule[]>;
  loadPublish: (novelId: string) => void;
  addConfig: (novelId: string, config: Omit<PublishConfig, 'id' | 'novelId'>) => void;
  updateConfig: (novelId: string, id: string, updates: Partial<PublishConfig>) => void;
  removeConfig: (novelId: string, id: string) => void;
  addSchedule: (novelId: string, schedule: Omit<PublishSchedule, 'id' | 'novelId' | 'createdAt'>) => void;
  updateSchedule: (novelId: string, id: string, updates: Partial<PublishSchedule>) => void;
  getConfigs: (novelId: string) => PublishConfig[];
  getSchedules: (novelId: string) => PublishSchedule[];
}

export const usePublishStore = create<PublishState>((set, get) => ({
  configsByNovel: {},
  schedulesByNovel: {},
  loadPublish: (novelId) => {
    const configs = loadFromStorage<PublishConfig[]>(`moyu_publish_${novelId}`, []);
    const schedules = loadFromStorage<PublishSchedule[]>(`moyu_schedules_${novelId}`, []);
    set((s) => ({
      configsByNovel: { ...s.configsByNovel, [novelId]: configs },
      schedulesByNovel: { ...s.schedulesByNovel, [novelId]: schedules },
    }));
  },
  addConfig: (novelId, data) => {
    const configs = get().getConfigs(novelId);
    const config: PublishConfig = { ...data, id: generateId(), novelId };
    const updated = [...configs, config];
    saveToStorage(`moyu_publish_${novelId}`, updated);
    set((s) => ({ configsByNovel: { ...s.configsByNovel, [novelId]: updated } }));
  },
  updateConfig: (novelId, id, updates) => {
    const configs = get().getConfigs(novelId);
    const updated = configs.map((c) => c.id === id ? { ...c, ...updates } : c);
    saveToStorage(`moyu_publish_${novelId}`, updated);
    set((s) => ({ configsByNovel: { ...s.configsByNovel, [novelId]: updated } }));
  },
  removeConfig: (novelId, id) => {
    const configs = get().getConfigs(novelId);
    const updated = configs.filter((c) => c.id !== id);
    saveToStorage(`moyu_publish_${novelId}`, updated);
    set((s) => ({ configsByNovel: { ...s.configsByNovel, [novelId]: updated } }));
  },
  addSchedule: (novelId, data) => {
    const schedules = get().getSchedules(novelId);
    const schedule: PublishSchedule = { ...data, id: generateId(), novelId, createdAt: new Date() };
    const updated = [...schedules, schedule];
    saveToStorage(`moyu_schedules_${novelId}`, updated);
    set((s) => ({ schedulesByNovel: { ...s.schedulesByNovel, [novelId]: updated } }));
  },
  updateSchedule: (novelId, id, updates) => {
    const schedules = get().getSchedules(novelId);
    const updated = schedules.map((s) => s.id === id ? { ...s, ...updates } : s);
    saveToStorage(`moyu_schedules_${novelId}`, updated);
    set((state) => ({ schedulesByNovel: { ...state.schedulesByNovel, [novelId]: updated } }));
  },
  getConfigs: (novelId) => get().configsByNovel[novelId] || [],
  getSchedules: (novelId) => get().schedulesByNovel[novelId] || [],
}));

interface AIWritingState {
  isGenerating: boolean;
  setIsGenerating: (v: boolean) => void;
  generatedContent: string;
  setGeneratedContent: (c: string) => void;
  writingMode: 'ai_collaboration' | 'ai_auto';
  setWritingMode: (m: 'ai_collaboration' | 'ai_auto') => void;
}

export const useAIWritingStore = create<AIWritingState>((set) => ({
  isGenerating: false,
  setIsGenerating: (v) => set({ isGenerating: v }),
  generatedContent: '',
  setGeneratedContent: (c) => set({ generatedContent: c }),
  writingMode: 'ai_collaboration',
  setWritingMode: (m) => set({ writingMode: m }),
}));
