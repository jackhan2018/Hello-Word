import { describe, it, expect, beforeAll } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAppStore, useNovelsStore, useChaptersStore, useCharactersStore, useWorldStore, useTimelineStore, useAIWritingStore } from '../src/store';
import type { Novel, Chapter, Character, WorldBuilding, TimelineEvent, ChapterStatus } from '../src/types';

describe('Zustand Store 测试', () => {

  describe('AppStore - 应用状态管理', () => {
    it('应该正确初始化用户状态', () => {
      const state = useAppStore.getState();
      expect(state.user).not.toBeNull();
      expect(state.user?.name).toBe('墨韵作者');
    });

    it('应该正确切换侧边栏状态', () => {
      const { toggleSidebar } = useAppStore.getState();
      const initial = useAppStore.getState().sidebarCollapsed;

      act(() => {
        toggleSidebar();
      });

      expect(useAppStore.getState().sidebarCollapsed).toBe(!initial);
    });

    it('应该正确设置活跃小说ID', () => {
      act(() => {
        useAppStore.getState().setActiveNovelId('test-novel-1');
      });

      expect(useAppStore.getState().activeNovelId).toBe('test-novel-1');
    });

    it('应该正确切换主题', () => {
      act(() => {
        useAppStore.getState().setTheme('dark');
      });

      expect(useAppStore.getState().theme).toBe('dark');
    });
  });

  describe('NovelsStore - 小说管理', () => {
    const mockNovel: Novel = {
      id: 'test-1',
      userId: 'user-1',
      title: '测试小说',
      genre: 'xianxia',
      synopsis: '测试简介',
      targetPlatforms: ['fanqie'],
      status: 'writing',
      wordCount: 10000,
      chapterCount: 10,
      settings: { writingMode: 'ai_collaboration' },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('应该正确添加小说', () => {
      act(() => {
        useNovelsStore.getState().addNovel(mockNovel);
      });

      const novels = useNovelsStore.getState().novels;
      expect(novels.length).toBeGreaterThan(0);
      expect(novels.some(n => n.id === 'test-1')).toBe(true);
    });

    it('应该正确更新小说', () => {
      act(() => {
        useNovelsStore.getState().updateNovel('test-1', { title: '更新后标题' });
      });

      const novel = useNovelsStore.getState().novels.find(n => n.id === 'test-1');
      expect(novel?.title).toBe('更新后标题');
    });

    it('应该正确删除小说', () => {
      act(() => {
        useNovelsStore.getState().deleteNovel('test-1');
      });

      const novel = useNovelsStore.getState().novels.find(n => n.id === 'test-1');
      expect(novel).toBeUndefined();
    });
  });

  describe('ChaptersStore - 章节管理', () => {
    const mockChapter: Chapter = {
      id: 'chapter-1',
      novelId: 'novel-1',
      orderIndex: 1,
      title: '第一章：开始',
      content: '这是章节内容',
      wordCount: 2000,
      status: 'draft' as ChapterStatus,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('应该正确添加章节', () => {
      act(() => {
        useChaptersStore.getState().addChapter(mockChapter);
      });

      const chapters = useChaptersStore.getState().chapters;
      expect(chapters.some(c => c.id === 'chapter-1')).toBe(true);
    });

    it('应该正确更新章节', () => {
      act(() => {
        useChaptersStore.getState().updateChapter('chapter-1', {
          status: 'completed' as ChapterStatus,
          wordCount: 3000
        });
      });

      const chapter = useChaptersStore.getState().chapters.find(c => c.id === 'chapter-1');
      expect(chapter?.status).toBe('completed');
      expect(chapter?.wordCount).toBe(3000);
    });

    it('应该正确设置当前章节', () => {
      act(() => {
        useChaptersStore.getState().setCurrentChapter(mockChapter);
      });

      expect(useChaptersStore.getState().currentChapter?.id).toBe('chapter-1');
    });
  });

  describe('CharactersStore - 角色管理', () => {
    const mockCharacter: Character = {
      id: 'char-1',
      novelId: 'novel-1',
      name: '测试角色',
      roleType: 'protagonist',
      personality: { tags: ['勇敢', '聪明'] },
      appearance: { age: '20岁', height: '175cm' },
      background: '测试背景',
      speechStyle: '测试语言风格',
      relationships: [],
      importance: 3,
      createdAt: new Date(),
    };

    it('应该正确添加角色', () => {
      act(() => {
        useCharactersStore.getState().addCharacter(mockCharacter);
      });

      const characters = useCharactersStore.getState().characters;
      expect(characters.some(c => c.id === 'char-1')).toBe(true);
    });

    it('应该正确更新角色', () => {
      act(() => {
        useCharactersStore.getState().updateCharacter('char-1', {
          name: '更新后角色名'
        });
      });

      const character = useCharactersStore.getState().characters.find(c => c.id === 'char-1');
      expect(character?.name).toBe('更新后角色名');
    });
  });

  describe('WorldStore - 世界观管理', () => {
    const mockWorld: WorldBuilding = {
      id: 'world-1',
      novelId: 'novel-1',
      category: 'geography',
      name: '测试地图',
      properties: { type: '城市' },
      description: '测试描述',
      importance: 2,
      createdAt: new Date(),
    };

    it('应该正确添加世界观设定', () => {
      act(() => {
        useWorldStore.getState().addWorldBuilding(mockWorld);
      });

      const worlds = useWorldStore.getState().worldBuildings;
      expect(worlds.some(w => w.id === 'world-1')).toBe(true);
    });
  });

  describe('TimelineStore - 时间线管理', () => {
    const mockEvent: TimelineEvent = {
      id: 'event-1',
      novelId: 'novel-1',
      eventTime: '修仙历元年',
      title: '测试事件',
      description: '测试描述',
      characters: ['角色1'],
      relatedChapters: ['第1章'],
      importance: 3,
      createdAt: new Date(),
    };

    it('应该正确添加时间线事件', () => {
      act(() => {
        useTimelineStore.getState().addEvent(mockEvent);
      });

      const events = useTimelineStore.getState().events;
      expect(events.some(e => e.id === 'event-1')).toBe(true);
    });
  });

  describe('AIWritingStore - AI写作状态', () => {
    it('应该正确设置生成状态', () => {
      act(() => {
        useAIWritingStore.getState().setIsGenerating(true);
      });

      expect(useAIWritingStore.getState().isGenerating).toBe(true);
    });

    it('应该正确设置生成内容', () => {
      const content = '这是AI生成的内容';

      act(() => {
        useAIWritingStore.getState().setGeneratedContent(content);
      });

      expect(useAIWritingStore.getState().generatedContent).toBe(content);
    });

    it('应该正确切换写作模式', () => {
      act(() => {
        useAIWritingStore.getState().setWritingMode('ai_auto');
      });

      expect(useAIWritingStore.getState().writingMode).toBe('ai_auto');
    });
  });
});

describe('类型定义测试', () => {
  it('Novel类型应该包含所有必要字段', () => {
    const novel: Novel = {
      id: '1',
      userId: '1',
      title: '测试',
      genre: 'urban',
      synopsis: '测试',
      targetPlatforms: ['fanqie'],
      status: 'draft',
      wordCount: 0,
      chapterCount: 0,
      settings: { writingMode: 'ai_collaboration' },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(novel.id).toBeDefined();
    expect(novel.title).toBeDefined();
    expect(novel.genre).toBeDefined();
  });

  it('ChapterStatus类型应该包含所有状态', () => {
    const statuses: ChapterStatus[] = ['draft', 'revising', 'completed', 'published', 'writing'];

    statuses.forEach(status => {
      const chapter: Chapter = {
        id: '1',
        novelId: '1',
        orderIndex: 1,
        title: '测试',
        content: '',
        wordCount: 0,
        status,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      expect(chapter.status).toBe(status);
    });
  });
});
