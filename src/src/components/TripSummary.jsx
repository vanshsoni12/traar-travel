import React, { useState } from 'react';
import { X, Plus, Minus, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function TripSummary() {
  const { 
    tripItems, 
    removeFromTrip, 
    updateItemQuantity, 
    budgetCalculations, 
    tripMeta, 
    setTripMeta,
    setShowExportModal,
    showToast
  } = useApp();

  const [isReviewed, setIsReviewed] = useState(false);

  const handleBudgetChange = (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setTripMeta(prev => ({ ...prev, budget: val }));
  };

  const handleConfirmDownload = () => {
    if (!isReviewed) {
      showToast('Please check the review box before downloading receipt.');
      return;
    }
    setShowExportModal(true);
  };

  const grandTotal = budgetCalculations?.grandTotal || 0;

  return (
    <aside className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs sticky top-20 w-full">
      {/* Top Badge & Count */}
      <div className="flex items-center justify-between">
        <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">
          YOUR TRIP
        </span>
        <span className="text-xs text-slate-400 font-medium">
          {tripItems.length} selected
        </span>
      </div>

      {/* Heading */}
      <h2 className="text-base font-bold text-slate-900 mt-2">
        A plan of your own
      </h2>
      <p className="text-xs text-slate-500 mt-0.5 leading-tight">
        Add a stay, a visit, a meal or a ride. Only your selections count.
      </p>

      {/* Budget Input */}
      <div className="mt-3">
        <label htmlFor="trip-budget-input" className="block text-xs font-medium text-slate-700 mb-1">
          Your budget (optional, ₹)
        </label>
        <input
          id="trip-budget-input"
          type="text"
          value={tripMeta.budget || ''}
          onChange={handleBudgetChange}
          placeholder="e.g. 5000"
          className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Empty State vs Items List */}
      {tripItems.length === 0 ? (
        <div className="bg-[#edf7f2] border border-[#d2edd9] rounded-lg p-3.5 my-3 text-slate-800">
          <p className="text-xs font-bold text-slate-800">
            Your trip is empty.
          </p>
          <p className="text-[11px] text-slate-600 mt-1 leading-snug">
            Choose a function, then tap + Add to trip on anything you want to include.
          </p>
        </div>
      ) : (
        <div className="my-3 space-y-2 max-h-[280px] overflow-y-auto pr-1">
          {tripItems.map((item) => (
            <div 
              key={item.id} 
              className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 flex items-start justify-between gap-2 text-xs"
            >
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-slate-800 truncate">
                  {item.title || item.name}
                </div>
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <span className="text-blue-600 font-medium">{item.category}</span>
                  <span>•</span>
                  <span>
                    {item.price !== null && item.price !== undefined
                      ? `₹${item.price.toLocaleString('en-IN')}`
                      : 'Price unverified'}
                  </span>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 mt-1.5">
                  <button
                    type="button"
                    onClick={() => updateItemQuantity(item.id, (item.quantity || 1) - 1)}
                    className="w-5 h-5 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-2.5 h-2.5" />
                  </button>
                  <span className="text-xs font-semibold text-slate-700 min-w-4 text-center">
                    {item.quantity || 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateItemQuantity(item.id, (item.quantity || 1) + 1)}
                    className="w-5 h-5 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-2.5 h-2.5" />
                  </button>
                </div>
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeFromTrip(item.id)}
                className="text-slate-400 hover:text-slate-700 p-1"
                aria-label="Remove item"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Grand Total Estimate */}
      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
        <span className="text-slate-600 font-medium">Grand total estimate:</span>
        <span className="text-sm font-bold text-slate-900">
          ₹{grandTotal.toLocaleString('en-IN')}.00
        </span>
      </div>

      {/* Review Checkbox */}
      <div className="mt-3 flex items-start gap-2">
        <input
          id="review-trip-checkbox"
          type="checkbox"
          checked={isReviewed}
          onChange={(e) => setIsReviewed(e.target.checked)}
          className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
        />
        <label 
          htmlFor="review-trip-checkbox" 
          className="text-xs text-slate-600 cursor-pointer select-none leading-snug"
        >
          I have reviewed my trip estimate.
        </label>
      </div>

      {/* Confirm & Download Button */}
      <button
        type="button"
        onClick={handleConfirmDownload}
        disabled={!isReviewed}
        className={`w-full py-2 px-3 rounded-md text-xs font-semibold mt-3 transition-colors ${
          isReviewed
            ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white cursor-pointer shadow-xs'
            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
        }`}
      >
        Confirm & download receipt
      </button>

      {/* Bottom Disclaimer */}
      <p className="text-[10px] text-slate-400 mt-2.5 leading-normal">
        Planning estimate, not a booking. Sample prices, each verification. Your plan stays open while you navigate back and explore more.
      </p>
    </aside>
  );
}
