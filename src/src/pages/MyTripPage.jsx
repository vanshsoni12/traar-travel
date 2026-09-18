import React, { useState } from 'react';
import { 
  Briefcase, 
  ArrowLeft,
  Users, 
  Clock, 
  AlertTriangle, 
  AlertCircle, 
  Trash2, 
  Copy, 
  Share2, 
  Download, 
  Plus, 
  Minus, 
  ChevronRight, 
  Info, 
  X, 
  CheckCircle2, 
  Car, 
  Bus, 
  Train, 
  Bed, 
  UtensilsCrossed, 
  Landmark, 
  Compass,
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import ShareTripModal from '../components/modals/ShareTripModal';

export default function MyTripPage() {
  const { 
    tripItems, 
    removeFromTrip, 
    updateItemQuantity, 
    duplicateTrip,
    tripMeta, 
    setTripMeta,
    budgetCalculations,
    isBudgetWarningDismissed, 
    setIsBudgetWarningDismissed,
    scheduleWarnings,
    personCount,
    setPersonCount,
    showToast,
    setActivePage,
    goBack,
    setShowExportModal
  } = useApp();

  const [showShareModal, setShowShareModal] = useState(false);
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [tempBudget, setTempBudget] = useState(tripMeta.budget || 6000);

  const displayedItems = tripItems;

  const handleBudgetSubmit = (e) => {
    e.preventDefault();
    const val = Math.max(0, Number(tempBudget) || 0);
    setTripMeta(prev => ({
      ...prev,
      budget: val,
      budgetPaise: val * 100
    }));
    setIsBudgetWarningDismissed(false); // reset dismissal on budget edit
    setIsEditingBudget(false);
    showToast(`Budget ceiling updated to ₹${val.toLocaleString('en-IN')}`);
  };

  const handleTravellerChange = (newCount) => {
    if (newCount < 1) return;
    setTripMeta(prev => ({ ...prev, travellers: newCount }));
    setPersonCount(newCount);
    showToast(`Updated travellers to ${newCount}`);
  };

  const getItemCategoryIcon = (category) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('stay') || cat.includes('hotel') || cat.includes('hostel')) {
      return <Bed className="w-4 h-4 text-amber-600" />;
    }
    if (cat.includes('food') || cat.includes('restaurant') || cat.includes('dhaba')) {
      return <UtensilsCrossed className="w-4 h-4 text-orange-600" />;
    }
    if (cat.includes('attraction') || cat.includes('place')) {
      return <Landmark className="w-4 h-4 text-blue-600" />;
    }
    if (cat.includes('nearby') || cat.includes('transport') || cat.includes('travel')) {
      return <Compass className="w-4 h-4 text-lavender-600" />;
    }
    return <Briefcase className="w-4 h-4 text-slate-600" />;
  };

  const getItemLineTotal = (item) => {
    if (item.isUnknownPrice || item.price === null || item.price === undefined) return null;
    const cat = (item.category || '').toLowerCase();
    const qty = item.quantity || 1;
    const travellers = Number(tripMeta.travellers) || 1;

    if (cat.includes('stay') || cat.includes('hotel') || cat.includes('hostel')) {
      return (item.price || 0) * (item.rooms || 1) * qty;
    }
    if (cat.includes('food') || cat.includes('restaurant') || cat.includes('dhaba')) {
      return (item.price || 0) * travellers * qty;
    }
    if (cat.includes('attraction') || cat.includes('place')) {
      return (item.price || 0) * travellers * qty;
    }
    if (cat.includes('transport') || cat.includes('travel') || cat.includes('nearby') || item.mode || item.isVehicleRate) {
      if (item.isVehicleRate) {
        return (item.price || 0) * qty;
      }
      return (item.price || 0) * travellers * qty;
    }
    return (item.price || 0) * qty;
  };

  return (
    <div className="space-y-6 pb-24 max-w-6xl mx-auto">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goBack}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold shrink-0"
            title="Go Back"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-teal-100 text-teal-800">
                <Briefcase className="w-4 h-4" />
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                My Trip Planner & Budget Engine
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Transparent itinerary and expense planner with verified local tariffs.
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={duplicateTrip}
            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Copy className="w-3.5 h-3.5 text-slate-500" />
            <span>Duplicate Trip</span>
          </button>

          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Share Trip</span>
          </button>

          <button
            type="button"
            onClick={() => setShowExportModal(true)}
            className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Estimate (PDF)</span>
          </button>
        </div>
      </div>

      {/* SECTION 15: Dismissible Budget Limit Alert */}
      {budgetCalculations.isOverBudget && !isBudgetWarningDismissed && (
        <div className="bg-rose-50 border-2 border-rose-300 p-4 rounded-2xl text-rose-900 flex items-start justify-between gap-3 shadow-xs animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-rose-100 text-rose-700 rounded-lg shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-950">
                Tiny pause, you have reached your limit.
              </h3>
              <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">
                Your estimated trip cost of <strong>₹{budgetCalculations.grandTotal.toLocaleString('en-IN')}</strong> exceeds your target budget of <strong>₹{budgetCalculations.userBudget.toLocaleString('en-IN')}</strong> by <strong>₹{Math.abs(budgetCalculations.difference).toLocaleString('en-IN')}</strong>. Consider removing an optional excursion or choosing a budget stay.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsBudgetWarningDismissed(true)}
            className="p-1 rounded-md text-rose-500 hover:bg-rose-100 hover:text-rose-700 transition-colors"
            title="Dismiss warning for this session"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Schedule Feasibility Warnings (Section 27: warnings for tightly scheduled days with >= 5 stops) */}
      {Object.keys(scheduleWarnings).length > 0 && (
        <div className="space-y-2">
          {Object.entries(scheduleWarnings).map(([day, warningText]) => (
            <div 
              key={day} 
              className="bg-amber-50 border border-amber-300 p-3 rounded-xl text-amber-900 text-xs flex items-center gap-2.5 shadow-2xs"
            >
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span><strong>Schedule Feasibility Notice:</strong> {warningText}</span>
            </div>
          ))}
        </div>
      )}

      {/* Meta Controls Ribbon: Travellers, Date, Target Budget */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* 1. Travellers Selector */}
        <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 text-xs">
            <Users className="w-4 h-4 text-teal-700" />
            <span className="font-semibold text-slate-700">Travellers:</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleTravellerChange(tripMeta.travellers - 1)}
              disabled={tripMeta.travellers <= 1}
              className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-xs font-bold text-slate-800 w-4 text-center">
              {tripMeta.travellers}
            </span>
            <button
              type="button"
              onClick={() => handleTravellerChange(tripMeta.travellers + 1)}
              className="w-6 h-6 rounded-md bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* 2. Target Budget (Direct Variable Input) */}
        <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
          <div className="text-xs">
            <span className="font-semibold text-slate-700 block">Budget Limit:</span>
            <span className="text-[10px] text-slate-400">Ceiling for warnings</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center bg-white border border-slate-200 rounded-xl px-2.5 py-1 shadow-2xs focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-600">
              <span className="text-xs font-bold text-slate-500 mr-1">₹</span>
              <input
                type="number"
                min="0"
                step="500"
                value={tripMeta.budget || ''}
                onChange={(e) => {
                  const val = Math.max(0, Number(e.target.value) || 0);
                  setTripMeta(prev => ({ ...prev, budget: val, budgetPaise: val * 100 }));
                  setIsBudgetWarningDismissed(false);
                }}
                className="w-20 sm:w-28 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none bg-transparent"
                placeholder="6000"
              />
            </div>
            <div className="flex flex-col gap-0.5">
              <button
                type="button"
                onClick={() => {
                  const val = (tripMeta.budget || 0) + 1000;
                  setTripMeta(prev => ({ ...prev, budget: val, budgetPaise: val * 100 }));
                  setIsBudgetWarningDismissed(false);
                }}
                className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
                title="Add ₹1,000"
              >
                +1k
              </button>
              <button
                type="button"
                onClick={() => {
                  const val = Math.max(0, (tripMeta.budget || 0) - 1000);
                  setTripMeta(prev => ({ ...prev, budget: val, budgetPaise: val * 100 }));
                  setIsBudgetWarningDismissed(false);
                }}
                className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-bold text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
                title="Subtract ₹1,000"
              >
                -1k
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout & Cost Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Itinerary Column (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Planned Itinerary Items</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                {tripItems.length} {tripItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>

          {/* List of Trip Items */}
          {displayedItems.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-10 text-center space-y-3">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">No items scheduled for this view</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore the verified directories to add hotels, dining, heritage sights, and bus/train legs to your plan.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <button
                  onClick={() => setActivePage('stays')}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-semibold"
                >
                  Browse Stays
                </button>
                <button
                  onClick={() => setActivePage('food')}
                  className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-semibold"
                >
                  Browse Food
                </button>
                <button
                  onClick={() => setActivePage('places')}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
                >
                  Browse Places
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {displayedItems.map((item, index) => {
                const isExcluded = item.isUnknownPrice || item.price === null || item.price === undefined;
                const cat = (item.category || '').toLowerCase();
                const isVehicle = item.isVehicleRate;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-teal-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    {/* Left Details */}
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="p-2 bg-slate-50 rounded-xl shrink-0 mt-0.5">
                        {getItemCategoryIcon(item.category)}
                      </div>

                      <div className="min-w-0 space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h3 className="text-sm font-bold text-slate-900 truncate">
                            {item.title || item.name}
                          </h3>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 capitalize">
                            {item.category}
                          </span>
                          {isVehicle && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Vehicle Fare (Flat)
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-500 line-clamp-1">
                          {item.location || item.sublabel}
                        </p>

                        {/* Transparent tariff calculation breakdown */}
                        {!isExcluded && (
                          <div className="text-[10px] font-semibold text-teal-800 bg-teal-50/90 px-2 py-0.5 rounded-md inline-flex items-center gap-1 border border-teal-100">
                            {cat.includes('food') ? (
                              <span>₹{item.price} × {tripMeta.travellers || 1} pers. × {item.quantity || 1} meal{(item.quantity || 1) > 1 ? 's' : ''}</span>
                            ) : cat.includes('attraction') ? (
                              <span>₹{item.price} × {tripMeta.travellers || 1} ticket{(tripMeta.travellers || 1) > 1 ? 's' : ''} × {item.quantity || 1} entry</span>
                            ) : ((cat.includes('transport') || cat.includes('travel')) && !isVehicle) ? (
                              <span>₹{item.price} × {tripMeta.travellers || 1} passenger{(tripMeta.travellers || 1) > 1 ? 's' : ''} × {item.quantity || 1} leg</span>
                            ) : isVehicle ? (
                              <span>₹{item.price} flat vehicle fare</span>
                            ) : cat.includes('stay') ? (
                              <span>₹{item.price} × {item.quantity || 1} night{(item.quantity || 1) > 1 ? 's' : ''}</span>
                            ) : (
                              <span>₹{item.price} × {item.quantity || 1}</span>
                            )}
                          </div>
                        )}

                        {/* Section 16 Notice for Excluded item */}
                        {isExcluded && (
                          <div className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block">
                            Price unknown / unverified — excluded from total
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Controls: Quantity, Line Total, Trash */}
                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                      {/* Quantity / Multiplier */}
                      <div className="text-left">
                        <label className="text-[10px] text-slate-400 block font-medium">Quantity</label>
                        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-1.5 py-0.5">
                          <button
                            type="button"
                            onClick={() => updateItemQuantity(item.id, (item.quantity || 1) - 1)}
                            className="text-slate-500 hover:text-slate-800 p-0.5"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-slate-800 w-4 text-center">
                            {item.quantity || 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateItemQuantity(item.id, (item.quantity || 1) + 1)}
                            className="text-slate-500 hover:text-slate-800 p-0.5"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Line Cost */}
                      <div className="text-right min-w-[70px]">
                        <span className="text-[10px] text-slate-400 block font-medium">Total</span>
                        <span className="text-sm font-extrabold text-slate-900">
                          {getItemLineTotal(item) === null ? (
                            <span className="text-xs text-amber-600 font-medium">Excluded</span>
                          ) : (
                            `₹${getItemLineTotal(item).toLocaleString('en-IN')}`
                          )}
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => removeFromTrip(item.id)}
                        className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg transition-colors"
                        title="Remove from itinerary"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Cost Summary & SIH Engine (4 cols) */}
        <div className="lg:col-span-4 sticky top-20 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-700" />
                <span>Budget Calculation Engine</span>
              </h2>
              <span className="text-[10px] text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full font-bold border border-teal-200">
                Integer Paise
              </span>
            </div>

            {/* Category Line Totals adhering to Section 16 */}
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Bed className="w-3.5 h-3.5 text-amber-500" />
                  <span>Stays & Accommodations:</span>
                </span>
                <span className="font-bold text-slate-800">
                  ₹{budgetCalculations.staysTotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <UtensilsCrossed className="w-3.5 h-3.5 text-orange-500" />
                  <span>Food & Dining ({tripMeta.travellers} {tripMeta.travellers === 1 ? 'person' : 'persons'}):</span>
                </span>
                <span className="font-bold text-slate-800">
                  ₹{budgetCalculations.foodTotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Landmark className="w-3.5 h-3.5 text-blue-500" />
                  <span>Monuments & Attractions:</span>
                </span>
                <span className="font-bold text-slate-800">
                  ₹{budgetCalculations.placesTotal.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-lavender-500" />
                  <span>Public & Vehicle Transport:</span>
                </span>
                <span className="font-bold text-slate-800">
                  ₹{budgetCalculations.transportTotal.toLocaleString('en-IN')}
                </span>
              </div>

              {budgetCalculations.excludedItemsCount > 0 && (
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-amber-700 text-[11px]">
                  <span>Excluded Unverified Items:</span>
                  <span className="font-bold">{budgetCalculations.excludedItemsCount} items</span>
                </div>
              )}
            </div>

            {/* Grand Total */}
            <div className="pt-3 border-t border-slate-200 bg-slate-50 p-3.5 rounded-2xl space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Grand Total:</span>
                <span className="text-xl font-black text-teal-900">
                  ₹{budgetCalculations.grandTotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500">
                <span>Internal Integer Paise:</span>
                <span className="font-mono">{budgetCalculations.grandTotalPaise} p</span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200/60">
                <span>Target Budget Limit:</span>
                <span>₹{(tripMeta.budget || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-bold pt-0.5">
                <span>Variance:</span>
                <span className={budgetCalculations.isOverBudget ? 'text-rose-600' : 'text-emerald-700'}>
                  {budgetCalculations.isOverBudget 
                    ? `+₹${Math.abs(budgetCalculations.difference).toLocaleString('en-IN')} over` 
                    : `₹${budgetCalculations.difference.toLocaleString('en-IN')} remaining`}
                </span>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              type="button"
              onClick={() => setShowExportModal(true)}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-white" />
              <span>Download PDF Estimate</span>
            </button>
          </div>

          {/* Section 16 Reference Card */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-500 space-y-1.5">
            <p className="font-bold text-slate-700">Transparent Tariff Guarantee:</p>
            <p>1. Taxis and vehicle rentals are flat rates and never multiplied by passenger count.</p>
            <p>2. Bus and train tickets scale per passenger count.</p>
            <p>3. Unknown prices are excluded from budget estimates to prevent skewed totals.</p>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareTripModal 
        isOpen={showShareModal} 
        onClose={() => setShowShareModal(false)} 
      />
    </div>
  );
}
