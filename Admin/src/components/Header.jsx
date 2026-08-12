import { Search, Bell, HelpCircle, Menu } from 'lucide-react';
import { useSelector } from 'react-redux';
import { UserAvatar } from './ui.jsx';

export default function Header({ onToggleMobileSidebar }) {
  const user = useSelector(s => s.auth?.user);
  const userName = user?.name || 'Dr. Sarah Chen';
  const userRole = user?.role ? user.role.replace('_', ' ').toUpperCase() : 'CLINIC ADMIN';

  return (
    <header className="h-16 border-b border-slate-100 bg-white px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs gap-2">
      {/* Left: Mobile Toggle & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 -ml-1 text-slate-600 hover:bg-slate-100 rounded-xl lg:hidden"
          title="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>

        {/* Search Input */}
        <div className="relative flex-1 max-w-xs sm:max-w-sm md:max-w-md">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search patients, doctors..."
            className="w-full pl-9 pr-3 py-1.5 sm:py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs text-slate-800 placeholder:text-slate-400 border border-slate-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-1 sm:gap-3 shrink-0">
        {/* Bell Icon */}
        <button className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
        </button>

        {/* Help Icon */}
        <button className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors hidden sm:block">
          <HelpCircle size={18} />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-2 sm:border-l border-slate-200">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-slate-800 leading-tight">{userName}</div>
            <div className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase mt-0.5">{userRole}</div>
          </div>
          <UserAvatar
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=150"
            name={userName}
            className="w-8 h-8 sm:w-9 sm:h-9"
          />
        </div>
      </div>
    </header>
  );
}

