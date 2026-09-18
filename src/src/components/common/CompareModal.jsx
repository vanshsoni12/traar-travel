import React from 'react';
import { X, Check, Star, MapPin, Scale, Plus, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function CompareModal() {
  const { 
    compareListings, 
    removeFromCompare, 
    isCompareModalOpen, 
    setIsCompareModalOpen,
    addToTrip,
    calculateDistance,
    personCount
  } = useApp();

  if (!isCompareModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-start sm:items-[safe_center] justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150 my-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-50 text-teal-800 rounded-xl">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Compare Listings</h3>
              <p className="text-xs text-slate-500">
                Comparing {compareListings.length} of 3 maximum services side-by-side (Prices adjusted for {personCount} {personCount === 1 ? 'person' : 'persons'})
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsCompareModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {compareListings.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-sm font-semibold text-slate-700">No items selected for comparison</p>
            <p className="text-xs text-slate-400 mt-1">
              Click the "Compare" checkbox on any Stay, Food, or Attraction card to compare them here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {compareListings.map(item => {
              const dist = calculateDistance(item.lat, item.lng);
              const basePrice = item.price || item.avgCost || item.entryPrice || 0;
              const perPersonPrice = item.avgCost || item.entryPrice || (item.category === 'Stays' ? Math.round(basePrice / 2) : basePrice);
              const totalPrice = perPersonPrice * personCount;

              return (
                <div key={item.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="relative h-32 rounded-xl overflow-hidden mb-2 bg-slate-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeFromCompare(item.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/70 text-white hover:bg-red-600 transition-colors cursor-pointer"
                        title="Remove from comparison"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-snug">{item.name}</h4>
                    <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 inline-block my-1">
                      {item.type || item.category || 'Listing'}
                    </span>

                    <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-200 mt-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Base Tariff:</span>
                        <span className="font-bold text-slate-900">₹{basePrice.toLocaleString()}</span>
                      </div>

                      {/* Item 18: Price detail per person */}
                      <div className="flex justify-between bg-teal-50/80 p-1.5 rounded-lg border border-teal-100">
                        <span className="text-teal-900 font-semibold">Price / Person:</span>
                        <span className="font-extrabold text-teal-800">₹{perPersonPrice.toLocaleString()} / person</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-400">Total for {personCount} persons:</span>
                        <span className="font-black text-slate-900">₹{totalPrice.toLocaleString()}</span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-400">Rating:</span>
                        <span className="font-semibold text-slate-800 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {item.rating || 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Distance:</span>
                        <span className="font-medium text-slate-700 text-right">{dist.formattedLabel}</span>
                      </div>
                    </div>

                    {item.amenities && (
                      <div className="pt-2 border-t border-slate-200 mt-2">
                        <span className="text-[10px] font-bold text-slate-400 block mb-1 uppercase">Amenities:</span>
                        <div className="flex flex-wrap gap-1">
                          {item.amenities.slice(0, 3).map((am, i) => (
                            <span key={i} className="text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-700">
                              {am}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      addToTrip(item, item.type || item.category || 'Listing');
                      setIsCompareModalOpen(false);
                    }}
                    className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Trip</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="pt-4 border-t border-slate-200 mt-5 flex justify-end">
          <button
            onClick={() => setIsCompareModalOpen(false)}
            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
