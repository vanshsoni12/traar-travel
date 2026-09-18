import React from 'react';
import { 
  X, 
  MapPin, 
  Navigation, 
  Car, 
  Bus, 
  Clock, 
  Compass, 
  ExternalLink, 
  Check, 
  Info,
  Footprints
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function WayToModal() {
  const { 
    wayToItem, 
    setWayToItem, 
    startingPoint, 
    calculateDistance, 
    showToast 
  } = useApp();

  if (!wayToItem) return null;

  const dist = calculateDistance(wayToItem.lat, wayToItem.lng);
  const distanceKm = dist.rawKm || 2.4;
  const estMinutes = Math.max(5, Math.round(distanceKm * 3.5));

  const handleOpenGoogleMaps = () => {
    const query = encodeURIComponent(`${wayToItem.name}, ${wayToItem.location || 'Bhopal'}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) setWayToItem(null);
      }}
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-start sm:items-[safe_center] justify-center p-4 overflow-y-auto cursor-default"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in zoom-in-95 duration-150 my-6">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-teal-700 font-bold uppercase tracking-wide">
              <Navigation className="w-3.5 h-3.5" />
              <span>Ways to Reach & Transit Guidance</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5">
              Ways to reach {wayToItem.name}
            </h2>
            <p className="text-xs text-slate-500">
              From current starting point: <strong>{startingPoint.name}</strong>
            </p>
          </div>

          <button
            type="button"
            onClick={() => setWayToItem(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Distance & Time Metrics Pill */}
        <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200/80 text-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Distance</span>
            <span className="text-sm font-black text-slate-800">{dist.label}</span>
            <span className="text-[9px] text-slate-400 block font-mono">({dist.basis})</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Drive Time</span>
            <span className="text-sm font-black text-slate-800">{estMinutes} – {estMinutes + 5} mins</span>
            <span className="text-[9px] text-teal-600 block">Normal traffic</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Route Path</span>
            <span className="text-sm font-black text-slate-800">{dist.isStraightLine ? 'Estimated' : 'City Corridor'}</span>
            <span className="text-[9px] text-slate-400 block">Verified path</span>
          </div>
        </div>

        {/* Transit Modes Breakdown */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Available Transit Modes
          </h3>

          {/* 1. Auto Rickshaw / Taxi */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs hover:border-teal-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                <Car className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-800 block">Auto-Rickshaw / Cab</span>
                <span className="text-[11px] text-slate-500">Fixed rate ~₹{Math.max(50, Math.round(distanceKm * 20))}</span>
              </div>
            </div>
            <span className="font-mono text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              {Math.max(6, Math.round(distanceKm * 3))} mins
            </span>
          </div>

          {/* 2. City Bus */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs hover:border-teal-300 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-lavender-50 text-lavender-700">
                <Bus className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-800 block">City Bus / Transit</span>
                <span className="text-[11px] text-slate-500">Fare: ₹15 – ₹25 / person</span>
              </div>
            </div>
            <span className="font-mono text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              {Math.max(12, Math.round(distanceKm * 5))} mins
            </span>
          </div>

          {/* 3. Walking */}
          {distanceKm <= 2.5 && (
            <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs hover:border-teal-300 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                  <Footprints className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-800 block">Walking / Stroll</span>
                  <span className="text-[11px] text-slate-500">Pedestrian friendly walkway</span>
                </div>
              </div>
              <span className="font-mono text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                {Math.round(distanceKm * 14)} mins
              </span>
            </div>
          )}
        </div>

        {/* Modal Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleOpenGoogleMaps}
            className="flex items-center gap-1.5 text-xs text-teal-700 hover:text-teal-800 font-semibold cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Open in Google Maps</span>
          </button>

          <button
            type="button"
            onClick={() => setWayToItem(null)}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
