import { useState, useEffect } from 'react';
import { User, Bell, Shield, Palette, Keyboard, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { useAppStore } from '../store';

interface AISettings {
  model: string;
  temperature: number;
  style: string;
  contextMemory: boolean;
  emotionInjection: boolean;
}

interface NotificationSettings {
  publishSuccess: boolean;
  scheduleReminder: boolean;
  aiSuggestion: boolean;
  teamMessage: boolean;
  systemAnnouncement: boolean;
}

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'auto';
  fontSize: number;
  lineHeight: string;
}

const defaultAISettings: AISettings = {
  model: 'gpt-4',
  temperature: 0.7,
  style: 'vivid',
  contextMemory: true,
  emotionInjection: true,
};

const defaultNotifications: NotificationSettings = {
  publishSuccess: true,
  scheduleReminder: true,
  aiSuggestion: false,
  teamMessage: true,
  systemAnnouncement: false,
};

const defaultAppearance: AppearanceSettings = {
  theme: 'light',
  fontSize: 18,
  lineHeight: '1.75',
};

function loadLocalSetting<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveLocalSetting(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* ignore */ }
}

const tabs = [
  { id: 'profile', label: '个人信息', icon: User },
  { id: 'notifications', label: '通知设置', icon: Bell },
  { id: 'ai', label: 'AI设置', icon: Sparkles },
  { id: 'appearance', label: '外观', icon: Palette },
  { id: 'shortcuts', label: '快捷键', icon: Keyboard },
  { id: 'security', label: '安全', icon: Shield },
];

export function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const { user, setUser } = useAppStore();

  const [name, setName] = useState(user?.name || '墨韵作者');
  const [email, setEmail] = useState(user?.email || 'author@example.com');

  const [aiSettings, setAiSettings] = useState<AISettings>(loadLocalSetting('moyu_ai_settings', defaultAISettings));
  const [notifications, setNotifications] = useState<NotificationSettings>(loadLocalSetting('moyu_notifications', defaultNotifications));
  const [appearance, setAppearance] = useState<AppearanceSettings>(loadLocalSetting('moyu_appearance', defaultAppearance));

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSaveProfile = () => {
    if (!user) return;
    setUser({ ...user, name, email });
  };

  const handleSaveAI = () => {
    saveLocalSetting('moyu_ai_settings', aiSettings);
  };

  const handleSaveNotifications = () => {
    saveLocalSetting('moyu_notifications', notifications);
  };

  const handleSaveAppearance = () => {
    saveLocalSetting('moyu_appearance', appearance);
  };

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <header className="mb-6">
        <h1 className="text-3xl font-serif font-bold text-ink-900">设置中心</h1>
        <p className="text-ink-600 mt-1">管理你的账户和偏好设置</p>
      </header>

      <div className="flex gap-6">
        <div className="w-56 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                'w-full p-3 text-left rounded-xl flex items-center gap-3 transition-all',
                activeTab === tab.id ? 'bg-indigo-100 text-indigo-900' : 'hover:bg-ink-100 text-ink-700'
              )}
            >
              <tab.icon className="w-5 h-5" />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-2xl border border-ink-200/50 p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-serif font-bold text-ink-900 mb-4">个人信息</h2>
                <p className="text-sm text-ink-600 mb-6">管理你的账户基本信息</p>
              </div>

              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-vermillion-500 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{name.charAt(0)}</span>
                </div>
                <button className="px-4 py-2 text-sm bg-ink-100 text-ink-700 rounded-lg hover:bg-ink-200 transition-colors">
                  更换头像
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1.5">用户名</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1.5">邮箱</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-1.5">用户角色</label>
                  <input
                    type="text"
                    value={user?.role === 'author' ? '普通作者' : user?.role === 'signed_author' ? '签约作者' : user?.role === 'studio_admin' ? '工作室管理员' : user?.role === 'operator' ? '运营' : ''}
                    disabled
                    className="w-full px-4 py-2.5 rounded-xl border border-ink-200 bg-ink-50 text-ink-500"
                  />
                  <p className="text-xs text-ink-400 mt-1">升级账号可解锁更多功能</p>
                </div>
              </div>

              <div className="pt-4 border-t border-ink-200">
                <button
                  onClick={handleSaveProfile}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  保存修改
                </button>
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-serif font-bold text-ink-900 mb-4">AI写作设置</h2>
                <p className="text-sm text-ink-600 mb-6">配置AI写作引擎的参数和行为</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-2">AI模型</label>
                  <select
                    value={aiSettings.model}
                    onChange={(e) => setAiSettings((s) => ({ ...s, model: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-indigo-400 outline-none"
                  >
                    <option value="gpt-4">GPT-4 (高质量)</option>
                    <option value="gpt-3.5-turbo">GPT-3.5-turbo (快速)</option>
                    <option value="claude-2">Claude-2 (世界观优化)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-2">创意度 (Temperature)</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={aiSettings.temperature}
                      onChange={(e) => setAiSettings((s) => ({ ...s, temperature: parseFloat(e.target.value) }))}
                      className="flex-1"
                    />
                    <span className="w-12 text-center text-sm text-ink-600">{aiSettings.temperature.toFixed(1)}</span>
                  </div>
                  <p className="text-xs text-ink-400 mt-1">较低值更稳定，较高值更有创意</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-700 mb-2">写作风格</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'vivid', label: '生动描写', desc: '丰富的场景描写' },
                      { id: 'concise', label: '简洁明快', desc: '节奏紧凑不拖沓' },
                      { id: 'literary', label: '文学性强', desc: '优美凝练的语言' },
                      { id: 'popular', label: '通俗易懂', desc: '适合大众阅读' },
                    ].map((style) => (
                      <label
                        key={style.id}
                        className={clsx(
                          'flex items-start gap-3 p-3 rounded-xl border cursor-pointer hover:bg-ink-50',
                          aiSettings.style === style.id ? 'border-indigo-400 bg-indigo-50' : 'border-ink-200'
                        )}
                      >
                        <input
                          type="radio"
                          name="style"
                          value={style.id}
                          checked={aiSettings.style === style.id}
                          onChange={(e) => setAiSettings((s) => ({ ...s, style: e.target.value }))}
                          className="mt-1"
                        />
                        <div>
                          <span className="text-sm font-medium text-ink-900">{style.label}</span>
                          <p className="text-xs text-ink-500">{style.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-ink-50/50">
                  <div>
                    <p className="font-medium text-ink-900">上下文记忆</p>
                    <p className="text-sm text-ink-500">自动保持世界观和人物设定一致</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={aiSettings.contextMemory}
                      onChange={(e) => setAiSettings((s) => ({ ...s, contextMemory: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-ink-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-ink-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-ink-50/50">
                  <div>
                    <p className="font-medium text-ink-900">情感注入</p>
                    <p className="text-sm text-ink-500">自动添加情感细节让人物更鲜活</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={aiSettings.emotionInjection}
                      onChange={(e) => setAiSettings((s) => ({ ...s, emotionInjection: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-ink-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-ink-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-ink-200">
                <button
                  onClick={handleSaveAI}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  保存AI设置
                </button>
              </div>
            </div>
          )}

          {activeTab === 'shortcuts' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-serif font-bold text-ink-900 mb-4">快捷键设置</h2>
                <p className="text-sm text-ink-600 mb-6">自定义编辑器快捷键</p>
              </div>

              <div className="space-y-3">
                {[
                  { action: '保存', shortcut: 'Ctrl + S' },
                  { action: 'AI续写', shortcut: 'Ctrl + Space' },
                  { action: '新建章节', shortcut: 'Ctrl + N' },
                  { action: '查找替换', shortcut: 'Ctrl + F' },
                  { action: '全屏写作', shortcut: 'F11' },
                  { action: '切换侧边栏', shortcut: 'Ctrl + B' },
                ].map((item) => (
                  <div key={item.action} className="flex items-center justify-between p-3 rounded-xl bg-ink-50/50">
                    <span className="text-ink-700">{item.action}</span>
                    <kbd className="px-3 py-1.5 text-sm font-mono bg-white border border-ink-200 rounded-lg shadow-sm">
                      {item.shortcut}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-serif font-bold text-ink-900 mb-4">通知设置</h2>
                <p className="text-sm text-ink-600 mb-6">管理你的通知偏好</p>
              </div>

              <div className="space-y-4">
                {([
                  { key: 'publishSuccess' as const, label: '发布成功通知', desc: '章节发布成功时通知' },
                  { key: 'scheduleReminder' as const, label: '定时发布提醒', desc: '发布前30分钟提醒' },
                  { key: 'aiSuggestion' as const, label: 'AI建议通知', desc: '收到AI写作建议时通知' },
                  { key: 'teamMessage' as const, label: '团队消息', desc: '团队成员的消息和任务' },
                  { key: 'systemAnnouncement' as const, label: '系统公告', desc: '平台更新和维护通知' },
                ]).map((notif) => (
                  <div key={notif.key} className="flex items-center justify-between p-4 rounded-xl bg-ink-50/50">
                    <div>
                      <p className="font-medium text-ink-900">{notif.label}</p>
                      <p className="text-sm text-ink-500">{notif.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notifications[notif.key]}
                        onChange={(e) => setNotifications((s) => ({ ...s, [notif.key]: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-ink-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-ink-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-ink-200">
                <button
                  onClick={handleSaveNotifications}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  保存通知设置
                </button>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-serif font-bold text-ink-900 mb-4">外观设置</h2>
                <p className="text-sm text-ink-600 mb-6">自定义界面外观</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-700 mb-3">主题</label>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { id: 'light' as const, label: '浅色', bg: 'bg-ink-50' },
                    { id: 'dark' as const, label: '深色', bg: 'bg-ink-900' },
                    { id: 'auto' as const, label: '自动', bg: 'bg-gradient-to-r from-ink-50 to-ink-900' },
                  ]).map((theme) => (
                    <label
                      key={theme.id}
                      className={clsx(
                        'flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer hover:border-indigo-300',
                        appearance.theme === theme.id ? 'border-indigo-400 bg-indigo-50' : 'border-ink-200'
                      )}
                    >
                      <input
                        type="radio"
                        name="theme"
                        value={theme.id}
                        checked={appearance.theme === theme.id}
                        onChange={(e) => setAppearance((s) => ({ ...s, theme: e.target.value as 'light' | 'dark' | 'auto' }))}
                        className="sr-only"
                      />
                      <div className={clsx('w-12 h-8 rounded-lg', theme.bg)} />
                      <span className="text-sm font-medium text-ink-700">{theme.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-700 mb-3">编辑器字体大小</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="14"
                    max="24"
                    step="1"
                    value={appearance.fontSize}
                    onChange={(e) => setAppearance((s) => ({ ...s, fontSize: parseInt(e.target.value) }))}
                    className="flex-1"
                  />
                  <span className="w-12 text-center text-sm text-ink-600">{appearance.fontSize}px</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink-700 mb-3">行间距</label>
                <select
                  value={appearance.lineHeight}
                  onChange={(e) => setAppearance((s) => ({ ...s, lineHeight: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-ink-200 focus:border-indigo-400 outline-none"
                >
                  <option value="1.5">紧凑 (1.5)</option>
                  <option value="1.75">标准 (1.75)</option>
                  <option value="2.0">宽松 (2.0)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-ink-200">
                <button
                  onClick={handleSaveAppearance}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
                >
                  保存外观设置
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-serif font-bold text-ink-900 mb-4">安全设置</h2>
                <p className="text-sm text-ink-600 mb-6">管理你的账户安全</p>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-ink-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-ink-900">修改密码</p>
                      <p className="text-sm text-ink-500">上次修改于30天前</p>
                    </div>
                    <button className="px-4 py-2 text-sm bg-ink-100 text-ink-700 rounded-lg hover:bg-ink-200 transition-colors">
                      修改
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-ink-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-ink-900">两步验证</p>
                      <p className="text-sm text-ink-500">未开启，建议开启以增强账户安全</p>
                    </div>
                    <button className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                      开启
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-vermillion-200 bg-vermillion-50/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-vermillion-900">删除账户</p>
                      <p className="text-sm text-vermillion-600">永久删除你的账户和所有数据</p>
                    </div>
                    <button className="px-4 py-2 text-sm border border-vermillion-300 text-vermillion-700 rounded-lg hover:bg-vermillion-100 transition-colors">
                      删除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
