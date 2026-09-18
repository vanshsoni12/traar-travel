import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Star, 
  RotateCcw, 
  Navigation, 
  Plus, 
  ShieldCheck, 
  Calendar,
  UtensilsCrossed,
  Clock,
  Check,
  Heart,
  AlertCircle,
  Users,
  ArrowLeft,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { FOOD_DATA } from '../data/mockData';
import TripSummaryDrawer from '../components/common/TripSummaryDrawer';

function FoodImageCarousel({ item, isFav, toggleFavourite }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const images = item.images && item.images.length > 0
    ? item.images
    : [
        item.image,
        item.gallery?.[0] || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
        item.gallery?.[1] || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'
      ].filter(Boolean);

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="relative h-44 bg-slate-100 overflow-hidden group">
      <img
        src={images[currentIdx]}
        alt={item.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
        <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-slate-800 text-[11px] font-bold shadow-xs">
          {item.type}
        </span>
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold shadow-xs ${
          item.isVeg ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
        }`}>
          {item.isVeg ? 'Veg' : 'Non-Veg'}
        </span>
      </div>
      <div className="absolute top-2.5 right-2.5 flex items-center gap-1 z-10">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavourite(item.id);
          }}
          className={`p-1.5 rounded-full backdrop-blur-xs transition-colors cursor-pointer ${
            isFav ? 'bg-red-500 text-white' : 'bg-slate-900/60 text-white hover:bg-slate-900'
          }`}
          title={isFav ? "Saved in favourites" : "Save favourite"}
        >
          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
        </button>
        <span className="px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-semibold backdrop-blur-xs flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          Verified
        </span>
      </div>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prevImage}
            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
            aria-label="Previous image"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={nextImage}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
            aria-label="Next image"
          >
            ›
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
            {images.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === currentIdx ? 'bg-white scale-125' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function FoodPage() {
  const { 
    selectedCityId,
    selectedDestination,
    addToTrip, 
    removeFromTrip,
    tripItems, 
    setViewDetailsItem, 
    setWayToItem,
    startingPoint,
    calculateDistance,
    savedFavourites,
    toggleFavourite,
    compareListings,
    addToCompare,
    personCount,
    setPersonCount,
    setActivePage,
    goBack,
    searchQuery,
    setSearchQuery,
    approvedProviderFood = [],
    showToast
  } = useApp();

  // Combine static food data with approved provider food listings
  const allFoodData = useMemo(() => {
    return [...FOOD_DATA, ...approvedProviderFood];
  }, [approvedProviderFood]);

  // Filter states
  const [searchFilter, setSearchFilter] = useState(searchQuery || '');
  const [showInPageSuggestions, setShowInPageSuggestions] = useState(false);
  const searchContainerRef = useRef(null);
  const [vegFilter, setVegFilter] = useState('all'); // 'all' | 'veg' | 'non-veg'
  const [selectedType, setSelectedType] = useState('All');
  const [maxCost, setMaxCost] = useState(1000);
  const [distanceLimit, setDistanceLimit] = useState('All');
  const [sortBy, setSortBy] = useState('recommended');

  const foodTypes = ['All', 'Restaurant', 'Cafe', 'Dhaba'];

  // Sync with global searchQuery (from top search header)
  useEffect(() => {
    if (searchQuery !== undefined && searchQuery !== searchFilter) {
      setSearchFilter(searchQuery);
    }
  }, [searchQuery]);

  // Click outside to close suggestion dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowInPageSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Suggestions for current city food & dining
  const foodSuggestions = useMemo(() => {
    const foods = allFoodData.filter(f => f.cityId === selectedCityId);
    const q = (searchFilter || '').trim().toLowerCase();
    if (!q) return foods.slice(0, 5);
    return foods.filter(f => 
      f.name.toLowerCase().includes(q) || 
      (f.cuisine || '').toLowerCase().includes(q) || 
      f.location.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [allFoodData, selectedCityId, searchFilter]);

  const resetFilters = () => {
    setSearchFilter('');
    setSearchQuery('');
    setVegFilter('all');
    setSelectedType('All');
    setMaxCost(1000);
    setDistanceLimit('All');
    setSortBy('recommended');
    setShowInPageSuggestions(false);
    showToast('Filters reset to default');
  };

  const filteredFood = useMemo(() => {
    return allFoodData.filter((item) => {
      if (item.cityId !== selectedCityId) return false;

      const q = searchFilter.toLowerCase();
      const matchesSearch = !q || 
        item.name.toLowerCase().includes(q) || 
        item.location.toLowerCase().includes(q) ||
        item.cuisine.toLowerCase().includes(q) ||
        (item.mustTry && item.mustTry.toLowerCase().includes(q));

      const matchesVeg = 
        vegFilter === 'all' || 
        (vegFilter === 'veg' && item.isVeg) || 
        (vegFilter === 'non-veg' && !item.isVeg);

      const matchesType = selectedType === 'All' || item.type.toLowerCase() === selectedType.toLowerCase();
      const matchesCost = item.avgCost <= maxCost;

      const dist = calculateDistance(item.lat, item.lng);
      item._calcDistance = dist;

      let matchesDistance = true;
      if (distanceLimit !== 'All') {
        matchesDistance = dist.isAvailable && dist.rawKm <= Number(distanceLimit);
      }

      return matchesSearch && matchesVeg && matchesType && matchesCost && matchesDistance;
    }).sort((a, b) => {
      if (sortBy === 'nearest') {
        return (a._calcDistance?.rawKm || 999999) - (b._calcDistance?.rawKm || 999999);
      }
      if (sortBy === 'cost-low') return a.avgCost - b.avgCost;
      if (sortBy === 'cost-high') return b.avgCost - a.avgCost;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      return 0;
    });
  }, [selectedCityId, searchFilter, vegFilter, selectedType, maxCost, distanceLimit, sortBy, startingPoint]);

  const isItemInTrip = (sourceId) => {
    return tripItems.some(item => item.sourceId === sourceId || item.id === sourceId);
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Breadcrumb Navigation (Image 1 & 4) */}
      <div>
        <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <button 
            type="button" 
            onClick={() => setActivePage('home')}
            className="hover:text-teal-700 cursor-pointer"
          >
            Home
          </button>
          <span>&gt;</span>
          <button 
            type="button" 
            onClick={() => setActivePage('destination')}
            className="hover:text-teal-700 cursor-pointer font-medium"
          >
            {selectedDestination.name}
          </button>
          <span>&gt;</span>
          <span className="text-slate-900 font-semibold">Food & Dining</span>
        </nav>

        {/* Back Button directly below breadcrumbs (returns to Bhopal destination page) */}
        <div className="mt-2.5">
          <button
            type="button"
            onClick={() => setActivePage('destination')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            title={`Back to ${selectedDestination.name}`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1 rounded-md bg-orange-50 text-orange-800 border border-orange-200/60">
              <UtensilsCrossed className="w-4 h-4" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Food & Dining in {selectedDestination.name}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Local restaurants, tea stalls, bakeries, and culinary heritage with verified per-person averages.
          </p>
        </div>

        {/* Person Count Selector */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs self-start sm:self-auto">
          <Users className="w-4 h-4 text-slate-500" />
          <span className="text-xs text-slate-600 font-medium">Persons:</span>
          <select
            value={personCount}
            onChange={(e) => setPersonCount(Number(e.target.value))}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500 cursor-pointer"
          >
            {[1, 2, 3, 4, 5, 6, 8, 10].map(n => (
              <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'Persons'}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search dining by name, cuisine, or dish with Auto-Suggestions */}
          <div className="lg:col-span-2 relative" ref={searchContainerRef}>
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchFilter}
              onFocus={() => setShowInPageSuggestions(true)}
              onChange={(e) => {
                setSearchFilter(e.target.value);
                setSearchQuery(e.target.value);
                setShowInPageSuggestions(true);
              }}
              placeholder={`Search ${selectedDestination.name} dining, cuisine, or dish...`}
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500"
            />
            {searchFilter && (
              <button
                type="button"
                onClick={() => {
                  setSearchFilter('');
                  setSearchQuery('');
                  setShowInPageSuggestions(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* In-page Auto-Suggestions Dropdown */}
            {showInPageSuggestions && foodSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden max-h-64 overflow-y-auto">
                <div className="px-3 py-1.5 bg-orange-50 border-b border-orange-100 text-[10px] font-bold uppercase tracking-wider text-orange-800 flex items-center justify-between">
                  <span>Dining Auto-Suggestions</span>
                  <span className="text-[9px] opacity-70">Click to select</span>
                </div>
                {foodSuggestions.map((f) => (
                  <div
                    key={f.id}
                    onClick={() => {
                      setSearchFilter(f.name);
                      setSearchQuery(f.name);
                      setShowInPageSuggestions(false);
                    }}
                    className="px-3.5 py-2 hover:bg-orange-50/50 cursor-pointer border-b border-slate-50 last:border-none flex items-center justify-between transition-colors"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold text-slate-800 truncate">{f.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{f.location} • ₹{f.avgCost.toLocaleString('en-IN')} avg cost</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 shrink-0">
                      {f.cuisine || f.type}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <select
              value={vegFilter}
              onChange={(e) => setVegFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-none"
            >
              <option value="all">Diet: All Dining</option>
              <option value="veg">Vegetarian Only</option>
              <option value="non-veg">Non-Vegetarian</option>
            </select>
          </div>

          <div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-none"
            >
              <option value="All">All Types</option>
              <option value="Restaurant">Restaurant</option>
              <option value="Cafe">Cafe</option>
              <option value="Dhaba">Dhaba / Street</option>
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-medium focus:outline-none"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="nearest" disabled={startingPoint.status !== 'active'}>
                Nearest first {startingPoint.status !== 'active' ? '(Need Starting Point)' : ''}
              </option>
              <option value="cost-low">Cost: Low to High</option>
              <option value="cost-high">Cost: High to Low</option>
              <option value="rating">Rating: Highest</option>
            </select>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">Active:</span>
            {vegFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[11px]">
                {vegFilter === 'veg' ? 'Veg Only' : 'Non-Veg'}
                <button onClick={() => setVegFilter('all')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedType !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-800 border border-orange-200 font-semibold text-[11px]">
                {selectedType}
                <button onClick={() => setSelectedType('All')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {searchFilter && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 border border-slate-200 font-semibold text-[11px]">
                "{searchFilter}"
                <button onClick={() => setSearchFilter('')}><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>

          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-900 font-medium text-[11px] cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset filters</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col xl:flex-row items-start gap-6">
        <div className="w-full flex-1 min-w-0">
          <div className="flex items-center justify-between mb-3 text-xs text-slate-500 font-medium">
            <span>Showing <strong className="text-slate-900">{filteredFood.length}</strong> verified culinary spots</span>
            <span className="text-orange-800 bg-orange-50/80 px-2 py-0.5 rounded-md font-semibold border border-orange-200/60 text-[11px]">
              Food & Dining
            </span>
          </div>

          {filteredFood.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <UtensilsCrossed className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                No matching dining spots found.
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your price range or clearing diet filters in {selectedDestination.name}.
              </p>
              <button
                onClick={resetFilters}
                className="mt-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
              {filteredFood.map((item) => {
                const inTrip = isItemInTrip(item.id);
                const isFav = savedFavourites.includes(item.id);
                const isCompared = compareListings.some(l => l.id === item.id);
                const dist = item._calcDistance || calculateDistance(item.lat, item.lng);

                const totalCostForGroup = (item.avgCost || 0) * personCount;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Food Image Carousel */}
                      <FoodImageCarousel
                        item={item}
                        isFav={isFav}
                        toggleFavourite={toggleFavourite}
                      />

                      <div className="p-4">
                        <h3 className="text-base font-bold text-slate-900 leading-snug">
                          {item.name}
                        </h3>

                        <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{item.location}</span>
                        </div>

                        {/* Distance Label */}
                        <div className="text-[11px] font-medium text-teal-800 bg-teal-50/70 px-2 py-0.5 rounded mb-2 inline-block border border-teal-100">
                          {dist.isAvailable ? dist.formattedLabel : 'Distance unavailable'}
                        </div>

                        {/* Price & Rating */}
                        <div className="py-2 border-y border-slate-100 my-2 space-y-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-lg font-black text-slate-900">
                                ₹{totalCostForGroup.toLocaleString()}
                              </span>
                              <span className="text-[11px] text-slate-500 ml-1">
                                {personCount > 1 ? `total (${personCount} persons)` : `/ person`}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 text-xs font-bold text-slate-800 bg-orange-50 px-2 py-1 rounded-lg border border-orange-100">
                              <Star className="w-3 h-3 fill-orange-500 text-orange-500" />
                              <span>{item.rating}</span>
                              <span className="text-slate-400 font-normal">({item.reviewsCount})</span>
                            </div>
                          </div>

                          <div className="text-[10px] text-slate-400 flex items-center justify-between">
                            <span>₹{item.avgCost.toLocaleString()} / person</span>
                            <span className="truncate max-w-[150px]">{item.cuisine}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Updated {item.updatedDate}
                          </span>

                          <label className="flex items-center gap-1 cursor-pointer text-slate-600 hover:text-slate-900">
                            <input
                              type="checkbox"
                              checked={isCompared}
                              onChange={() => addToCompare(item)}
                              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-3 h-3 cursor-pointer"
                            />
                            <span>Compare</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setViewDetailsItem(item)}
                          className="py-2 px-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors text-center cursor-pointer"
                        >
                          View details
                        </button>
                        
                        <button
                          onClick={() => inTrip ? removeFromTrip(item.id) : addToTrip(item, 'Food')}
                          className={`
                            py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer
                            ${inTrip ? 'bg-teal-700 text-white hover:bg-rose-700' : 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs'}
                          `}
                          title={inTrip ? "Click to remove from trip" : "Click to add to trip"}
                        >
                          {inTrip ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add to trip</span>
                            </>
                          )}
                        </button>
                      </div>

                      <button
                        onClick={() => setWayToItem(item)}
                        className="w-full py-1.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 border border-slate-200/60 cursor-pointer"
                      >
                        <Navigation className="w-3.5 h-3.5 text-orange-600" />
                        <span>Ways to Reach</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <TripSummaryDrawer title="My Trip Food" />
      </div>
    </div>
  );
}
