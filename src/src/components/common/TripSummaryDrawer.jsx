import React from 'react';
import { 
  Briefcase, 
  Trash2, 
  ArrowRight, 
  AlertCircle, 
  Bed, 
  UtensilsCrossed, 
  Landmark, 
  Compass,
  X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function TripSummaryDrawer() {
  const { 
    tripItems, 
    removeFromTrip, 
    clearTrip, 
    setActivePage, 
    budgetCalculations,
    travellerCount 
  } = useApp();

  const getCategoryIcon = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('stay') || cat.includes('hotel') || cat.includes('hostel')) {
      return <Bed className="w-3.5 h-3.5 text-amber-600" />;
    }
    if (cat.includes('food') || cat.includes('restaurant') || cat.includes('dhaba')) {
      return <UtensilsCrossed className="w-3.5 h-3.5 text-orange-600" />;
    }
    if (cat.includes('place') || cat.includes('attraction')) {
      return <Landmark className="w-3.5 h-3.5 text-blue-600" />;
    }
    if (cat.includes('nearby') || cat.includes('transport') || cat.includes('travel')) {
      return <Compass className="w-3.5 h-3.5 text-lavender-600" />;
    }
    return <Briefcase className="w-3.5 h-3.5 text-slate-500" />;
  };

  const getItemLineTotal = (item) => {
    if (item.isUnknownPrice || item.price === null || item.price === undefined) return null;
    const cat = (item.category || '').toLowerCase();
    const qty = item.quantity || 1;
    if (cat.includes('stay')) return (item.price || 0) * (item.rooms || 1) * (item.nights || qty);
    if (cat.includes('food')) return (item.price || 0) * (item.people || travellerCount || 1) * (item.meals || qty);
    if (cat.includes('place')) return (item.price || 0) * (item.ticketQuantity || qty);
    if (cat.includes('transport') || cat.includes('nearby')) {
      if (item.isVehicleRate) return (item.price || 0) * (item.legs || qty);
      return (item.price || 0) * (item.passengers || travellerCount || 1) * (item.legs || qty);
    }
    return (item.price || 0) * qty;
  };

  const hasUnknownPrices = tripItems.some(i => i.isUnknownPrice || i.price === null || i.price === undefined);

  return (
    <aside className="w-full xl:w-72 shrink-0 min-w-0 bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-teal-50 text-teal-800 rounded-lg">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Trip Planner</h2>
            <p className="text-[10px] text-slate-400">
              {tripItems.length} {tripItems.length === 1 ? 'item' : 'items'} · {travellerCount} {travellerCount === 1 ? 'traveller' : 'travellers'}
            </p>
          </div>
        </div>

        {tripItems.length > 0 && (
          <button
            type="button"
            onClick={clearTrip}
            className="text-[11px] font-medium text-slate-400 hover:text-rose-600 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Unknown Price Exclusion Notice (Section 16 requirement) */}
      {hasUnknownPrices && (
        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>Unknown transport costs are strictly excluded from the estimate to ensure budget integrity.</span>
        </div>
      )}

      {/* Items List or Empty State */}
      {tripItems.length === 0 ? (
        <div className="py-8 text-center flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-3">
            <Briefcase className="w-5 h-5 stroke-[1.5]" />
          </div>
          <p className="text-xs font-bold text-slate-700">Your trip is empty</p>
          <p className="text-[11px] text-slate-400 max-w-[200px] mt-1 mb-4">
            Click "+ Add to Trip" on stays, food, places, or transport options to calculate your estimate.
          </p>
          <button
            type="button"
            disabled
            className="w-full py-2 px-3 bg-slate-100 text-slate-400 rounded-xl text-xs font-semibold cursor-not-allowed"
          >
            Open Trip Planner
          </button>
        </div>
      ) : (
        <>
          {/* Scrollable list */}
          <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 divide-y divide-slate-100">
            {tripItems.map((item) => {
              const lineTotal = getItemLineTotal(item);
              const isExcluded = lineTotal === null;
              return (
                <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between gap-2.5 group">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="p-1 rounded-md bg-slate-50 shrink-0">
                      {getCategoryIcon(item.category)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-teal-700 transition-colors">
                        {item.title || item.name}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                        <span className="capitalize">{item.category}</span>
                        <span>•</span>
                        <span>Day {item.dayNumber || item.day || 1}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs font-bold text-slate-900">
                      {isExcluded ? (
                        <span className="text-[10px] text-amber-600 font-medium">Excluded</span>
                      ) : (
                        `₹${lineTotal.toLocaleString('en-IN')}`
                      )}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFromTrip(item.id)}
                      className="p-1 text-slate-300 hover:text-rose-500 rounded-md transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Subtotal & Action */}
          <div className="pt-3 border-t border-slate-100 space-y-3">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Estimated Total:</span>
                <span className="text-base font-extrabold text-teal-800">
                  ₹{(budgetCalculations.grandTotal ?? budgetCalculations.totalRupees ?? 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>Total Items: {tripItems.length}</span>
                <span>Includes {travellerCount} {travellerCount === 1 ? 'person' : 'persons'}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setActivePage('trip');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <span>View Itinerary & Budget</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
