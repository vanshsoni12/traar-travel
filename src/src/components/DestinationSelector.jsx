import React from 'react';
import { STATES_AND_CITIES } from '../data/destinations';

export default function DestinationSelector({
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity,
  onExplore
}) {
  const handleStateChange = (e) => {
    const newState = e.target.value;
    setSelectedState(newState);
    const found = STATES_AND_CITIES.find((s) => s.state === newState);
    if (found && found.cities.length > 0) {
      setSelectedCity(found.cities[0]);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-md p-4 sm:p-5 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
        <div className="sm:col-span-5">
          <label className="block text-xs font-semibold text-gray-700 mb-1">State</label>
          <select
            value={selectedState}
            onChange={handleStateChange}
            className="w-full py-2 px-3 border border-gray-300 rounded text-sm text-gray-800 bg-white focus:outline-none focus:border-[#176B4A]"
          >
            {STATES_AND_CITIES.map((s) => (
              <option key={s.state} value={s.state}>
                {s.state}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-4">
          <label className="block text-xs font-semibold text-gray-700 mb-1">City</label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="w-full py-2 px-3 border border-gray-300 rounded text-sm text-gray-800 bg-white focus:outline-none focus:border-[#176B4A]"
          >
            {(STATES_AND_CITIES.find((s) => s.state === selectedState)?.cities || ['Bhopal']).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <button
            type="button"
            onClick={onExplore}
            className="w-full py-2 px-4 bg-[#176B4A] hover:bg-[#135A3E] text-white text-sm font-medium rounded transition-colors shadow-sm"
          >
            Explore destination
          </button>
        </div>
      </div>
    </div>
  );
}
