import { create } from 'zustand';
import type { User, Novel, Chapter, Character, WorldBuilding, TimelineEvent, AIContext } from '../types';

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
  
  activeNovelId: string | null;
  setActiveNovelId: (id: string | null) => void;
  
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: {
    id: '1',
    email: 'author@example.com',
    name: '墨韵作者',
    role: 'author',
    createdAt: new Date(),
  },
  setUser: (user) => set({ user }),
  
  activeNovelId: null,
  setActiveNovelId: (id) => set({ activeNovelId: id }),
  
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  
  theme: 'light',
  setTheme: (theme) => set({ theme }),
}));

interface NovelsState {
  novels: Novel[];
  setNovels: (novels: Novel[]) => void;
  addNovel: (novel: Novel) => void;
  updateNovel: (id: string, updates: Partial<Novel>) => void;
  deleteNovel: (id: string) => void;
}

export const useNovelsStore = create<NovelsState>((set) => ({
  novels: [],
  setNovels: (novels) => set({ novels }),
  addNovel: (novel) => set((state) => ({ novels: [...state.novels, novel] })),
  updateNovel: (id, updates) => set((state) => ({
    novels: state.novels.map((n) => n.id === id ? { ...n, ...updates } : n),
  })),
  deleteNovel: (id) => set((state) => ({
    novels: state.novels.filter((n) => n.id !== id),
  })),
}));

interface ChaptersState {
  chapters: Chapter[];
  setChapters: (chapters: Chapter[]) => void;
  addChapter: (chapter: Chapter) => void;
  updateChapter: (id: string, updates: Partial<Chapter>) => void;
  deleteChapter: (id: string) => void;
  currentChapter: Chapter | null;
  setCurrentChapter: (chapter: Chapter | null) => void;
}

export const useChaptersStore = create<ChaptersState>((set) => ({
  chapters: [],
  setChapters: (chapters) => set({ chapters }),
  addChapter: (chapter) => set((state) => ({ chapters: [...state.chapters, chapter] })),
  updateChapter: (id, updates) => set((state) => ({
    chapters: state.chapters.map((c) => c.id === id ? { ...c, ...updates } : c),
  })),
  deleteChapter: (id) => set((state) => ({
    chapters: state.chapters.filter((c) => c.id !== id),
  })),
  currentChapter: null,
  setCurrentChapter: (chapter) => set({ currentChapter: chapter }),
}));

interface CharactersState {
  characters: Character[];
  setCharacters: (characters: Character[]) => void;
  addCharacter: (character: Character) => void;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  deleteCharacter: (id: string) => void;
}

export const useCharactersStore = create<CharactersState>((set) => ({
  characters: [],
  setCharacters: (characters) => set({ characters }),
  addCharacter: (character) => set((state) => ({ characters: [...state.characters, character] })),
  updateCharacter: (id, updates) => set((state) => ({
    characters: state.characters.map((c) => c.id === id ? { ...c, ...updates } : c),
  })),
  deleteCharacter: (id) => set((state) => ({
    characters: state.characters.filter((c) => c.id !== id),
  })),
}));

interface WorldState {
  worldBuildings: WorldBuilding[];
  setWorldBuildings: (buildings: WorldBuilding[]) => void;
  addWorldBuilding: (building: WorldBuilding) => void;
  updateWorldBuilding: (id: string, updates: Partial<WorldBuilding>) => void;
  deleteWorldBuilding: (id: string) => void;
}

export const useWorldStore = create<WorldState>((set) => ({
  worldBuildings: [],
  setWorldBuildings: (buildings) => set({ worldBuildings: buildings }),
  addWorldBuilding: (building) => set((state) => ({ 
    worldBuildings: [...state.worldBuildings, building] 
  })),
  updateWorldBuilding: (id, updates) => set((state) => ({
    worldBuildings: state.worldBuildings.map((w) => 
      w.id === id ? { ...w, ...updates } : w
    ),
  })),
  deleteWorldBuilding: (id) => set((state) => ({
    worldBuildings: state.worldBuildings.filter((w) => w.id !== id),
  })),
}));

interface TimelineState {
  events: TimelineEvent[];
  setEvents: (events: TimelineEvent[]) => void;
  addEvent: (event: TimelineEvent) => void;
  updateEvent: (id: string, updates: Partial<TimelineEvent>) => void;
  deleteEvent: (id: string) => void;
}

export const useTimelineStore = create<TimelineState>((set) => ({
  events: [],
  setEvents: (events) => set({ events }),
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  updateEvent: (id, updates) => set((state) => ({
    events: state.events.map((e) => e.id === id ? { ...e, ...updates } : e),
  })),
  deleteEvent: (id) => set((state) => ({
    events: state.events.filter((e) => e.id !== id),
  })),
}));

interface AIWritingState {
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
  generatedContent: string;
  setGeneratedContent: (content: string) => void;
  writingMode: 'ai_collaboration' | 'ai_auto';
  setWritingMode: (mode: 'ai_collaboration' | 'ai_auto') => void;
  aiContext: AIContext | null;
  setAiContext: (context: AIContext | null) => void;
}

export const useAIWritingStore = create<AIWritingState>((set) => ({
  isGenerating: false,
  setIsGenerating: (generating) => set({ isGenerating: generating }),
  generatedContent: '',
  setGeneratedContent: (content) => set({ generatedContent: content }),
  writingMode: 'ai_collaboration',
  setWritingMode: (mode) => set({ writingMode: mode }),
  aiContext: null,
  setAiContext: (context) => set({ aiContext: context }),
}));
