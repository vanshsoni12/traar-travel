import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Compass, 
  MapPin, 
  Car, 
  Bus, 
  Train, 
  Clock, 
  Navigation, 
  Plus, 
  Check, 
  Heart, 
  RotateCcw,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Users,
  ArrowLeft,
  Calendar,
  X
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NEARBY_TRIPS_DATA } from '../data/mockData';
import TripSummaryDrawer from '../components/common/TripSummaryDrawer';

function TripImageCarousel({ trip, isFav, toggleFavourite }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const images = trip.images && trip.images.length > 0
    ? trip.images
    : [
        trip.image,
        'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80'
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
    <div className="relative h-48 sm:h-52 bg-slate-100 overflow-hidden group rounded-t-2xl">
      <img
        src={images[currentIdx]}
        alt={trip.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
        <span className="px-2.5 py-1 rounded-md bg-lavender-500/90 backdrop-blur-xs text-white text-[11px] font-bold shadow-xs">
          {trip.distanceKm} km away
        </span>
        <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-slate-800 text-[10px] font-semibold shadow-xs flex items-center gap-1">
          <Clock className="w-3 h-3 text-lavender-500" />
          {trip.routeDuration || '1.5 hrs'}
        </span>
      </div>
      <div className="absolute top-2.5 right-2.5 flex items-center gap-1 z-10">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavourite(trip.id);
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

function NearbyTripCard({ trip, inTripMap, onAddOption, onRemoveOption, personCount, setViewDetailsItem, setWayToItem, isFav, toggleFavourite }) {
  const opts = trip.transportOptions || {};
  
  // Available modes
  const availableModes = [];
  if (opts.bus && opts.bus.available) availableModes.push('bus');
  if (opts.train && opts.train.available) availableModes.push('train');
  if (opts.car && opts.car.available) availableModes.push('car');

  const [activeMode, setActiveMode] = useState(availableModes[0] || 'bus');
  const activeOpt = opts[activeMode];
  const isSelectedModeInTrip = inTripMap[`${trip.id}-${activeMode}`];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left Column: Excursion Info (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100">
          <div>
            <TripImageCarousel 
              trip={trip} 
              isFav={isFav} 
              toggleFavourite={toggleFavourite} 
            />

            <div className="p-5 space-y-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {trip.name}
                </h3>
                <p className="text-xs text-lavender-700 font-semibold mt-0.5">
                  {trip.tagline || 'Excursion & Heritage Day Trip'}
                </p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {trip.description}
              </p>

              {trip.highlights && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {trip.highlights.map((hl, i) => (
                    <span key={i} className="text-[11px] bg-lavender-50 text-lavender-800 border border-lavender-100 px-2.5 py-0.5 rounded-full font-medium">
                      {hl}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="p-5 pt-0 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setViewDetailsItem(trip)}
              className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              View details
            </button>
            <button
              type="button"
              onClick={() => setWayToItem(trip)}
              className="px-3 py-1.5 bg-lavender-50 hover:bg-lavender-100 text-lavender-700 border border-lavender-200/80 rounded-xl text-xs font-medium transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5 text-lavender-500" />
              <span>Ways to Reach</span>
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Transit Options & Official Fares (5 cols) */}
        <div className="lg:col-span-5 p-5 bg-slate-50/50 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Public Transit Options
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Click icon to view
              </span>
            </div>

            {/* Mode selection buttons with icons */}
            <div className="grid grid-cols-3 gap-2 my-3">
              {opts.bus && (
                <button
                  type="button"
                  onClick={() => setActiveMode('bus')}
                  className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer border ${
                    activeMode === 'bus'
                      ? 'bg-lavender-500 text-white border-lavender-500 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-lavender-50/50'
                  }`}
                >
                  <Bus className="w-4 h-4" />
                  <span>Bus</span>
                </button>
              )}

              {opts.train && (
                <button
                  type="button"
                  onClick={() => setActiveMode('train')}
                  className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer border ${
                    activeMode === 'train'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50/50'
                  }`}
                >
                  <Train className="w-4 h-4" />
                  <span>Train</span>
                </button>
              )}

              {opts.car && (
                <button
                  type="button"
                  onClick={() => setActiveMode('car')}
                  className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer border ${
                    activeMode === 'car'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50/50'
                  }`}
                >
                  <Car className="w-4 h-4" />
                  <span>Taxi</span>
                </button>
              )}
            </div>

            {/* Active Mode Details Panel */}
            {activeOpt ? (
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-bold text-slate-800 capitalize">
                    {activeMode === 'car' ? 'Private Taxi / Cab' : `${activeMode} Transit`}
                  </span>
                  <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    {activeOpt.duration}
                  </span>
                </div>

                {/* Fare Breakdown */}
                <div className="py-1">
                  <span className="text-[10px] text-slate-400 block font-medium">
                    {activeMode === 'car' ? 'Flat Vehicle Fare (Whole Car)' : 'Fare per person'}
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-extrabold text-slate-900">
                      ₹{activeOpt.fare}
                    </span>
                    {activeMode !== 'car' && (
                      <span className="text-[11px] text-slate-500 font-normal">
                        / person
                      </span>
                    )}
                  </div>
                  {activeMode !== 'car' && personCount > 1 && (
                    <div className="text-[11px] text-lavender-700 font-semibold mt-0.5">
                      Total for {personCount} persons: ₹{activeOpt.fare * personCount}
                    </div>
                  )}
                  {activeMode === 'car' && (
                    <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                      Fixed vehicle tariff (up to 4 persons)
                    </div>
                  )}
                </div>

                {/* Operator and Departure Timings */}
                <div className="space-y-1 text-[11px] text-slate-600 pt-1 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Operator:</span>
                    <span className="font-semibold text-slate-800 text-right">{activeOpt.operator}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">First Departure:</span>
                    <span className="font-medium text-slate-800">{activeOpt.firstDeparture || '06:00 AM'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Last Departure:</span>
                    <span className="font-medium text-slate-800">{activeOpt.lastDeparture || '08:30 PM'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Boarding Point:</span>
                    <span className="font-medium text-slate-700 text-right truncate max-w-[140px]">{activeOpt.boardingPoint}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Arrival Point:</span>
                    <span className="font-medium text-slate-700 text-right truncate max-w-[140px]">{activeOpt.arrivalPoint}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-white rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                Transit details unavailable for this option.
              </div>
            )}
          </div>

          {/* Add Leg to Trip Button */}
          {activeOpt && (
            <button
              type="button"
              onClick={() => {
                if (isSelectedModeInTrip) {
                  onRemoveOption(`${trip.id}-${activeMode}`);
                } else {
                  onAddOption(trip, activeMode, activeOpt);
                }
              }}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs ${
                isSelectedModeInTrip
                  ? 'bg-emerald-50 text-emerald-700 hover:bg-rose-50 hover:text-rose-700 border border-emerald-300'
                  : activeMode === 'train'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : activeMode === 'car'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-lavender-500 hover:bg-lavender-700 text-white'
              }`}
            >
              {isSelectedModeInTrip ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Added {activeMode.toUpperCase()} Leg</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Add {activeMode.toUpperCase()} Leg to Trip</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NearbyTripsPage() {
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
    personCount,
    setPersonCount,
    setActivePage,
    goBack,
    searchQuery: globalSearchQuery,
    setSearchQuery: setGlobalSearchQuery,
    approvedProviderNearby = [],
    showToast
  } = useApp();

  // Combine static nearby trips with approved provider trips
  const allTripsData = useMemo(() => {
    return [...NEARBY_TRIPS_DATA, ...approvedProviderNearby];
  }, [approvedProviderNearby]);

  const [selectedDistanceRange, setSelectedDistanceRange] = useState('All');
  const [searchFilter, setSearchFilter] = useState(globalSearchQuery || '');
  const [showInPageSuggestions, setShowInPageSuggestions] = useState(false);
  const searchContainerRef = useRef(null);

  const distanceRanges = [
    { id: 'All', label: 'All Distances' },
    { id: '<50', label: '< 50 km' },
    { id: '50-100', label: '50 – 100 km' },
    { id: '100-200', label: '100 – 200 km' },
    { id: '200+', label: '200+ km' }
  ];

  // Sync with global searchQuery
  useEffect(() => {
    if (globalSearchQuery !== undefined && globalSearchQuery !== searchFilter) {
      setSearchFilter(globalSearchQuery);
    }
  }, [globalSearchQuery]);

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

  // Suggestions for nearby trips
  const nearbySuggestions = useMemo(() => {
    const trips = allTripsData.filter(n => n.cityId === selectedCityId);
    const q = (searchFilter || '').trim().toLowerCase();
    if (!q) return trips.slice(0, 5);
    return trips.filter(t => 
      t.name.toLowerCase().includes(q) || 
      (t.tagline && t.tagline.toLowerCase().includes(q)) || 
      (t.destination && t.destination.toLowerCase().includes(q))
    ).slice(0, 5);
  }, [allTripsData, selectedCityId, searchFilter]);

  const resetFilters = () => {
    setSelectedDistanceRange('All');
    setSearchFilter('');
    setGlobalSearchQuery('');
    setShowInPageSuggestions(false);
    showToast('Filters reset to default');
  };

  const filteredTrips = useMemo(() => {
    return allTripsData.filter((trip) => {
      if (trip.cityId !== selectedCityId) return false;

      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        const matchName = trip.name.toLowerCase().includes(q);
        const matchTag = trip.tagline && trip.tagline.toLowerCase().includes(q);
        const matchDesc = trip.description && trip.description.toLowerCase().includes(q);
        if (!matchName && !matchTag && !matchDesc) return false;
      }

      if (selectedDistanceRange !== 'All') {
        const d = trip.distanceKm;
        if (selectedDistanceRange === '<50' && d >= 50) return false;
        if (selectedDistanceRange === '50-100' && (d < 50 || d > 100)) return false;
        if (selectedDistanceRange === '100-200' && (d < 100 || d > 200)) return false;
        if (selectedDistanceRange === '200+' && d <= 200) return false;
      }

      return true;
    });
  }, [selectedCityId, selectedDistanceRange, searchFilter]);

  const inTripMap = useMemo(() => {
    const map = {};
    tripItems.forEach(item => {
      if (item.id) map[item.id] = true;
      if (item.sourceId) map[item.sourceId] = true;
    });
    return map;
  }, [tripItems]);

  const handleAddTransportOption = (trip, mode, opt) => {
    const isCar = mode === 'car';
    addToTrip({
      id: `${trip.id}-${mode}`,
      name: `${trip.name} (${mode.toUpperCase()} via ${opt.operator})`,
      category: 'nearby',
      mode: mode,
      price: opt.fare,
      pricePaise: opt.fare * 100,
      priceUnit: isCar ? 'vehicle rate' : 'per person',
      isPerPerson: !isCar,
      isVehicleRate: isCar,
      location: opt.arrivalPoint,
      image: trip.image,
      day: 1
    });
  };

  return (
    <div className="space-y-5 pb-20">
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
          <span className="text-slate-900 font-semibold">Nearby Trips</span>
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

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-lavender-50 text-lavender-800 border border-lavender-200/60">
              <Compass className="w-4 h-4" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Nearby Trips from {selectedDestination.name}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Verified day trips, heritage circuits, and excursions with bus, train & taxi transit breakdowns.
          </p>
        </div>

        {/* Person Count Selector */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs self-start sm:self-auto">
          <Users className="w-4 h-4 text-slate-500" />
          <span className="text-xs text-slate-600 font-medium">Persons:</span>
          <select
            value={personCount}
            onChange={(e) => setPersonCount(Number(e.target.value))}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-0.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-lavender-500 cursor-pointer"
          >
            {[1, 2, 3, 4, 5, 6, 8, 10].map(n => (
              <option key={n} value={n}>{n} {n === 1 ? 'Person' : 'Persons'}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Distance Rule Clarification */}
      <div className="bg-lavender-50/70 p-3 rounded-2xl border border-lavender-200/80 text-xs text-lavender-900 flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-lavender-500 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold">Transparent Transit Tariffs</p>
          <p className="text-[11px] text-lavender-800 leading-relaxed">
            Public bus and train tickets are calculated per person (multiplied by {personCount} {personCount === 1 ? 'person' : 'persons'}). Taxis and private cabs charge fixed vehicle rates and are <strong>not</strong> multiplied by person count.
          </p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase mr-1">Distance:</span>
            {distanceRanges.map((range) => (
              <button
                key={range.id}
                type="button"
                onClick={() => setSelectedDistanceRange(range.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedDistanceRange === range.id
                    ? 'bg-lavender-500 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[260px]" ref={searchContainerRef}>
            <input
              type="text"
              value={searchFilter}
              onFocus={() => setShowInPageSuggestions(true)}
              onChange={(e) => {
                setSearchFilter(e.target.value);
                setGlobalSearchQuery(e.target.value);
                setShowInPageSuggestions(true);
              }}
              placeholder={`Search ${selectedDestination.name} excursions...`}
              className="w-full pl-3 pr-8 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lavender-500/20 focus:border-lavender-500"
            />
            {searchFilter && (
              <button
                type="button"
                onClick={() => {
                  setSearchFilter('');
                  setGlobalSearchQuery('');
                  setShowInPageSuggestions(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* In-page Auto-Suggestions Dropdown */}
            {showInPageSuggestions && nearbySuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden max-h-64 overflow-y-auto">
                <div className="px-3 py-1.5 bg-lavender-50 border-b border-lavender-100 text-[10px] font-bold uppercase tracking-wider text-lavender-800 flex items-center justify-between">
                  <span>Excursions Auto-Suggestions</span>
                  <span className="text-[9px] opacity-70">Click to select</span>
                </div>
                {nearbySuggestions.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setSearchFilter(t.name);
                      setGlobalSearchQuery(t.name);
                      setShowInPageSuggestions(false);
                    }}
                    className="px-3.5 py-2 hover:bg-lavender-50/50 cursor-pointer border-b border-slate-50 last:border-none flex items-center justify-between transition-colors"
                  >
                    <div className="min-w-0 pr-2">
                      <p className="text-xs font-bold text-slate-800 truncate">{t.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{t.destination} • {t.distanceKm} km</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-lavender-100 text-lavender-800 shrink-0">
                      {t.distanceKm} km
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex items-start gap-6">
        <div className="flex-1 min-w-0 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Showing <strong className="text-slate-900">{filteredTrips.length}</strong> nearby destinations</span>
            <span className="text-lavender-800 bg-lavender-50/80 px-2 py-0.5 rounded-md font-semibold border border-lavender-200/60 text-[11px]">
              Excursions & Day Circuits
            </span>
          </div>

          {filteredTrips.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <Compass className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-800">
                No excursions match your criteria.
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try widening your distance filter to see all destinations around {selectedDestination.name}.
              </p>
              <button
                onClick={resetFilters}
                className="mt-2 px-4 py-2 bg-lavender-500 hover:bg-lavender-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTrips.map((trip) => (
                <NearbyTripCard
                  key={trip.id}
                  trip={trip}
                  inTripMap={inTripMap}
                  onAddOption={handleAddTransportOption}
                  onRemoveOption={removeFromTrip}
                  personCount={personCount}
                  setViewDetailsItem={setViewDetailsItem}
                  setWayToItem={setWayToItem}
                  isFav={savedFavourites.includes(trip.id)}
                  toggleFavourite={toggleFavourite}
                />
              ))}
            </div>
          )}
        </div>

        {/* Persistent Right-Side My Trip Panel */}
        <TripSummaryDrawer title="My Trip Excursions" />
      </div>
    </div>
  );
}
