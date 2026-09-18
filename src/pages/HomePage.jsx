import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  ArrowRight, 
  MapPin, 
  Info, 
  Wallet, 
  Sparkles, 
  Search,
  X,
  Building2,
  ShieldCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DESTINATIONS } from '../data/mockData';

// Comprehensive list of Indian States & Union Territories for instant auto-suggestion
const INDIAN_STATES = [
  { state: 'Madhya Pradesh', code: 'MP', popularCities: ['Bhopal', 'Indore', 'Gwalior', 'Ujjain', 'Jabalpur', 'Khajuraho'], highlights: 'Heart of India • Lakes, Sanchi Stupa, Heritage' },
  { state: 'Rajasthan', code: 'RJ', popularCities: ['Jaipur', 'Udaipur', 'Jodhpur', 'Jaisalmer', 'Pushkar'], highlights: 'Land of Kings • Forts, Palaces, Desert Safaris' },
  { state: 'Uttar Pradesh', code: 'UP', popularCities: ['Varanasi', 'Agra', 'Lucknow', 'Ayodhya', 'Mathura'], highlights: 'Taj Mahal, Kashi Ghats, Heritage & Culture' },
  { state: 'Maharashtra', code: 'MH', popularCities: ['Mumbai', 'Pune', 'Nashik', 'Mahabaleshwar', 'Aurangabad'], highlights: 'Gateway of India, Western Ghats, Ajanta Ellora' },
  { state: 'Gujarat', code: 'GJ', popularCities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rann of Kutch', 'Gir'], highlights: 'White Desert, Statue of Unity, Asiatic Lions' },
  { state: 'Karnataka', code: 'KA', popularCities: ['Bengaluru', 'Mysuru', 'Hampi', 'Coorg', 'Gokarna'], highlights: 'Silicon Valley, Mysore Palace, Vijayanagara Ruins' },
  { state: 'Kerala', code: 'KL', popularCities: ['Kochi', 'Munnar', 'Alleppey', 'Wayanad', 'Varkala'], highlights: "God's Own Country • Backwaters & Tea Plantations" },
  { state: 'Tamil Nadu', code: 'TN', popularCities: ['Chennai', 'Madurai', 'Ooty', 'Kodaikanal', 'Rameswaram'], highlights: 'Dravidian Temples, Nilgiri Hills, Marina Beach' },
  { state: 'Goa', code: 'GA', popularCities: ['Panaji', 'North Goa', 'South Goa', 'Calangute'], highlights: 'Sun, Sand, Beaches & Portuguese Architecture' },
  { state: 'Himachal Pradesh', code: 'HP', popularCities: ['Shimla', 'Manali', 'Dharamshala', 'Spiti Valley'], highlights: 'Snow Peaks, Valleys, Monasteries & Adventure' },
  { state: 'Uttarakhand', code: 'UK', popularCities: ['Rishikesh', 'Haridwar', 'Nainital', 'Mussoorie', 'Dehradun'], highlights: 'Yoga Capital, Ganga Aarti & Himalayan Treks' },
  { state: 'Delhi', code: 'DL', popularCities: ['New Delhi', 'Old Delhi'], highlights: 'National Capital, Red Fort, India Gate, Cuisine' },
  { state: 'West Bengal', code: 'WB', popularCities: ['Kolkata', 'Darjeeling', 'Siliguri', 'Sundarbans'], highlights: 'City of Joy, Darjeeling Tea, Royal Bengal Tigers' },
  { state: 'Punjab', code: 'PB', popularCities: ['Amritsar', 'Chandigarh', 'Ludhiana'], highlights: 'Golden Temple, Wagah Border, Punjabi Heritage' },
  { state: 'Telangana', code: 'TS', popularCities: ['Hyderabad', 'Warangal'], highlights: 'Charminar, Hyderabadi Cuisine, Tech Hub' },
  { state: 'Andhra Pradesh', code: 'AP', popularCities: ['Visakhapatnam', 'Tirupati', 'Vijayawada'], highlights: 'Tirumala Temple, Coastal Beaches, Araku' },
  { state: 'Odisha', code: 'OD', popularCities: ['Bhubaneswar', 'Puri', 'Konark'], highlights: 'Jagannath Temple, Sun Temple, Chilika Lake' },
  { state: 'Assam', code: 'AS', popularCities: ['Guwahati', 'Kaziranga', 'Tezpur'], highlights: 'Rhinos, Tea Gardens, Brahmaputra' },
  { state: 'Jammu and Kashmir', code: 'JK', popularCities: ['Srinagar', 'Gulmarg', 'Pahalgam'], highlights: 'Dal Lake, Shikaras, Snow Slopes, Mughal Gardens' },
  { state: 'Ladakh', code: 'LA', popularCities: ['Leh', 'Nubra Valley', 'Pangong Lake'], highlights: 'High Altitude Passes, Monasteries & Lakes' },
  { state: 'Bihar', code: 'BR', popularCities: ['Patna', 'Bodh Gaya', 'Nalanda'], highlights: 'Mahabodhi Temple, Ancient Nalanda' },
  { state: 'Sikkim', code: 'SK', popularCities: ['Gangtok', 'Pelling', 'Lachung'], highlights: 'Kanchenjunga Views, Monasteries, Organic Living' }
];

// Places suggestion dataset for instant autocomplete
const PLACES_SUGGESTIONS = [
  { city: 'Bhopal', state: 'Madhya Pradesh', id: 'bhopal', highlights: 'Upper Lake, Bhopali Poha, Van Vihar' },
  { city: 'Jaipur', state: 'Rajasthan', id: 'jaipur', highlights: 'Hawa Mahal, Amber Fort, Johari Bazaar' },
  { city: 'Udaipur', state: 'Rajasthan', id: 'udaipur', highlights: 'City Palace, Lake Pichola' },
  { city: 'Varanasi', state: 'Uttar Pradesh', id: 'varanasi', highlights: 'Kashi Vishwanath, Dashashwamedh Ghat' },
  { city: 'Indore', state: 'Madhya Pradesh', id: 'bhopal', highlights: 'Sarafa Bazaar, Rajwada Palace' },
  { city: 'Gwalior', state: 'Madhya Pradesh', id: 'bhopal', highlights: 'Gwalior Fort, Jai Vilas Palace' },
  { city: 'Agra', state: 'Uttar Pradesh', id: 'jaipur', highlights: 'Taj Mahal, Agra Fort' },
  { city: 'Mumbai', state: 'Maharashtra', id: 'bhopal', highlights: 'Gateway of India, Marine Drive' },
  { city: 'Delhi', state: 'Delhi', id: 'jaipur', highlights: 'India Gate, Red Fort, Chandni Chowk' },
  { city: 'Goa', state: 'Goa', id: 'bhopal', highlights: 'Calangute, Fort Aguada, Dudhsagar' }
];

export default function HomePage() {
  const { 
    setActivePage, 
    selectedCityId, 
    setSelectedCityId, 
    selectedDestination,
    tripMeta,
    setTripBudget,
    changeUserRole,
    showToast
  } = useApp();

  const [destinationInput, setDestinationInput] = useState(selectedDestination.name);
  const [stateInput, setStateInput] = useState(selectedDestination.state);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showStateSuggestions, setShowStateSuggestions] = useState(false);
  const [budgetInput, setBudgetInput] = useState(tripMeta.budget || 6000);
  const suggestionsRef = useRef(null);
  const stateSuggestionsRef = useRef(null);

  useEffect(() => {
    setDestinationInput(selectedDestination.name);
    setStateInput(selectedDestination.state);
  }, [selectedDestination]);

  // Close suggestions popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
      if (stateSuggestionsRef.current && !stateSuggestionsRef.current.contains(e.target)) {
        setShowStateSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter Indian states by search input
  const filteredStates = useMemo(() => {
    const q = (stateInput || '').trim().toLowerCase();
    if (!q) return INDIAN_STATES;
    return INDIAN_STATES.filter(s => 
      s.state.toLowerCase().includes(q) || 
      s.code.toLowerCase().includes(q) ||
      s.highlights.toLowerCase().includes(q) ||
      s.popularCities.some(c => c.toLowerCase().includes(q))
    );
  }, [stateInput]);

  const handleSelectState = (st) => {
    setStateInput(st.state);
    setShowStateSuggestions(false);
    // If state has cities, suggest the primary city
    if (st.popularCities && st.popularCities.length > 0) {
      const topCity = st.popularCities[0];
      setDestinationInput(topCity);
      const matchedDest = DESTINATIONS.find(d => d.name.toLowerCase() === topCity.toLowerCase());
      if (matchedDest) {
        setSelectedCityId(matchedDest.id);
      }
    }
    showToast(`Selected State: ${st.state}`);
  };

  const filteredPlaces = useMemo(() => {
    const q = (destinationInput || '').trim().toLowerCase();
    if (!q) return PLACES_SUGGESTIONS;
    return PLACES_SUGGESTIONS.filter(p => 
      p.city.toLowerCase().includes(q) || 
      p.state.toLowerCase().includes(q) ||
      p.highlights.toLowerCase().includes(q)
    );
  }, [destinationInput]);

  const handleSelectPlace = (place) => {
    setDestinationInput(place.city);
    setStateInput(place.state);
    setShowSuggestions(false);
    if (DESTINATIONS.some(d => d.id === place.id)) {
      setSelectedCityId(place.id);
      showToast(`Selected destination: ${place.city}, ${place.state}`);
    } else {
      setSelectedCityId('bhopal');
      showToast(`Browsing travel directory for ${place.city}`);
    }
  };

  const handleBudgetChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setBudgetInput(val);
    if (val) {
      setTripBudget(Number(val));
    }
  };

  const handleExploreClick = () => {
    setActivePage('destination');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Section with Vibrant Imagery and Clean Search Card */}
      <div className="relative rounded-3xl overflow-hidden shadow-md border border-teal-100/60 bg-teal-950 min-h-[480px] flex items-center">
        {/* Background Image: Scenic View of Manua Bhan Ki Tekri, Bhopal */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Tekri.jpg/1280px-Tekri.jpg"
            alt="Scenic view from Manua Bhan Ki Tekri, Bhopal"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://upload.wikimedia.org/wikipedia/commons/a/a3/Tekri.jpg";
            }}
            className="w-full h-full object-cover object-center opacity-85 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-teal-950/85 via-teal-900/60 to-teal-800/20" />
        </div>

        {/* Location Badge */}
        <div className="absolute top-4 right-4 z-10 hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/20 text-white text-xs font-medium">
          <span>📍 Scenic view from Manua Bhan Ki Tekri, Bhopal</span>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 px-6 sm:px-10 lg:px-12 py-8 max-w-3xl text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-xs font-semibold mb-3 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            <span>Verified Local Tourism Intelligence • Transparent Tariffs</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white mb-2">
            Plan your journey with confidence
          </h1>

          <p className="text-sm sm:text-base text-slate-200/90 font-normal leading-relaxed mb-5">
            Discover stays, food, attractions and nearby trips using transparent local travel intelligence.
          </p>

          {/* Destination Selector Card matching Image 2 */}
          <div className="bg-white/95 backdrop-blur-md p-5 rounded-3xl shadow-xl border border-white/50 text-slate-800 space-y-4">
            {/* Row 1: State and Destination Inputs with Autocomplete */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative">
              <div className="relative" ref={stateSuggestionsRef}>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  State
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={stateInput}
                    onFocus={() => setShowStateSuggestions(true)}
                    onChange={(e) => {
                      setStateInput(e.target.value);
                      setShowStateSuggestions(true);
                    }}
                    placeholder="Enter or select state (e.g. Madhya Pradesh)"
                    className="w-full pl-3.5 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  {stateInput ? (
                    <button
                      type="button"
                      onClick={() => {
                        setStateInput('');
                        setShowStateSuggestions(true);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                      title="Clear state"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  )}
                </div>

                {/* Indian States Autocomplete Suggestion Dropdown */}
                {showStateSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden max-h-64 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                      <span>Indian States & Territories</span>
                      <span className="text-[10px] text-teal-600 font-medium">{filteredStates.length} found</span>
                    </div>
                    {filteredStates.map((st, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectState(st)}
                        className="px-3.5 py-2.5 hover:bg-teal-50/80 cursor-pointer border-b border-slate-50 last:border-none flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-slate-900">{st.state}</span>
                            <span className="text-[10px] font-semibold text-slate-400">({st.code})</span>
                          </div>
                          <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                            Key Cities: {st.popularCities.slice(0, 4).join(', ')}
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200 shrink-0">
                          Select
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative" ref={suggestionsRef}>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Destination
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={destinationInput}
                    onFocus={() => setShowSuggestions(true)}
                    onChange={(e) => {
                      setDestinationInput(e.target.value);
                      setShowSuggestions(true);
                    }}
                    placeholder="Search city or destination..."
                    className="w-full pl-3.5 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  {destinationInput ? (
                    <button
                      type="button"
                      onClick={() => {
                        setDestinationInput('');
                        setShowSuggestions(true);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                      title="Clear destination"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  )}
                </div>

                {/* Places API Autocomplete Suggestion Dropdown */}
                {showSuggestions && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                      <span>Suggested Destinations (Places API)</span>
                      <span className="text-[10px] text-teal-600 font-medium">Instant Select</span>
                    </div>
                    {filteredPlaces.map((p, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectPlace(p)}
                        className="px-3.5 py-2.5 hover:bg-teal-50/80 cursor-pointer border-b border-slate-50 last:border-none flex items-center justify-between transition-colors"
                      >
                        <div>
                          <span className="font-bold text-xs text-slate-900">{p.city}</span>
                          <span className="text-xs text-slate-500 ml-1.5">• {p.state}</span>
                          <div className="text-[10px] text-slate-400 line-clamp-1">{p.highlights}</div>
                        </div>
                        <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                          Select
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Row 2: Target Budget Input (Days removed as requested) */}
            <div className="pt-2 border-t border-slate-100">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-teal-600" />
                <span>Trip Budget (₹)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₹</span>
                <input
                  type="text"
                  value={budgetInput}
                  onChange={handleBudgetChange}
                  placeholder="Enter target budget..."
                  className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Row 3: Explore Destination Button & Clean Notice */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs text-teal-800 font-medium">
                <Info className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>{selectedDestination.name} is currently available with verified stays, dining, and transit tariffs.</span>
              </div>

              <button
                onClick={handleExploreClick}
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 group shrink-0 cursor-pointer"
              >
                <span>Explore {selectedDestination.name}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Destinations Grid */}
      <section className="pt-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Popular Destinations</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Curated Indian destinations with verified travel intelligence
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DESTINATIONS.map((dest) => (
            <div
              key={dest.id}
              onClick={() => {
                setSelectedCityId(dest.id);
                if (dest.isSupported) {
                  setActivePage('destination');
                }
              }}
              className={`
                bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs transition-all flex flex-col justify-between cursor-pointer hover:border-teal-300 hover:shadow-md
                ${dest.id === selectedCityId ? 'ring-2 ring-teal-500' : ''}
              `}
            >
              <div>
                <div className="relative h-40 bg-slate-100 overflow-hidden">
                  <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2.5 left-2.5">
                    {dest.isSupported ? (
                      <span className="px-2 py-0.5 rounded-full bg-teal-600 text-white text-[10px] font-bold uppercase tracking-wider">
                        Verified Destination
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-800/80 text-white text-[10px] font-medium backdrop-blur-xs">
                        Coming Soon
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-base font-bold text-slate-900">{dest.name}</h3>
                  <p className="text-xs text-slate-500 font-medium mb-1.5">{dest.state}</p>
                  <p className="text-xs text-slate-600 line-clamp-2">{dest.description}</p>
                </div>
              </div>

              <div className="px-4 pb-4 pt-2">
                <button
                  className="w-full py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>{dest.isSupported ? `Explore ${dest.name}` : 'View Status'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Provider Portal Partner Access Card */}
      <section className="bg-gradient-to-r from-teal-900 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-md border border-teal-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-200 border border-teal-400/30 text-xs font-bold">
            <Building2 className="w-3.5 h-3.5 text-teal-300" />
            <span>Tourism Service Providers & Local Businesses</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Partner with TRAAR to list your verified stay, dining or tour service
          </h2>
          <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed">
            Reach thousands of travellers with transparent tariffs and verified listings. Manage bookings, upload photos, and update details directly.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              changeUserRole('provider');
              setActivePage('dashboard');
              showToast('Entered Provider Portal');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-5 py-3 bg-white hover:bg-teal-50 text-teal-900 font-extrabold rounded-2xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-teal-700" />
            <span>Open Provider Portal</span>
          </button>
        </div>
      </section>
    </div>
  );
}
