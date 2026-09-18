import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Bell, 
  Briefcase, 
  MapPin, 
  Menu, 
  Database,
  Navigation,
  Heart,
  Scale,
  UserCheck,
  ChevronDown,
  X,
  Bed,
  UtensilsCrossed,
  Landmark,
  Compass,
  Sparkles,
  ArrowRight,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DESTINATIONS, STAYS_DATA, FOOD_DATA, PLACES_DATA, NEARBY_TRIPS_DATA } from '../../data/mockData';

export default function TopHeader() {
  const { 
    activePage, 
    setActivePage, 
    tripItems, 
    searchQuery, 
    setSearchQuery, 
    setIsMobileSidebarOpen, 
    selectedCityId,
    setSelectedCityId,
    selectedDestination,
    startingPoint,
    setStartingPointCentre,
    setStartingPointLocation,
    setStartingPointManual,
    clearStartingPoint,
    userRole,
    setUserRole,
    changeUserRole,
    savedFavourites,
    compareListings,
    setIsCompareModalOpen,
    budgetCalculations, 
    approvedProviderStays = [],
    approvedProviderFood = [],
    approvedProviderPlaces = [],
    approvedProviderNearby = [],
    showToast,
    setShowPipelineModal
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showStartingPointModal, setShowStartingPointModal] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowSearchSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const notifications = [
    {
      id: 1,
      title: 'Bhopal & Jaipur Live with Verified Tariffs',
      time: '10m ago',
      desc: 'All verified listings and transport fares refreshed.',
    },
    {
      id: 2,
      title: 'Transport Fares Refreshed',
      time: '1h ago',
      desc: 'Bhopal to Sanchi and Bhojpur bus timetables verified.',
    }
  ];

  // Dynamic context-aware search suggestions based on which page we are on
  const getPageSuggestions = () => {
    const q = (searchQuery || '').trim().toLowerCase();

    if (activePage === 'stays') {
      const allStays = [...STAYS_DATA, ...approvedProviderStays];
      const stays = allStays.filter(s => s.cityId === selectedCityId);
      const filtered = q 
        ? stays.filter(s => s.name.toLowerCase().includes(q) || s.location.toLowerCase().includes(q) || (s.type || '').toLowerCase().includes(q))
        : stays;
      return {
        title: `Stays in ${selectedDestination.name}`,
        icon: Bed,
        accent: 'text-amber-700 bg-amber-50 border-amber-200',
        badgeBg: 'bg-amber-500 text-white',
        items: filtered.slice(0, 5).map(s => ({
          id: s.id,
          title: s.name,
          subtitle: `${s.location} • ₹${(s.price || 0).toLocaleString('en-IN')}/night`,
          tag: s.type || 'Stay',
          page: 'stays'
        }))
      };
    }

    if (activePage === 'food') {
      const allFood = [...FOOD_DATA, ...approvedProviderFood];
      const food = allFood.filter(f => f.cityId === selectedCityId);
      const filtered = q 
        ? food.filter(f => f.name.toLowerCase().includes(q) || (f.cuisine || '').toLowerCase().includes(q) || f.location.toLowerCase().includes(q))
        : food;
      return {
        title: `Food & Dining in ${selectedDestination.name}`,
        icon: UtensilsCrossed,
        accent: 'text-orange-700 bg-orange-50 border-orange-200',
        badgeBg: 'bg-orange-500 text-white',
        items: filtered.slice(0, 5).map(f => ({
          id: f.id,
          title: f.name,
          subtitle: `${f.location} • ₹${(f.avgCost || 0).toLocaleString('en-IN')} avg`,
          tag: f.cuisine || f.type || 'Dining',
          page: 'food'
        }))
      };
    }

    if (activePage === 'places') {
      const allPlaces = [...PLACES_DATA, ...approvedProviderPlaces];
      const places = allPlaces.filter(p => p.cityId === selectedCityId);
      const filtered = q 
        ? places.filter(p => p.name.toLowerCase().includes(q) || (p.category || '').toLowerCase().includes(q) || p.location.toLowerCase().includes(q))
        : places;
      return {
        title: `Places to Visit in ${selectedDestination.name}`,
        icon: Landmark,
        accent: 'text-blue-700 bg-blue-50 border-blue-200',
        badgeBg: 'bg-blue-600 text-white',
        items: filtered.slice(0, 5).map(p => ({
          id: p.id,
          title: p.name,
          subtitle: `${p.location} • ${p.entryFee === 0 ? 'Free Entry' : `₹${p.entryFee} entry`}`,
          tag: p.category || 'Sight',
          page: 'places'
        }))
      };
    }

    if (activePage === 'nearby') {
      const allNearby = [...NEARBY_TRIPS_DATA, ...approvedProviderNearby];
      const trips = allNearby.filter(n => n.cityId === selectedCityId);
      const filtered = q 
        ? trips.filter(t => t.name.toLowerCase().includes(q) || (t.destination || '').toLowerCase().includes(q) || (t.tagline || '').toLowerCase().includes(q))
        : trips;
      return {
        title: `Nearby Trips from ${selectedDestination.name}`,
        icon: Compass,
        accent: 'text-lavender-700 bg-lavender-50 border-lavender-200',
        badgeBg: 'bg-lavender-600 text-white',
        items: filtered.slice(0, 5).map(t => ({
          id: t.id,
          title: t.name,
          subtitle: `${t.distanceKm || 40} km • ${t.bestTransit || 'Verified Transit'} available`,
          tag: `${t.distanceKm || 40} km`,
          page: 'nearby'
        }))
      };
    }

    if (activePage === 'home') {
      // On Home page: suggest destinations first, then popular highlights
      const destMatches = DESTINATIONS.filter(d => 
        !q || d.name.toLowerCase().includes(q) || d.state.toLowerCase().includes(q)
      ).map(d => ({
        id: `dest-${d.id}`,
        cityId: d.id,
        title: d.name,
        subtitle: `${d.state} • ${d.quickInfo?.famousFor || 'Popular Destination'}`,
        tag: 'Destination',
        page: 'destination',
        icon: MapPin
      }));

      const stays = STAYS_DATA.filter(s => !q || s.name.toLowerCase().includes(q) || s.location.toLowerCase().includes(q)).slice(0, 2).map(s => ({
        id: s.id,
        title: s.name,
        subtitle: `${s.location} • ₹${s.price.toLocaleString('en-IN')}`,
        tag: 'Stay',
        page: 'stays',
        icon: Bed
      }));

      const places = PLACES_DATA.filter(p => !q || p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q)).slice(0, 2).map(p => ({
        id: p.id,
        title: p.name,
        subtitle: `${p.location} • ${p.category}`,
        tag: 'Place',
        page: 'places',
        icon: Landmark
      }));

      const items = [...destMatches, ...stays, ...places].slice(0, 6);

      return {
        title: q ? `Search Results for "${q}"` : 'Popular Destinations & Listings',
        icon: Sparkles,
        accent: 'text-teal-700 bg-teal-50 border-teal-200',
        badgeBg: 'bg-teal-600 text-white',
        items
      };
    }

    // Default for 'destination' (DestinationOverviewPage)
    const categoryShortcuts = [
      { id: 'cat-stays', title: `Stays in ${selectedDestination.name}`, subtitle: 'Hotels, hostels, PGs & guest houses', tag: 'Category', page: 'stays', icon: Bed },
      { id: 'cat-food', title: `Food & Dining in ${selectedDestination.name}`, subtitle: 'Authentic cuisines, cafes & dhabas', tag: 'Category', page: 'food', icon: UtensilsCrossed },
      { id: 'cat-places', title: `Places to Visit in ${selectedDestination.name}`, subtitle: 'Lakes, grand heritage, viewpoints', tag: 'Category', page: 'places', icon: Landmark },
      { id: 'cat-nearby', title: `Nearby Trips from ${selectedDestination.name}`, subtitle: 'Sanchi, Bhimbetka, day excursions', tag: 'Category', page: 'nearby', icon: Compass },
    ];

    const matchedShortcuts = q 
      ? categoryShortcuts.filter(c => c.title.toLowerCase().includes(q) || c.subtitle.toLowerCase().includes(q))
      : categoryShortcuts;

    const stays = STAYS_DATA.filter(s => s.cityId === selectedCityId && (!q || s.name.toLowerCase().includes(q))).slice(0, 2).map(s => ({
      id: s.id,
      title: s.name,
      subtitle: `${s.location} • ₹${s.price.toLocaleString('en-IN')}`,
      tag: 'Stay',
      page: 'stays',
      icon: Bed
    }));

    const places = PLACES_DATA.filter(p => p.cityId === selectedCityId && (!q || p.name.toLowerCase().includes(q))).slice(0, 2).map(p => ({
      id: p.id,
      title: p.name,
      subtitle: `${p.location} • ${p.category}`,
      tag: 'Place',
      page: 'places',
      icon: Landmark
    }));

    const combined = [...matchedShortcuts, ...stays, ...places].slice(0, 6);

    return {
      title: `${selectedDestination.name} Travel Directory`,
      icon: Search,
      accent: 'text-teal-700 bg-teal-50 border-teal-200',
      badgeBg: 'bg-teal-600 text-white',
      items: combined
    };
  };

  const getSearchPlaceholder = () => {
    if (activePage === 'stays') return `Search ${selectedDestination.name} hotels, hostels, PGs...`;
    if (activePage === 'food') return `Search ${selectedDestination.name} restaurants, food, dishes...`;
    if (activePage === 'places') return `Search ${selectedDestination.name} lakes, heritage, monuments...`;
    if (activePage === 'nearby') return `Search ${selectedDestination.name} excursions & nearby trips...`;
    if (activePage === 'home') return `Search destinations, stays, attractions...`;
    return `Search ${selectedDestination.name} stays, food, places, routes...`;
  };

  const handleSelectSuggestion = (item) => {
    if (item.cityId) {
      setSelectedCityId(item.cityId);
    }
    setSearchQuery(item.tag === 'Category' ? '' : item.title);
    setShowSearchSuggestions(false);
    if (item.page && item.page !== activePage) {
      setActivePage(item.page);
    }
    showToast(`Viewing: ${item.title}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setShowSearchSuggestions(false);
    const q = searchQuery.toLowerCase();
    if (q.includes('hotel') || q.includes('stay') || q.includes('hostel') || q.includes('pg')) {
      setActivePage('stays');
    } else if (q.includes('food') || q.includes('cafe') || q.includes('restaurant') || q.includes('poha')) {
      setActivePage('food');
    } else if (q.includes('lake') || q.includes('place') || q.includes('visit') || q.includes('temple')) {
      setActivePage('places');
    } else if (q.includes('sanchi') || q.includes('nearby') || q.includes('bhimbetka') || q.includes('ajmer')) {
      setActivePage('nearby');
    }
  };

  const handleManualStartingSubmit = (e) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    setStartingPointManual(manualInput, selectedDestination.lat, selectedDestination.lng);
    setShowStartingPointModal(false);
    showToast(`Starting point set to "${manualInput}"`);
    setManualInput('');
  };

  const currentSuggestions = getPageSuggestions();
  const HeaderCategoryIcon = currentSuggestions.icon;

  return (
    <>
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/80 h-16 flex items-center px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="flex items-center justify-between w-full gap-3">
          {/* Left: Mobile hamburger, Destination Badge & Starting Point */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)} 
              className="p-2 -ml-1 text-slate-600 rounded-lg lg:hidden hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Active Destination Selector Indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-teal-50 border border-teal-200/70 rounded-full text-xs font-medium text-teal-900">
              <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <select
                value={selectedCityId}
                onChange={(e) => {
                  setSelectedCityId(e.target.value);
                  showToast(`Switched active destination to ${e.target.value.toUpperCase()}`);
                }}
                className="bg-transparent font-bold text-slate-900 focus:outline-none cursor-pointer pr-1"
              >
                <option value="bhopal">Bhopal, MP</option>
                <option value="jaipur">Jaipur, RJ</option>
                <option value="udaipur">Udaipur, RJ</option>
              </select>
            </div>

            {/* Starting Point Indicator */}
            <button
              onClick={() => setShowStartingPointModal(true)}
              className="hidden xl:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 rounded-full text-xs font-medium text-slate-700 transition-colors cursor-pointer"
              title="Change distance calculation origin"
            >
              <Navigation className="w-3 h-3 text-teal-600 shrink-0" />
              <span className="text-[11px] text-slate-500">From:</span>
              <span className="font-semibold text-slate-800 truncate max-w-[130px]">
                {startingPoint.status === 'active' ? startingPoint.label : 'None'}
              </span>
            </button>
          </div>

          {/* Center: Search input with Context-Aware Auto-Suggestions */}
          <div className="flex-1 max-w-md mx-2 relative" ref={searchContainerRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setShowSearchSuggestions(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchSuggestions(true);
                }}
                placeholder={getSearchPlaceholder()}
                className="w-full pl-9 pr-8 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setShowSearchSuggestions(false);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>

            {/* Dynamic Auto-Suggestions Popover based on current page */}
            {showSearchSuggestions && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden max-h-80 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                <div className={`px-3 py-2 border-b text-[11px] font-bold uppercase tracking-wider flex items-center justify-between ${currentSuggestions.accent}`}>
                  <div className="flex items-center gap-1.5">
                    <HeaderCategoryIcon className="w-3.5 h-3.5" />
                    <span>{currentSuggestions.title}</span>
                  </div>
                  <span className="text-[10px] opacity-80 lowercase font-medium">page suggestions</span>
                </div>

                {currentSuggestions.items.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No suggestions found for "{searchQuery}"
                  </div>
                ) : (
                  currentSuggestions.items.map((item) => {
                    const ItemIcon = item.icon || HeaderCategoryIcon;
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleSelectSuggestion(item)}
                        className="px-3.5 py-2.5 hover:bg-slate-50 border-b border-slate-50 last:border-none cursor-pointer flex items-center justify-between transition-colors group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-teal-50 text-slate-600 group-hover:text-teal-700 shrink-0 transition-colors">
                            <ItemIcon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-900 group-hover:text-teal-700 truncate transition-colors">
                              {item.title}
                            </p>
                            <p className="text-[11px] text-slate-500 truncate">
                              {item.subtitle}
                            </p>
                          </div>
                        </div>

                        {item.tag && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 shrink-0 ml-2">
                            {item.tag}
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Right side controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Role Switcher Pills (Desktop & Tablet: Instant 1-Click Access) */}
            <div className="hidden sm:flex items-center bg-slate-100/90 p-1 rounded-2xl border border-slate-200/80 text-xs shadow-2xs">
              <button
                type="button"
                onClick={() => {
                  changeUserRole('traveller');
                  showToast('Active Portal: Traveller View');
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  userRole === 'traveller' 
                    ? 'bg-white text-slate-900 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                <span>👤 Traveller</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  changeUserRole('provider');
                  setActivePage('dashboard');
                  showToast('Active Portal: Provider Desk');
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  userRole === 'provider' 
                    ? 'bg-teal-600 text-white shadow-xs' 
                    : 'text-slate-600 hover:text-teal-800 hover:bg-teal-50'
                }`}
              >
                <span>🏨 Provider Portal</span>
                {userRole === 'provider' && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  changeUserRole('admin');
                  setActivePage('admin');
                  showToast('Active Portal: Administrator Desk');
                }}
                className={`px-2.5 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1 cursor-pointer ${
                  userRole === 'admin' 
                    ? 'bg-lavender-600 text-white shadow-xs' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
                title="Administration moderation desk"
              >
                <span>🛡️ Admin</span>
              </button>
            </div>

            {/* Mobile Dropdown Fallback */}
            <div className={`sm:hidden flex items-center rounded-xl p-0.5 border text-xs transition-colors ${
              userRole === 'provider' 
                ? 'bg-teal-50 border-teal-300' 
                : userRole === 'admin' 
                  ? 'bg-lavender-50 border-lavender-300' 
                  : 'bg-slate-100 border-slate-200'
            }`}>
              <select
                value={userRole}
                onChange={(e) => {
                  const newRole = e.target.value;
                  changeUserRole(newRole);
                  if (newRole === 'provider') setActivePage('dashboard');
                  else if (newRole === 'admin') setActivePage('admin');
                  showToast(`Switched active portal to ${newRole.toUpperCase()} mode`);
                }}
                className={`bg-transparent text-xs font-bold px-2 py-1 focus:outline-none cursor-pointer ${
                  userRole === 'provider' ? 'text-teal-900' : userRole === 'admin' ? 'text-lavender-900' : 'text-slate-700'
                }`}
                title="Switch portal view"
              >
                <option value="traveller">👤 Traveller</option>
                <option value="provider">🏨 Provider Portal</option>
                <option value="admin">🛡️ Administrator</option>
              </select>
            </div>

            {/* Quick Provider Add Service Shortcut when in Provider Mode */}
            {userRole === 'provider' && (
              <button
                type="button"
                onClick={() => setActivePage('add-service')}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                title="Register a new service"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Service</span>
              </button>
            )}

            {/* Compare Shortcut */}
            {compareListings.length > 0 && (
              <button
                onClick={() => setIsCompareModalOpen(true)}
                className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg bg-amber-50 border border-amber-200 text-xs font-bold flex items-center gap-1"
                title="Compare Listings"
              >
                <Scale className="w-4 h-4 text-amber-700" />
                <span>{compareListings.length}</span>
              </button>
            )}

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)} 
                className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                    <span className="text-xs font-semibold text-slate-900">Platform Notifications</span>
                    <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600 text-xs">
                      Close
                    </button>
                  </div>
                  <div className="space-y-2">
                    {notifications.map(n => (
                      <div key={n.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100/80 text-xs">
                        <span className="font-bold text-slate-800 block">{n.title}</span>
                        <p className="text-slate-500 mt-0.5 leading-relaxed">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* My Trip Shortcut */}
            <button
              onClick={() => setActivePage('trip')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activePage === 'trip' 
                  ? 'bg-teal-700 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span className="hidden md:inline">My Trip</span>
              <span className={`text-xs px-1.5 py-0.2 rounded-full font-bold ${
                activePage === 'trip' ? 'bg-white text-teal-800' : 'bg-teal-600 text-white'
              }`}>
                {tripItems.length}
              </span>
            </button>

            {/* Profile Avatar */}
            <button 
              onClick={() => setShowProfileModal(true)} 
              className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-800 text-white font-semibold text-xs border-2 border-teal-200/50 hover:bg-teal-900 transition-colors shadow-xs"
              title="User Profile & Settings"
            >
              VS
            </button>
          </div>
        </div>

        {/* Profile Modal */}
        {showProfileModal && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-slate-900">User Profile</h3>
                <button onClick={() => setShowProfileModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-4 border border-slate-100">
                <div className="w-10 h-10 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-sm">
                  VS
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Vansh Soni</p>
                  <p className="text-xs text-slate-500">Active Role: <strong className="text-teal-700 uppercase">{userRole}</strong></p>
                </div>
              </div>
              <div className="text-xs text-slate-600 space-y-2 mb-5">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Selected City</span>
                  <span className="font-medium text-slate-800">{selectedDestination.name}, {selectedDestination.state}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span>Starting Point</span>
                  <span className="font-medium text-slate-800 truncate max-w-[150px]">{startingPoint.label}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span>Saved Favourites</span>
                  <span className="font-medium text-teal-700">{savedFavourites.length} items ❤️</span>
                </div>
              </div>
              <button
                onClick={() => setShowProfileModal(false)}
                className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Starting Point Modal (Section 26) */}
        {showStartingPointModal && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2 text-teal-800 font-bold">
                  <Navigation className="w-4 h-4" />
                  <span>Choose Starting Point</span>
                </div>
                <button onClick={() => setShowStartingPointModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Choose how distance should be calculated to stays, food, and attractions. Location access is completely optional.
              </p>

              <div className="space-y-2.5 text-xs">
                {/* Option 1: City Centre */}
                <button
                  onClick={() => {
                    setStartingPointCentre();
                    setShowStartingPointModal(false);
                    showToast(`Starting point set to ${selectedDestination.name} City Centre`);
                  }}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between ${
                    startingPoint.type === 'centre' ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>
                    <span className="block font-semibold">Use selected city centre</span>
                    <span className="text-[11px] text-slate-500">Center coordinates of {selectedDestination.name}</span>
                  </div>
                  {startingPoint.type === 'centre' && <span className="text-teal-700 font-bold">✓ Active</span>}
                </button>

                {/* Option 2: Device Location */}
                <button
                  onClick={() => {
                    setStartingPointLocation();
                    setShowStartingPointModal(false);
                  }}
                  className={`w-full p-3 rounded-xl border text-left flex items-center justify-between ${
                    startingPoint.type === 'location' ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold' : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div>
                    <span className="block font-semibold">Use my current location</span>
                    <span className="text-[11px] text-slate-500">Browser GPS (Will not change selected city)</span>
                  </div>
                  {startingPoint.type === 'location' && <span className="text-teal-700 font-bold">✓ Active</span>}
                </button>

                {/* Option 3: Manual Input */}
                <form onSubmit={handleManualStartingSubmit} className="pt-2 border-t border-slate-100">
                  <label className="block font-bold text-slate-700 mb-1">Enter a starting point manually</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={manualInput}
                      onChange={(e) => setManualInput(e.target.value)}
                      placeholder="e.g. Bhopal Junction, Airport, Hotel..."
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold"
                    >
                      Set
                    </button>
                  </div>
                </form>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
                <button
                  onClick={() => {
                    clearStartingPoint();
                    setShowStartingPointModal(false);
                    showToast('Starting point cleared.');
                  }}
                  className="text-slate-400 hover:text-red-600"
                >
                  Skip / Clear Starting Point
                </button>
                <button
                  onClick={() => setShowStartingPointModal(false)}
                  className="px-4 py-1.5 bg-slate-100 text-slate-700 font-semibold rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}