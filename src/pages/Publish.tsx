import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
  Plus,
  Settings,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  BookOpen,
  TrendingUp,
  Calendar,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { clsx } from 'clsx';
import type { Platform, PublishSchedule } from '../types';
import { usePublishStore, useNovelsStore, useChaptersStore, platformInfo } from '../store';

const allPlatforms: Platform[] = ['fanqie', 'qimao', 'qidian', 'wechat', 'kuaibao'];

export function Publish() {
  const { id: routeNovelId } = useParams();
  const novels = useNovelsStore((s) => s.novels);
  const novelId = routeNovelId || novels[0]?.id || '';

  const { loadPublish, getConfigs, getSchedules, addConfig, updateConfig, removeConfig, addSchedule, updateSchedule } = usePublishStore();
  const { loadChapters, getChapters } = useChaptersStore();

  const configs = usePublishStore((s) => getConfigs(novelId));
  const schedules = usePublishStore((s) => getSchedules(novelId));
  const chapters = useChaptersStore((s) => getChapters(novelId));

  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'settings'>('overview');
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [newScheduleChapterId, setNewScheduleChapterId] = useState('');
  const [newSchedulePlatform, setNewSchedulePlatform] = useState<Platform>('fanqie');
  const [newScheduleTime, setNewScheduleTime] = useState('');
  const [editingConfigId, setEditingConfigId] = useState<string | null>(null);
  const [editCredentials, setEditCredentials] = useState<{ username: string; token: string }>({ username: '', token: '' });

  useEffect(() => {
    if (!novelId) return;
    loadPublish(novelId);
    loadChapters(novelId);
  }, [novelId, loadPublish, loadChapters]);

  const connectedPlatforms = useMemo(() => configs.filter((c) => c.status === 'active').map((c) => c.platform), [configs]);

  const handleConnect = (platform: Platform) => {
    const existing = configs.find((c) => c.platform === platform);
    if (existing) {
      if (existing.status === 'active') {
        updateConfig(novelId, existing.id, { status: 'inactive' });
      } else {
        updateConfig(novelId, existing.id, { status: 'active' });
      }
    } else {
      addConfig(novelId, {
        platform,
        autoConvert: true,
        syncEnabled: false,
        status: 'active',
      });
    }
  };

  const handleDisconnect = (platform: Platform) => {
    const existing = configs.find((c) => c.platform === platform);
    if (existing) {
      removeConfig(novelId, existing.id);
    }
  };

  const handleSaveCredentials = (configId: string) => {
    updateConfig(novelId, configId, {
      credentials: { username: editCredentials.username, token: editCredentials.token },
    });
    setEditingConfigId(null);
  };

  const handleAddSchedule = () => {
    if (!newScheduleChapterId || !newScheduleTime) return;
    addSchedule(novelId, {
      chapterId: newScheduleChapterId,
      platform: newSchedulePlatform,
      scheduledTime: new Date(newScheduleTime),
      status: 'pending',
    });
    setShowAddSchedule(false);
    setNewScheduleChapterId('');
    setNewScheduleTime('');
  };

  const cancelSchedule = (id: string) => {
    updateSchedule(novelId, id, { status: 'failed', result: '已取消' });
  };

  const pendingSchedules = schedules.filter((s) => s.status === 'pending');
  const successSchedules = schedules.filter((s) => s.status === 'success');

  const totalPublishedChapters = useMemo(() => {
    const chapterIds = new Set(successSchedules.map((s) => s.chapterId));
    return chapterIds.size;
  }, [successSchedules]);

  const novel = novels.find((n) => n.id === novelId);

  const recentPublishes = useMemo(() => {
    return successSchedules
      .sort((a, b) => new Date(b.scheduledTime).getTime() - new Date(a.scheduledTime).getTime())
      .slice(0, 5)
      .map((s) => {
        const chapter = chapters.find((c) => c.id === s.chapterId);
        const info = platformInfo[s.platform];
        const timeDiff = Date.now() - new Date(s.scheduledTime).getTime();
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const timeLabel = hours < 1 ? '刚刚' : hours < 24 ? `${hours}小时前` : `${Math.floor(hours / 24)}天前`;
        return {
          chapter: chapter?.title || `第${s.chapterId}章`,
          platform: info.name,
          time: timeLabel,
          status: s.status,
        };
      });
  }, [successSchedules, chapters]);

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-ink-900">发布中心</h1>
          <p className="text-ink-600 mt-1">管理多平台发布和定时任务</p>
          {novel && <p className="text-sm text-indigo-600 mt-0.5">当前小说：{novel.title}</p>}
        </div>
      </header>

      <div className="flex gap-4 mb-6">
        <div className="flex bg-white/80 rounded-lg p-1">
          {[
            { key: 'overview', label: '总览', icon: TrendingUp },
            { key: 'schedule', label: '发布计划', icon: Calendar },
            { key: 'settings', label: '平台设置', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={clsx(
                'px-4 py-2 text-sm rounded-md transition-all flex items-center gap-2',
                activeTab === tab.key ? 'bg-indigo-600 text-white' : 'text-ink-600 hover:bg-ink-100'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-ink-200/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-ink-500">已发布章节</span>
                <BookOpen className="w-5 h-5 text-indigo-600" />
              </div>
              <p className="text-3xl font-bold text-ink-900">{totalPublishedChapters}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-ink-200/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-ink-500">总字数</span>
                <TrendingUp className="w-5 h-5 text-jade-600" />
              </div>
              <p className="text-3xl font-bold text-ink-900">
                {novel ? `${(novel.wordCount / 10000).toFixed(1)}万` : '0'}
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-ink-200/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-ink-500">待发布</span>
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-3xl font-bold text-ink-900">{pendingSchedules.length}</p>
              <p className="text-sm text-amber-600 mt-1">章节排队中</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-ink-200/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-ink-500">已连接平台</span>
                <CheckCircle className="w-5 h-5 text-jade-600" />
              </div>
              <p className="text-3xl font-bold text-ink-900">{connectedPlatforms.length}</p>
              <p className="text-sm text-ink-400 mt-1">/ {allPlatforms.length} 个平台</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-ink-200/50 p-6">
              <h3 className="text-lg font-serif font-bold text-ink-900 mb-4">平台数据</h3>
              <div className="space-y-4">
                {allPlatforms.map((platform) => {
                  const info = platformInfo[platform];
                  const isConnected = connectedPlatforms.includes(platform);
                  return (
                    <div
                      key={platform}
                      className={clsx(
                        'p-4 rounded-xl border transition-all',
                        isConnected ? 'bg-ink-50/50 border-ink-200' : 'bg-ink-50/20 border-ink-200/50'
                      )}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={clsx(
                              'w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold',
                              info.color === 'vermillion' && 'bg-vermillion-500',
                              info.color === 'jade' && 'bg-jade-500',
                              info.color === 'indigo' && 'bg-indigo-500',
                              info.color === 'amber' && 'bg-amber-500'
                            )}
                          >
                            {info.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-medium text-ink-900">{info.name}</span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {isConnected ? (
                                <>
                                  <CheckCircle className="w-3.5 h-3.5 text-jade-600" />
                                  <span className="text-xs text-jade-600">已连接</span>
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-3.5 h-3.5 text-ink-400" />
                                  <span className="text-xs text-ink-400">未连接</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleConnect(platform)}
                          className={clsx(
                            'px-3 py-1.5 text-xs rounded-lg transition-colors',
                            isConnected
                              ? 'bg-vermillion-100 text-vermillion-700 hover:bg-vermillion-200'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          )}
                        >
                          {isConnected ? '断开' : '连接'}
                        </button>
                      </div>

                      {isConnected && (
                        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-ink-200">
                          <div className="text-center">
                            <p className="text-lg font-bold text-ink-900">
                              {successSchedules.filter((s) => s.platform === platform).length}
                            </p>
                            <p className="text-xs text-ink-500">已发布</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-ink-900">
                              {pendingSchedules.filter((s) => s.platform === platform).length}
                            </p>
                            <p className="text-xs text-ink-500">待发布</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-ink-200/50 p-6">
              <h3 className="text-lg font-serif font-bold text-ink-900 mb-4">最近发布</h3>
              {recentPublishes.length === 0 ? (
                <div className="py-12 text-center">
                  <BookOpen className="w-12 h-12 text-ink-300 mx-auto mb-3" />
                  <p className="text-ink-500">暂无发布记录</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentPublishes.map((pub, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-xl bg-ink-50/50 hover:bg-ink-100/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={clsx(
                            'w-8 h-8 rounded-lg flex items-center justify-center',
                            pub.status === 'success' ? 'bg-jade-100 text-jade-600' : 'bg-vermillion-100 text-vermillion-600'
                          )}
                        >
                          {pub.status === 'success' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-ink-900">{pub.chapter}</p>
                          <p className="text-xs text-ink-500">{pub.platform}</p>
                        </div>
                      </div>
                      <span className="text-xs text-ink-400">{pub.time}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-ink-200/50">
            <div className="p-4 border-b border-ink-200 flex items-center justify-between">
              <h3 className="font-medium text-ink-900">定时发布队列</h3>
              <button
                onClick={() => setShowAddSchedule(true)}
                className="px-4 py-2 bg-vermillion-500 text-white rounded-lg hover:bg-vermillion-600 transition-colors flex items-center gap-2 text-sm"
              >
                <Plus className="w-4 h-4" />
                添加定时发布
              </button>
            </div>

            {showAddSchedule && (
              <div className="p-4 border-b border-ink-200 bg-ink-50/50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs text-ink-500 mb-1">选择章节</label>
                    <select
                      value={newScheduleChapterId}
                      onChange={(e) => setNewScheduleChapterId(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-ink-200 focus:border-indigo-400 outline-none"
                    >
                      <option value="">请选择章节</option>
                      {chapters.map((ch) => (
                        <option key={ch.id} value={ch.id}>
                          {ch.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-ink-500 mb-1">发布平台</label>
                    <select
                      value={newSchedulePlatform}
                      onChange={(e) => setNewSchedulePlatform(e.target.value as Platform)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-ink-200 focus:border-indigo-400 outline-none"
                    >
                      {allPlatforms.map((p) => (
                        <option key={p} value={p}>
                          {platformInfo[p].name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-ink-500 mb-1">发布时间</label>
                    <input
                      type="datetime-local"
                      value={newScheduleTime}
                      onChange={(e) => setNewScheduleTime(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-ink-200 focus:border-indigo-400 outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddSchedule}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                  >
                    确认添加
                  </button>
                  <button
                    onClick={() => setShowAddSchedule(false)}
                    className="px-4 py-2 bg-ink-100 text-ink-700 rounded-lg hover:bg-ink-200 text-sm"
                  >
                    取消
                  </button>
                </div>
              </div>
            )}

            <div className="divide-y divide-ink-200">
              {schedules.length === 0 ? (
                <div className="p-12 text-center">
                  <Calendar className="w-12 h-12 text-ink-300 mx-auto mb-3" />
                  <p className="text-ink-500">暂无定时发布任务</p>
                </div>
              ) : (
                schedules.map((schedule) => {
                  const info = platformInfo[schedule.platform];
                  const chapter = chapters.find((c) => c.id === schedule.chapterId);
                  const timeDiff = new Date(schedule.scheduledTime).getTime() - Date.now();
                  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
                  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

                  return (
                    <div key={schedule.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={clsx(
                            'w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold',
                            info.color === 'vermillion' && 'bg-vermillion-500',
                            info.color === 'jade' && 'bg-jade-500',
                            info.color === 'indigo' && 'bg-indigo-500',
                            info.color === 'amber' && 'bg-amber-500'
                          )}
                        >
                          {info.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-ink-900">{chapter?.title || `第${schedule.chapterId}章`}</p>
                          <p className="text-sm text-ink-500">{info.name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-sm font-medium text-ink-700">
                            {new Date(schedule.scheduledTime).toLocaleString('zh-CN', {
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                          <p className="text-xs text-ink-400">
                            {timeDiff > 0 ? `${hours}小时${minutes}分钟后` : '已过期'}
                          </p>
                        </div>

                        <span
                          className={clsx(
                            'px-2 py-0.5 text-xs rounded-full',
                            schedule.status === 'pending' && 'bg-amber-100 text-amber-700',
                            schedule.status === 'publishing' && 'bg-indigo-100 text-indigo-700',
                            schedule.status === 'success' && 'bg-jade-100 text-jade-700',
                            schedule.status === 'failed' && 'bg-vermillion-100 text-vermillion-700'
                          )}
                        >
                          {schedule.status === 'pending' && '等待中'}
                          {schedule.status === 'publishing' && '发布中'}
                          {schedule.status === 'success' && '成功'}
                          {schedule.status === 'failed' && '失败'}
                        </span>

                        <div className="flex gap-1">
                          {schedule.status === 'pending' && (
                            <>
                              <button className="p-2 hover:bg-ink-100 rounded-lg">
                                <RefreshCw className="w-4 h-4 text-ink-600" />
                              </button>
                              <button
                                onClick={() => cancelSchedule(schedule.id)}
                                className="p-2 hover:bg-vermillion-100 rounded-lg"
                              >
                                <XCircle className="w-4 h-4 text-vermillion-600" />
                              </button>
                            </>
                          )}
                          <button className="p-2 hover:bg-ink-100 rounded-lg">
                            <ExternalLink className="w-4 h-4 text-ink-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium mb-1">智能发布建议</h3>
                <p className="text-indigo-100 text-sm">根据平台数据统计，最佳发布时间为工作日 19:00-21:00</p>
              </div>
              <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                查看详情
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-ink-200/50 p-6">
            <h3 className="text-lg font-serif font-bold text-ink-900 mb-4">平台账号管理</h3>
            <p className="text-sm text-ink-600 mb-6">管理各平台的登录凭证，确保账号安全。所有敏感信息均经过加密存储。</p>

            <div className="space-y-4">
              {allPlatforms.map((platform) => {
                const info = platformInfo[platform];
                const config = configs.find((c) => c.platform === platform);
                const isConnected = config?.status === 'active';
                const isEditing = editingConfigId === config?.id;

                return (
                  <div key={platform} className="p-4 rounded-xl border border-ink-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={clsx(
                            'w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold',
                            info.color === 'vermillion' && 'bg-vermillion-500',
                            info.color === 'jade' && 'bg-jade-500',
                            info.color === 'indigo' && 'bg-indigo-500',
                            info.color === 'amber' && 'bg-amber-500'
                          )}
                        >
                          {info.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-medium text-ink-900">{info.name}</span>
                          <p className="text-xs text-ink-500">{config ? '已配置账号' : '未配置账号'}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {config && (
                          <button
                            onClick={() => handleDisconnect(platform)}
                            className="px-3 py-2 text-xs bg-vermillion-100 text-vermillion-700 rounded-lg hover:bg-vermillion-200 transition-colors"
                          >
                            删除配置
                          </button>
                        )}
                        <button
                          onClick={() => {
                            if (config) {
                              if (isEditing) {
                                handleSaveCredentials(config.id);
                              } else {
                                setEditingConfigId(config.id);
                                setEditCredentials({
                                  username: config.credentials?.username || '',
                                  token: config.credentials?.token || '',
                                });
                              }
                            } else {
                              addConfig(novelId, {
                                platform,
                                autoConvert: true,
                                syncEnabled: false,
                                status: 'active',
                              });
                            }
                          }}
                          className={clsx(
                            'px-4 py-2 text-sm rounded-lg transition-colors',
                            config
                              ? 'bg-jade-100 text-jade-700 hover:bg-jade-200'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          )}
                        >
                          {config ? (isEditing ? '保存' : '重新配置') : '添加账号'}
                        </button>
                      </div>
                    </div>

                    {config && (isEditing || !config.credentials?.username) && (
                      <div className="mt-4 pt-4 border-t border-ink-200 grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-ink-500 mb-1">用户名/手机号</label>
                          <input
                            type="text"
                            placeholder="请输入"
                            value={isEditing ? editCredentials.username : config.credentials?.username || ''}
                            onChange={(e) =>
                              isEditing
                                ? setEditCredentials((prev) => ({ ...prev, username: e.target.value }))
                                : undefined
                            }
                            readOnly={!isEditing}
                            className={clsx(
                              'w-full px-3 py-2 text-sm rounded-lg border border-ink-200 focus:border-indigo-400 outline-none',
                              !isEditing && 'bg-ink-50'
                            )}
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-ink-500 mb-1">API Token</label>
                          <input
                            type="password"
                            placeholder="请输入"
                            value={isEditing ? editCredentials.token : config.credentials?.token || ''}
                            onChange={(e) =>
                              isEditing
                                ? setEditCredentials((prev) => ({ ...prev, token: e.target.value }))
                                : undefined
                            }
                            readOnly={!isEditing}
                            className={clsx(
                              'w-full px-3 py-2 text-sm rounded-lg border border-ink-200 focus:border-indigo-400 outline-none',
                              !isEditing && 'bg-ink-50'
                            )}
                          />
                        </div>
                      </div>
                    )}

                    {config && !isEditing && config.credentials?.username && (
                      <div className="mt-4 pt-4 border-t border-ink-200 grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs text-ink-500 mb-1">用户名/手机号</label>
                          <input
                            type="text"
                            value={config.credentials.username}
                            readOnly
                            className="w-full px-3 py-2 text-sm rounded-lg border border-ink-200 bg-ink-50"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-ink-500 mb-1">API Token</label>
                          <input
                            type="password"
                            value={config.credentials.token || ''}
                            readOnly
                            className="w-full px-3 py-2 text-sm rounded-lg border border-ink-200 bg-ink-50"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-ink-200/50 p-6">
            <h3 className="text-lg font-serif font-bold text-ink-900 mb-4">发布规则</h3>
            <div className="space-y-4">
              {configs.map((config) => {
                const info = platformInfo[config.platform];
                return (
                  <div key={config.id} className="flex items-center justify-between p-4 rounded-xl bg-ink-50/50">
                    <div>
                      <p className="font-medium text-ink-900">{info.name} - 自动格式转换</p>
                      <p className="text-sm text-ink-500">自动适配各平台的格式要求</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.autoConvert}
                        onChange={(e) => updateConfig(novelId, config.id, { autoConvert: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-ink-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-ink-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                );
              })}

              {configs.length === 0 && (
                <p className="text-sm text-ink-400 py-4 text-center">请先连接平台以配置发布规则</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
