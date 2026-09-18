import React from 'react';
import { X, MapPin, Navigation, Car, Bus, Clock } from 'lucide-react';
import { useTrip } from '../../context/TripContext';

export default function DirectionsModal({ isOpen, onClose, destinationItem }) {
  if (!isOpen || !destinationItem) return null;

  const { startingPoint } = useTrip();
  const startName = startingPoint === 'city_centre' ? 'Bhopal City Centre' :
                    startingPoint === 'current' ? 'Current GPS Location' : 'Bhopal Junction Railway Station';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-xl border border-gray-200">
        <div className="flex items-start justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Way to {destinationItem.name}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Route estimate from {startName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {/* Key metrics */}
          <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-md border border-gray-200 text-center">
            <div>
              <span className="text-[11px] text-gray-500 block">Distance</span>
              <span className="text-sm font-bold text-gray-800">
                {destinationItem.distance || `${destinationItem.distanceKm || 2.4} km`}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-gray-500 block">Est. Time</span>
              <span className="text-sm font-bold text-gray-800">
                {destinationItem.duration || '12–15 mins'}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-gray-500 block">Traffic</span>
              <span className="text-sm font-bold text-emerald-700">Moderate</span>
            </div>
          </div>

          {/* Transit options */}
          <div className="space-y-2">
            <div className="border border-gray-200 rounded p-3 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Car className="w-4 h-4 text-gray-600" />
                <div>
                  <span className="font-medium text-gray-800 block">Auto / Taxi</span>
                  <span className="text-gray-500 text-[11px]">Via VIP Road / Link Road 1</span>
                </div>
              </div>
              <span className="font-semibold text-gray-700">₹80 – ₹130</span>
            </div>

            <div className="border border-gray-200 rounded p-3 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Bus className="w-4 h-4 text-gray-600" />
                <div>
                  <span className="font-medium text-gray-800 block">BCLL City Bus (Route TR-1 / 204)</span>
                  <span className="text-gray-500 text-[11px]">Nearest stop: Polytechnic Square (400m walk)</span>
                </div>
              </div>
              <span className="font-semibold text-gray-700">₹15 – ₹25</span>
            </div>
          </div>

          {/* Turn by turn preview */}
          <div className="border-t border-gray-100 pt-3 text-xs space-y-2">
            <h4 className="font-medium text-gray-700">Navigation route</h4>
            <div className="space-y-1.5 text-gray-600 pl-2 border-l-2 border-[#176B4A]">
              <div>1. Head south towards Hamidia Road / VIP Road.</div>
              <div>2. Continue straight along Kamla Park circle.</div>
              <div>3. Turn onto Shyamla Hills / Lake Road towards {destinationItem.name}.</div>
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destinationItem.name + ' Bhopal')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-xs bg-[#176B4A] hover:bg-[#135A3E] text-white rounded font-medium inline-flex items-center gap-1.5"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Open in Google Maps</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
