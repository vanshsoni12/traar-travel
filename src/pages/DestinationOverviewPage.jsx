import React from 'react';
import { 
  MapPin, 
  Bed, 
  UtensilsCrossed, 
  Landmark, 
  Compass, 
  Calendar, 
  Plane, 
  Sparkles, 
  Navigation, 
  ArrowRight,
  ShieldCheck,
  Info,
  ArrowLeft,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { STAYS_DATA, FOOD_DATA, PLACES_DATA, NEARBY_TRIPS_DATA } from '../data/mockData';

export default function DestinationOverviewPage() {
  const { 
    selectedCityId, 
    selectedDestination, 
    setActivePage, 
    startingPoint,
    setStartingPointCentre,
    setStartingPointLocation,
    setStartingPointManual,
    showToast 
  } = useApp();

  const cityStays = STAYS_DATA.filter(s => s.cityId === selectedCityId);
  const cityFood = FOOD_DATA.filter(f => f.cityId === selectedCityId);
  const cityPlaces = PLACES_DATA.filter(p => p.cityId === selectedCityId);
  const cityNearby = NEARBY_TRIPS_DATA.filter(n => n.cityId === selectedCityId);

  const categories = [
    {
      id: 'stays',
      title: 'Stays',
      count: cityStays.length,
      desc: 'Hotels, hostels, PGs & local stays',
      icon: Bed,
      color: 'border-amber-200 bg-amber-50/40 hover:border-amber-400 text-amber-900',
      iconColor: 'bg-amber-500 text-white'
    },
    {
      id: 'food',
      title: 'Food & Dining',
      count: cityFood.length,
      desc: 'Authentic cuisine, cafes & dhabas',
      icon: UtensilsCrossed,
      color: 'border-orange-200 bg-orange-50/40 hover:border-orange-400 text-orange-900',
      iconColor: 'bg-orange-500 text-white'
    },
    {
      id: 'places',
      title: 'Places to Visit',
      count: cityPlaces.length,
      desc: 'Lakes, grand heritage & museums',
      icon: Landmark,
      color: 'border-blue-200 bg-blue-50/40 hover:border-blue-400 text-blue-900',
      iconColor: 'bg-blue-600 text-white'
    },
    {
      id: 'nearby',
      title: 'Nearby Trips',
      count: cityNearby.length,
      desc: 'Excursions with bus, train & cab fares',
      icon: Compass,
      color: 'border-lavender-200 bg-lavender-50/40 hover:border-lavender-400 text-lavender-900',
      iconColor: 'bg-lavender-600 text-white'
    }
  ];

  return (
    <div className="space-y-6 pb-24 max-w-6xl mx-auto">
      {/* Navigation Top Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setActivePage('home')}
          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-2xs"
          title="Back to Home"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Banner / Hero */}
      <div className="relative rounded-3xl overflow-hidden shadow-xs border border-slate-200">
        <div className="h-64 sm:h-80 w-full bg-teal-950 relative">
          <img
            src={selectedDestination.banner || selectedDestination.image}
            alt={selectedDestination.name}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-teal-950/85 via-teal-950/30 to-transparent" />

          {/* Top badges */}
          <div className="absolute top-4 left-4 sm:left-6 flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-teal-600 text-white text-xs font-bold shadow-xs">
              Verified Destination
            </span>
            <span className="px-3 py-1 rounded-full bg-teal-900/80 backdrop-blur-md text-teal-200 text-xs font-semibold border border-teal-700/50">
              Information coverage verified
            </span>
          </div>

          {/* Bottom Hero Content */}
          <div className="absolute bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white space-y-2">
            <div className="flex items-center gap-2 text-teal-300 text-xs font-semibold uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" />
              <span>{selectedDestination.state}, India</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
              {selectedDestination.name}
            </h1>
            <p className="text-sm sm:text-base text-slate-200 max-w-3xl leading-relaxed">
              {selectedDestination.description}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Info Matrix */}
      {selectedDestination.quickInfo && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2 text-teal-700 text-xs font-bold mb-1">
              <Calendar className="w-4 h-4" />
              <span>Best Time to Visit</span>
            </div>
            <p className="text-xs text-slate-700 font-semibold">{selectedDestination.quickInfo.bestTime}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2 text-teal-700 text-xs font-bold mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Languages Spoken</span>
            </div>
            <p className="text-xs text-slate-700 font-semibold">{selectedDestination.quickInfo.language}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2 text-teal-700 text-xs font-bold mb-1">
              <Landmark className="w-4 h-4" />
              <span>Famous For</span>
            </div>
            <p className="text-xs text-slate-700 font-semibold line-clamp-1">{selectedDestination.quickInfo.famousFor}</p>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2 text-teal-700 text-xs font-bold mb-1">
              <Plane className="w-4 h-4" />
              <span>Transit Hubs</span>
            </div>
            <p className="text-xs text-slate-700 font-semibold line-clamp-1">{selectedDestination.quickInfo.howToReach}</p>
          </div>
        </div>
      )}

      {/* Starting Point & Distance Engine (Image 2) */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Navigation className="w-4 h-4 text-teal-600" />
            <span>Choose how distance should be calculated:</span>
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Optional</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
          <button
            type="button"
            onClick={setStartingPointCentre}
            className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
              startingPoint.type === 'centre' 
                ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold shadow-2xs' 
                : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>Use selected city centre</span>
            {startingPoint.type === 'centre' && <Check className="w-4 h-4 text-teal-700" />}
          </button>

          <button
            type="button"
            onClick={setStartingPointLocation}
            className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
              startingPoint.type === 'location' 
                ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold shadow-2xs' 
                : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>Use my current location</span>
            {startingPoint.type === 'location' && <Check className="w-4 h-4 text-teal-700" />}
          </button>

          <button
            type="button"
            onClick={() => {
              const custom = prompt(`Enter your starting point in ${selectedDestination.name} (e.g. Bhopal Junction, Airport, Hotel):`, startingPoint.label || 'Bhopal Junction');
              if (custom) {
                setStartingPointManual(custom, selectedDestination.lat, selectedDestination.lng);
              }
            }}
            className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
              startingPoint.type === 'manual' 
                ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold shadow-2xs' 
                : 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="truncate">Enter a starting point manually</span>
            {startingPoint.type === 'manual' && <Check className="w-4 h-4 text-teal-700" />}
          </button>
        </div>

        <p className="text-[11px] text-slate-500 italic">
          Location permission is optional. You can continue browsing without sharing your location.
        </p>
      </div>

      {/* Explore Categories (Image 3) */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">
          Discover {selectedDestination.name} by Category
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActivePage(cat.id)}
                className={`p-5 rounded-3xl border text-left transition-all hover:shadow-md flex flex-col justify-between space-y-4 group ${cat.color}`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-2xl shadow-xs ${cat.iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-full text-slate-800">
                    {cat.count} listings
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-teal-900 transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-teal-800 pt-2 border-t border-slate-200/60">
                  <span>Explore Directory</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Starting Point Banner */}
      <div className="bg-teal-50 border border-teal-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-teal-600 text-white rounded-2xl shrink-0">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-teal-950">
              Active Distance Starting Point: {startingPoint.name}
            </h3>
            <p className="text-xs text-teal-800 mt-0.5">
              Live distance calculations for Stays, Dining, and Attractions are computed relative to this location.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setStartingPointCentre();
            showToast(`Reset starting point to ${selectedDestination.name} City Centre`);
          }}
          className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold shrink-0 transition-colors shadow-xs"
        >
          Reset to City Centre
        </button>
      </div>
    </div>
  );
}
