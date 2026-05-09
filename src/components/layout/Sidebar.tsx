import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Globe, 
  Clock, 
  Send, 
  Settings,
  ChevronLeft,
  ChevronRight,
  PenTool,
  Sparkles
} from 'lucide-react';
import { clsx } from 'clsx';
import { useAppStore } from '../../store';

const mainNavItems = [
  { icon: LayoutDashboard, label: '仪表盘', path: '/' },
  { icon: BookOpen, label: '我的小说', path: '/novels' },
  { icon: Users, label: '角色档案', path: '/characters' },
  { icon: Globe, label: '世界观', path: '/world' },
  { icon: Clock, label: '时间线', path: '/timeline' },
  { icon: Send, label: '发布中心', path: '/publish' },
];

const bottomNavItems = [
  { icon: Settings, label: '设置', path: '/settings' },
];

export function Sidebar() {
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  return (
    <aside 
      className={clsx(
        'fixed left-0 top-0 h-full bg-ink-900 text-ink-50 transition-all duration-300 z-50',
        'flex flex-col border-r border-ink-700/50',
        sidebarCollapsed ? 'w-16' : 'w-56'
      )}
    >
      <div className="h-16 flex items-center px-4 border-b border-ink-700/50">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-vermillion-500 to-amber-400 flex items-center justify-center flex-shrink-0">
            <PenTool className="w-4 h-4 text-white" />
          </div>
          {!sidebarCollapsed && (
            <span className="font-serif text-lg font-bold whitespace-nowrap animate-fade-in">
              墨韵创作
            </span>
          )}
        </div>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {mainNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                'hover:bg-ink-800/50',
                isActive && 'bg-vermillion-500/10 text-vermillion-400 border-l-2 border-vermillion-500',
                sidebarCollapsed && 'justify-center px-2'
              )
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && (
              <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="py-4 px-2 border-t border-ink-700/50 space-y-1">
        {bottomNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                'hover:bg-ink-800/50',
                isActive && 'bg-indigo-700/30 text-indigo-300',
                sidebarCollapsed && 'justify-center px-2'
              )
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!sidebarCollapsed && (
              <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
            )}
          </NavLink>
        ))}
        
        <button
          onClick={toggleSidebar}
          className={clsx(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
            'hover:bg-ink-800/50 text-ink-400',
            sidebarCollapsed && 'justify-center px-2'
          )}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">收起</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
