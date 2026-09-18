import React from 'react';
import { 
  Home, 
  MapPin, 
  Bed, 
  UtensilsCrossed, 
  Landmark, 
  Compass, 
  Briefcase, 
  HelpCircle, 
  LayoutDashboard, 
  ShieldCheck,
  Sprout, 
  X,
  Scale,
  Heart,
  Database,
  Building2,
  Plus,
  ArrowLeft
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Sidebar() {
  const { 
    activePage, 
    setActivePage, 
    tripItems, 
    userRole,
    changeUserRole,
    savedFavourites,
    compareListings,
    setIsCompareModalOpen,
    isMobileSidebarOpen, 
    setIsMobileSidebarOpen,
    setShowPipelineModal
  } = useApp();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'destination', label: 'Destination Overview', icon: MapPin },
    { id: 'stays', label: 'Stays', icon: Bed },
    { id: 'food', label: 'Food', icon: UtensilsCrossed },
    { id: 'places', label: 'Places to Visit', icon: Landmark },
    { id: 'nearby', label: 'Nearby Trips', icon: Compass },
    { id: 'trip', label: 'My Trip', icon: Briefcase, count: tripItems.length },
    { id: 'help', label: 'Help Booth', icon: HelpCircle },
  ];

  const handleNavClick = (pageId) => {
    setActivePage(pageId);
    setIsMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setIsMobileSidebarOpen(false)} 
        />
      )}

      <aside 
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-[235px] bg-white text-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out border-r border-slate-200/80 shadow-xs
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand header with new Logo */}
        <div className="px-4 pt-5 pb-3">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => handleNavClick('home')} 
              className="flex flex-col items-start gap-1 text-left group w-full focus:outline-none cursor-pointer"
            >
              <div className="py-1 px-0.5 w-full flex items-center justify-start transition-all">
                <img 
                  src="/traar-logo.png" 
                  alt="TRAAR – Plan • Explore • Support Local" 
                  className="h-10 w-auto object-contain max-w-full" 
                />
              </div>
              <div className="flex items-center justify-between w-full px-0.5 pt-0.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-teal-700">
                  Plan • Explore
                </span>
                <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                  Support Local
                </span>
              </div>
            </button>
            <button 
              onClick={() => setIsMobileSidebarOpen(false)} 
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 lg:hidden ml-2 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation list */}
        <div className="px-3 flex-1 overflow-y-auto py-2 space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 pb-1">
            Menu
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`
                  w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all text-left cursor-pointer
                  ${isActive 
                    ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200/80 shadow-2xs' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}

          {/* Saved Favourites Menu Shortcut */}
          <button
            onClick={() => handleNavClick('favourites')}
            className={`
              w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all text-left cursor-pointer
              ${activePage === 'favourites' 
                ? 'bg-rose-50 text-rose-900 font-bold border border-rose-200/80 shadow-2xs' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }
            `}
          >
            <div className="flex items-center gap-3">
              <Heart className={`w-4 h-4 ${activePage === 'favourites' ? 'text-rose-600 fill-rose-500' : 'text-rose-400'}`} />
              <span>Saved Favourites</span>
            </div>
            {savedFavourites.length > 0 && (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                {savedFavourites.length}
              </span>
            )}
          </button>

          {/* Quick Shortcuts: Compare */}
          {compareListings.length > 0 && (
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 mt-1 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Scale className="w-3.5 h-3.5 text-amber-600" />
                <span>Compare Listings</span>
              </div>
              <span className="bg-amber-500 text-white font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                {compareListings.length}
              </span>
            </button>
          )}

          {/* Provider Desk Section (Strictly visible ONLY when active in provider mode) */}
          {userRole === 'provider' && (
            <div className="pt-3 mt-2 border-t border-slate-100 space-y-1">
              <div className="px-3 flex items-center justify-between pb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800">
                  Provider Desk
                </span>
                <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.2 rounded-md">Active</span>
              </div>
              
              <button
                type="button"
                onClick={() => handleNavClick('dashboard')}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all text-left cursor-pointer
                  ${activePage === 'dashboard' 
                    ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200/80 shadow-2xs' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}
              >
                <LayoutDashboard className={`w-4 h-4 ${activePage === 'dashboard' ? 'text-teal-600' : 'text-slate-400'}`} />
                <span>Provider Dashboard</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavClick('add-service')}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all text-left cursor-pointer
                  ${activePage === 'add-service' 
                    ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200/80 shadow-2xs' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}
              >
                <Plus className={`w-4 h-4 ${activePage === 'add-service' ? 'text-teal-600' : 'text-slate-400'}`} />
                <span>+ Register Service</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  changeUserRole('traveller');
                  handleNavClick('home');
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer mt-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Traveller View</span>
              </button>
            </div>
          )}

          {/* Administration Section (Only visible when active in admin mode) */}
          {userRole === 'admin' && (
            <div className="pt-3 mt-2 border-t border-slate-100 space-y-1">
              <div className="px-3 flex items-center justify-between pb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800">
                  Admin Portal
                </span>
                <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.2 rounded-md">Active</span>
              </div>
              
              <button
                type="button"
                onClick={() => handleNavClick('admin')}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all text-left cursor-pointer
                  ${activePage === 'admin' 
                    ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200/80 shadow-2xs' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }
                `}
              >
                <ShieldCheck className={`w-4 h-4 ${activePage === 'admin' ? 'text-teal-600' : 'text-lavender-600'}`} />
                <span>Administration</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  changeUserRole('traveller');
                  handleNavClick('home');
                }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer mt-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Traveller View</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer info badge */}
        <div className="p-3.5 m-3 rounded-2xl bg-teal-50/70 border border-teal-100 text-center">
          <div className="flex items-center justify-center gap-1.5 text-teal-800 text-xs font-bold mb-1">
            <Sprout className="w-3.5 h-3.5 text-teal-600" />
            <span>Support Local</span>
          </div>
          <p className="text-[11px] text-teal-700/80 leading-relaxed font-medium">
            “Plan • Explore • Support Local”
          </p>
        </div>
      </aside>
    </>
  );
}