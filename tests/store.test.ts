import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import {
  useAppStore, useNovelsStore, useChaptersStore, useCharactersStore,
  useWorldStore, useTimelineStore, useAIWritingStore, usePublishStore
} from '../src/store';
import type { Novel, Chapter, Character, WorldBuilding, TimelineEvent, ChapterStatus } from '../src/types';

describe('Zustand Store 测试', () => {

  beforeEach(() => {
    localStorage.clear();
    useNovelsStore.setState({ novels: [] });
    useChaptersStore.setState({ chaptersByNovel: {} });
    useCharactersStore.setState({ charactersByNovel: {} });
    useWorldStore.setState({ worldByNovel: {} });
    useTimelineStore.setState({ eventsByNovel: {} });
    usePublishStore.setState({ configsByNovel: {}, schedulesByNovel: {} });
  });

  describe('AppStore', () => {
    it('应该正确初始化用户状态', () => {
      const state = useAppStore.getState();
      expect(state.user).not.toBeNull();
      expect(state.user.name).toBeTruthy();
    });

    it('应该正确切换侧边栏', () => {
      const initial = useAppStore.getState().sidebarCollapsed;
      act(() => { useAppStore.getState().toggleSidebar(); });
      expect(useAppStore.getState().sidebarCollapsed).toBe(!initial);
    });

    it('应该正确设置活跃小说ID', () => {
      act(() => { useAppStore.getState().setActiveNovelId('novel-1'); });
      expect(useAppStore.getState().activeNovelId).toBe('novel-1');
    });
  });

  describe('NovelsStore', () => {
    it('应该正确添加小说', () => {
      const novel = useNovelsStore.getState().addNovel({
        userId: 'user-1',
        title: '测试小说',
        genre: 'xianxia',
        synopsis: '测试简介',
        targetPlatforms: ['fanqie'],
        status: 'writing',
        settings: { writingMode: 'ai_collaboration' },
      });

      expect(novel.id).toBeTruthy();
      expect(novel.title).toBe('测试小说');
      expect(useNovelsStore.getState().novels).toHaveLength(1);
    });

    it('应该正确更新小说', () => {
      const novel = useNovelsStore.getState().addNovel({
        userId: 'user-1', title: '测试', genre: 'xianxia', synopsis: '',
        targetPlatforms: [], status: 'draft', settings: { writingMode: 'ai_collaboration' },
      });

      act(() => { useNovelsStore.getState().updateNovel(novel.id, { title: '更新后标题' }); });

      const updated = useNovelsStore.getState().getNovel(novel.id);
      expect(updated?.title).toBe('更新后标题');
    });

    it('应该正确删除小说', () => {
      const novel = useNovelsStore.getState().addNovel({
        userId: 'user-1', title: '测试', genre: 'xianxia', synopsis: '',
        targetPlatforms: [], status: 'draft', settings: { writingMode: 'ai_collaboration' },
      });

      act(() => { useNovelsStore.getState().deleteNovel(novel.id); });
      expect(useNovelsStore.getState().getNovel(novel.id)).toBeUndefined();
    });

    it('应该持久化到localStorage', () => {
      useNovelsStore.getState().addNovel({
        userId: 'user-1', title: '持久化测试', genre: 'urban', synopsis: '',
        targetPlatforms: [], status: 'draft', settings: { writingMode: 'ai_auto' },
      });

      const stored = JSON.parse(localStorage.getItem('moyu_novels') || '[]');
      expect(stored).toHaveLength(1);
      expect(stored[0].title).toBe('持久化测试');
    });
  });

  describe('ChaptersStore', () => {
    const novelId = 'test-novel';

    it('应该正确添加章节', () => {
      useChaptersStore.getState().loadChapters(novelId);
      const chapter = useChaptersStore.getState().addChapter(novelId, {
        orderIndex: 1, title: '第一章', content: '', status: 'draft',
      });

      expect(chapter.id).toBeTruthy();
      expect(chapter.title).toBe('第一章');
      expect(useChaptersStore.getState().getChapters(novelId)).toHaveLength(1);
    });

    it('应该正确更新章节', () => {
      useChaptersStore.getState().loadChapters(novelId);
      const chapter = useChaptersStore.getState().addChapter(novelId, {
        orderIndex: 1, title: '第一章', content: '', status: 'draft',
      });

      act(() => {
        useChaptersStore.getState().updateChapter(novelId, chapter.id, {
          content: '新内容', wordCount: 1000, status: 'completed' as ChapterStatus,
        });
      });

      const updated = useChaptersStore.getState().getChapters(novelId).find(c => c.id === chapter.id);
      expect(updated?.wordCount).toBe(1000);
      expect(updated?.status).toBe('completed');
    });

    it('应该正确删除章节', () => {
      useChaptersStore.getState().loadChapters(novelId);
      const chapter = useChaptersStore.getState().addChapter(novelId, {
        orderIndex: 1, title: '第一章', content: '', status: 'draft',
      });

      act(() => { useChaptersStore.getState().deleteChapter(novelId, chapter.id); });
      expect(useChaptersStore.getState().getChapters(novelId)).toHaveLength(0);
    });
  });

  describe('CharactersStore', () => {
    const novelId = 'test-novel';

    it('应该正确添加角色', () => {
      useCharactersStore.getState().loadCharacters(novelId);
      const character = useCharactersStore.getState().addCharacter(novelId, {
        name: '林风', roleType: 'protagonist',
        personality: { tags: ['勇敢'] }, appearance: {},
        background: '背景', speechStyle: '沉稳', relationships: [], importance: 3,
      });

      expect(character.id).toBeTruthy();
      expect(useCharactersStore.getState().getCharacters(novelId)).toHaveLength(1);
    });

    it('应该正确更新角色', () => {
      useCharactersStore.getState().loadCharacters(novelId);
      const character = useCharactersStore.getState().addCharacter(novelId, {
        name: '林风', roleType: 'protagonist',
        personality: { tags: ['勇敢'] }, appearance: {},
        background: '背景', speechStyle: '沉稳', relationships: [], importance: 3,
      });

      act(() => {
        useCharactersStore.getState().updateCharacter(novelId, character.id, { name: '更新名' });
      });

      const updated = useCharactersStore.getState().getCharacters(novelId).find(c => c.id === character.id);
      expect(updated?.name).toBe('更新名');
    });

    it('应该正确删除角色', () => {
      useCharactersStore.getState().loadCharacters(novelId);
      const character = useCharactersStore.getState().addCharacter(novelId, {
        name: '林风', roleType: 'protagonist',
        personality: { tags: [] }, appearance: {},
        background: '', speechStyle: '', relationships: [], importance: 1,
      });

      act(() => { useCharactersStore.getState().deleteCharacter(novelId, character.id); });
      expect(useCharactersStore.getState().getCharacters(novelId)).toHaveLength(0);
    });
  });

  describe('WorldStore', () => {
    const novelId = 'test-novel';

    it('应该正确添加世界观设定', () => {
      useWorldStore.getState().loadWorld(novelId);
      const building = useWorldStore.getState().addWorldBuilding(novelId, {
        category: 'geography', name: '青云山',
        properties: { type: '山脉' }, description: '灵山', importance: 3,
      });

      expect(building.id).toBeTruthy();
      expect(useWorldStore.getState().getWorldBuildings(novelId)).toHaveLength(1);
    });

    it('应该正确更新世界观设定', () => {
      useWorldStore.getState().loadWorld(novelId);
      const building = useWorldStore.getState().addWorldBuilding(novelId, {
        category: 'geography', name: '青云山',
        properties: {}, description: '', importance: 1,
      });

      act(() => {
        useWorldStore.getState().updateWorldBuilding(novelId, building.id, { name: '更新名' });
      });

      const updated = useWorldStore.getState().getWorldBuildings(novelId).find(w => w.id === building.id);
      expect(updated?.name).toBe('更新名');
    });
  });

  describe('TimelineStore', () => {
    const novelId = 'test-novel';

    it('应该正确添加时间线事件', () => {
      useTimelineStore.getState().loadEvents(novelId);
      const event = useTimelineStore.getState().addEvent(novelId, {
        eventTime: '元年春', title: '出生',
        description: '主角出生', characters: ['林风'], relatedChapters: [], importance: 3,
      });

      expect(event.id).toBeTruthy();
      expect(useTimelineStore.getState().getEvents(novelId)).toHaveLength(1);
    });

    it('应该正确删除时间线事件', () => {
      useTimelineStore.getState().loadEvents(novelId);
      const event = useTimelineStore.getState().addEvent(novelId, {
        eventTime: '元年', title: '测试', description: '', characters: [], relatedChapters: [], importance: 1,
      });

      act(() => { useTimelineStore.getState().deleteEvent(novelId, event.id); });
      expect(useTimelineStore.getState().getEvents(novelId)).toHaveLength(0);
    });
  });

  describe('PublishStore', () => {
    const novelId = 'test-novel';

    it('应该正确添加发布配置', () => {
      usePublishStore.getState().loadPublish(novelId);
      usePublishStore.getState().addConfig(novelId, {
        platform: 'fanqie', autoConvert: true, syncEnabled: false, status: 'active',
      });

      expect(usePublishStore.getState().getConfigs(novelId)).toHaveLength(1);
    });

    it('应该正确添加发布计划', () => {
      usePublishStore.getState().loadPublish(novelId);
      usePublishStore.getState().addSchedule(novelId, {
        chapterId: 'ch-1', platform: 'fanqie',
        scheduledTime: new Date(), status: 'pending',
      });

      expect(usePublishStore.getState().getSchedules(novelId)).toHaveLength(1);
    });
  });

  describe('AIWritingStore', () => {
    it('应该正确设置生成状态', () => {
      act(() => { useAIWritingStore.getState().setIsGenerating(true); });
      expect(useAIWritingStore.getState().isGenerating).toBe(true);
    });

    it('应该正确设置生成内容', () => {
      act(() => { useAIWritingStore.getState().setGeneratedContent('AI内容'); });
      expect(useAIWritingStore.getState().generatedContent).toBe('AI内容');
    });

    it('应该正确切换写作模式', () => {
      act(() => { useAIWritingStore.getState().setWritingMode('ai_auto'); });
      expect(useAIWritingStore.getState().writingMode).toBe('ai_auto');
    });
  });

  describe('数据隔离测试', () => {
    it('不同小说的章节数据应该隔离', () => {
      useChaptersStore.getState().loadChapters('novel-A');
      useChaptersStore.getState().loadChapters('novel-B');

      useChaptersStore.getState().addChapter('novel-A', {
        orderIndex: 1, title: 'A章', content: '', status: 'draft',
      });
      useChaptersStore.getState().addChapter('novel-B', {
        orderIndex: 1, title: 'B章', content: '', status: 'draft',
      });

      expect(useChaptersStore.getState().getChapters('novel-A')).toHaveLength(1);
      expect(useChaptersStore.getState().getChapters('novel-B')).toHaveLength(1);
      expect(useChaptersStore.getState().getChapters('novel-A')[0].title).toBe('A章');
      expect(useChaptersStore.getState().getChapters('novel-B')[0].title).toBe('B章');
    });

    it('不同小说的角色数据应该隔离', () => {
      useCharactersStore.getState().loadCharacters('novel-A');
      useCharactersStore.getState().loadCharacters('novel-B');

      useCharactersStore.getState().addCharacter('novel-A', {
        name: '角色A', roleType: 'protagonist',
        personality: { tags: [] }, appearance: {},
        background: '', speechStyle: '', relationships: [], importance: 1,
      });

      expect(useCharactersStore.getState().getCharacters('novel-A')).toHaveLength(1);
      expect(useCharactersStore.getState().getCharacters('novel-B')).toHaveLength(0);
    });
  });
});
