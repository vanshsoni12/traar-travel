import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Search, Calendar, HelpCircle, User, ChevronDown, Menu, X, Check } from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { STATES_AND_CITIES } from '../data/destinations';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedCity, setSelectedCity, selectedState, setSelectedState, tripItems } = useTrip();

  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const query = encodeURIComponent(searchQuery.trim());
    navigate(`/destinations/bhopal/places?search=${query}`);
  };

  const handleSelectCity = (city, state) => {
    setSelectedCity(city);
    setSelectedState(state);
    setShowLocationDropdown(false);
    navigate(`/destinations/bhopal`);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-6 shrink-0">
            <Link to="/" className="flex items-center group">
              <img src="/traar-logo.png" alt="TRAAR - Plan • Explore • Support Local" className="h-10 w-auto object-contain" />
            </Link>
          </div>

          {/* Central Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-2">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search destinations, places or experiences"
                  className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:border-[#176B4A] focus:ring-1 focus:ring-[#176B4A] placeholder:text-gray-400 text-gray-800"
                />
              </div>
            </form>
          </div>

          {/* Right Navigation Controls */}
          <div className="hidden lg:flex items-center gap-5 text-sm text-gray-700">
            {/* City Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
                className="flex items-center gap-1.5 py-1.5 px-2 hover:bg-gray-100 rounded text-gray-700 font-medium transition-colors"
                aria-label="Select destination city"
              >
                <MapPin className="w-4 h-4 text-gray-500" />
                <span>{selectedCity}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {showLocationDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Featured Destination
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectCity('Bhopal', 'Madhya Pradesh')}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between text-gray-800"
                  >
                    <div>
                      <span className="font-medium text-[#176B4A]">Bhopal</span>
                      <span className="text-xs text-gray-500 block">Madhya Pradesh (Active)</span>
                    </div>
                    {selectedCity === 'Bhopal' && <Check className="w-4 h-4 text-[#176B4A]" />}
                  </button>

                  <div className="border-t border-gray-100 my-1"></div>
                  <div className="px-3 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Upcoming Cities
                  </div>
                  {['Indore', 'Ujjain', 'Jaipur', 'Varanasi'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => handleSelectCity(c, 'Madhya Pradesh')}
                      className="w-full px-3 py-1.5 text-left text-sm hover:bg-gray-50 flex items-center justify-between text-gray-600"
                    >
                      <span>{c}</span>
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">Preview</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* My Trip */}
            <Link
              to="/trip"
              className={`flex items-center gap-1.5 hover:text-[#176B4A] transition-colors py-1 ${
                location.pathname === '/trip' ? 'text-[#176B4A] font-semibold' : ''
              }`}
            >
              <Calendar className="w-4 h-4 text-gray-500" />
              <span>My trip</span>
              {tripItems.length > 0 && (
                <span className="ml-0.5 bg-[#176B4A] text-white text-[11px] font-semibold px-1.5 py-0.2 rounded-full">
                  {tripItems.length}
                </span>
              )}
            </Link>

            {/* Help Booth */}
            <Link
              to="/help"
              className={`flex items-center gap-1.5 hover:text-[#176B4A] transition-colors py-1 ${
                location.pathname === '/help' ? 'text-[#176B4A] font-semibold' : ''
              }`}
            >
              <HelpCircle className="w-4 h-4 text-gray-500" />
              <span>Help booth</span>
            </Link>

            {/* Admin shortcut */}
            <Link
              to="/admin"
              className="text-xs text-gray-400 hover:text-gray-700 py-1"
              title="Admin Verification Panel"
            >
              Admin
            </Link>

            {/* Provider Login / Portal */}
            <Link
              to="/provider"
              className="inline-flex items-center gap-1.5 border border-gray-300 hover:border-[#176B4A] hover:text-[#176B4A] text-gray-700 font-medium px-3 py-1.5 rounded text-sm transition-all"
            >
              <User className="w-3.5 h-3.5" />
              <span>Provider login</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              to="/trip"
              className="relative p-2 text-gray-600 hover:text-[#176B4A]"
              aria-label="My trip"
            >
              <Calendar className="w-5 h-5" />
              {tripItems.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#176B4A] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {tripItems.length}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 hover:text-gray-900 rounded"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3 pt-1">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search destinations, places..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:border-[#176B4A] text-gray-800"
            />
          </form>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <MapPin className="w-4 h-4 text-[#176B4A]" />
              <span>Destination: <strong>{selectedCity}</strong></span>
            </div>
            <Link
              to="/destinations/bhopal"
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs text-[#176B4A] font-semibold"
            >
              Change
            </Link>
          </div>
          <div className="flex flex-col space-y-2 text-sm">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 hover:bg-gray-50 rounded text-gray-700"
            >
              Home
            </Link>
            <Link
              to="/destinations/bhopal"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 hover:bg-gray-50 rounded text-gray-700"
            >
              Bhopal Overview
            </Link>
            <Link
              to="/destinations/bhopal/stays"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 hover:bg-gray-50 rounded text-gray-700"
            >
              Stays in Bhopal
            </Link>
            <Link
              to="/destinations/bhopal/food"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 hover:bg-gray-50 rounded text-gray-700"
            >
              Food in Bhopal
            </Link>
            <Link
              to="/destinations/bhopal/places"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 hover:bg-gray-50 rounded text-gray-700"
            >
              Places to Visit
            </Link>
            <Link
              to="/destinations/bhopal/nearby"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 hover:bg-gray-50 rounded text-gray-700"
            >
              Nearby Trips
            </Link>
            <Link
              to="/trip"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 hover:bg-gray-50 rounded text-gray-700 font-medium text-[#176B4A]"
            >
              My Trip ({tripItems.length} items)
            </Link>
            <Link
              to="/help"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 hover:bg-gray-50 rounded text-gray-700"
            >
              Help Booth
            </Link>
            <div className="pt-2 border-t border-gray-100 flex gap-2">
              <Link
                to="/provider"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 border border-gray-300 rounded text-sm text-gray-700"
              >
                Provider Portal
              </Link>
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 text-center py-2 border border-gray-300 rounded text-sm text-gray-700"
              >
                Admin Review
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
