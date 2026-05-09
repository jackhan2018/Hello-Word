export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'author' | 'signed_author' | 'studio_admin' | 'operator';
  createdAt: Date;
}

export interface Novel {
  id: string;
  userId: string;
  title: string;
  subtitle?: string;
  genre: NovelGenre;
  synopsis: string;
  targetPlatforms: Platform[];
  status: NovelStatus;
  coverUrl?: string;
  currentChapterId?: string;
  settings: NovelSettings;
  wordCount: number;
  chapterCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export type NovelGenre = 
  | 'xianxia' 
  | 'youth' 
  | 'urban' 
  | 'historical' 
  | 'game' 
  | 'science' 
  | 'psychological'
  | 'horror'
  | 'martial_arts'
  | 'other';

export type NovelStatus = 'draft' | 'writing' | 'completed' | 'suspended';

export interface NovelSettings {
  writingMode: 'ai_collaboration' | 'ai_auto';
  aiModel?: string;
  temperature?: number;
  targetWordCount?: number;
  dailyTarget?: number;
}

export interface Chapter {
  id: string;
  novelId: string;
  orderIndex: number;
  title: string;
  content: string;
  wordCount: number;
  status: ChapterStatus;
  outline?: string;
  aiContext?: AIContext;
  publishedUrls?: Record<Platform, string>;
  createdAt: Date;
  updatedAt: Date;
}

export type ChapterStatus = 'draft' | 'revising' | 'completed' | 'published' | 'writing';

export interface AIContext {
  summary?: string;
  keyEvents: string[];
  characters: string[];
  worldSettings: string[];
  recentDialogue?: string;
  emotionalArc?: string;
}

export interface Character {
  id: string;
  novelId: string;
  name: string;
  roleType: CharacterRole;
  avatar?: string;
  personality: PersonalityTraits;
  appearance: AppearanceTraits;
  background: string;
  speechStyle: string;
  relationships: CharacterRelationship[];
  arcDescription?: string;
  importance: 1 | 2 | 3;
  createdAt: Date;
}

export type CharacterRole = 'protagonist' | 'antagonist' | 'supporting' | 'minor';

export interface PersonalityTraits {
  bigFive?: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  tags: string[];
  fears?: string[];
  desires?: string[];
  habits?: string[];
}

export interface AppearanceTraits {
  age?: string;
  height?: string;
  build?: string;
  features?: string[];
  clothing?: string;
  accessories?: string[];
}

export interface CharacterRelationship {
  characterId: string;
  characterName: string;
  relationshipType: 'family' | 'friend' | 'rival' | 'enemy' | 'romantic' | 'mentor' | 'colleague';
  description?: string;
}

export interface WorldBuilding {
  id: string;
  novelId: string;
  category: WorldCategory;
  name: string;
  properties: Record<string, unknown>;
  description: string;
  parentId?: string;
  importance: 1 | 2 | 3;
  createdAt: Date;
}

export type WorldCategory = 
  | 'geography' 
  | 'faction' 
  | 'magic_system' 
  | 'item' 
  | 'technique' 
  | 'culture' 
  | 'history'
  | 'glossary';

export interface TimelineEvent {
  id: string;
  novelId: string;
  eventTime: string;
  endTime?: string;
  title: string;
  description: string;
  characters: string[];
  relatedChapters: string[];
  importance: 1 | 2 | 3;
  createdAt: Date;
}

export interface PublishConfig {
  id: string;
  novelId: string;
  platform: Platform;
  credentials?: PlatformCredentials;
  autoConvert: boolean;
  syncEnabled: boolean;
  status: 'active' | 'inactive' | 'error';
  lastSyncAt?: Date;
}

export type Platform = 'fanqie' | 'qimao' | 'qidian' | 'wechat' | 'kuaibao';

export interface PlatformCredentials {
  username?: string;
  token?: string;
  cookies?: string;
}

export interface PublishSchedule {
  id: string;
  novelId: string;
  chapterId: string;
  platform: Platform;
  scheduledTime: Date;
  status: 'pending' | 'publishing' | 'success' | 'failed';
  result?: string;
  createdAt: Date;
}

export interface TeamMember {
  id: string;
  novelId: string;
  userId: string;
  role: TeamRole;
  name: string;
  avatar?: string;
  permissions: Permission[];
  joinedAt: Date;
}

export type TeamRole = 'lead_writer' | 'world_builder' | 'polisher' | 'plot_designer' | 'editor';

export type Permission = 
  | 'read' 
  | 'write' 
  | 'edit_chapter' 
  | 'edit_world' 
  | 'edit_character'
  | 'manage_team'
  | 'publish';

export interface Task {
  id: string;
  novelId: string;
  title: string;
  description?: string;
  assigneeId?: string;
  type: TaskType;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  dueDate?: Date;
  relatedChapterId?: string;
  createdAt: Date;
}

export type TaskType = 'chapter' | 'revision' | 'world_building' | 'character' | 'research';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export interface AIWritingRequest {
  novelId: string;
  chapterId: string;
  type: 'continue' | 'rewrite' | 'outline' | 'dialogue' | 'description';
  instructions: string;
  wordCount?: number;
  context?: {
    recentContent?: string;
    plotDirection?: string;
  };
}

export interface AIWritingResponse {
  content: string;
  quality: {
    consistency: number;
    emotion: number;
    readability: number;
  };
  warnings?: string[];
}

export interface MemoryChunk {
  id: string;
  novelId: string;
  chapterRange: string;
  summary: string;
  keyEvents: string[];
  characters: string[];
  importance: number;
  createdAt: Date;
}

export interface PlatformTemplate {
  platform: Platform;
  name: string;
  icon: string;
  features: string[];
  wordLimit?: {
    min: number;
    max: number;
  };
  requiredFields?: string[];
}
