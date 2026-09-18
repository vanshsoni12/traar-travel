import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  FileText, 
  ShieldCheck, 
  Info,
  Calendar,
  Users,
  MapPin
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ExportEstimateModal({ isOpen, onClose }) {
  const { 
    showExportModal, 
    setShowExportModal, 
    tripItems, 
    budgetCalculations, 
    selectedDestination, 
    tripMeta,
    travellerCount,
    showToast 
  } = useApp();

  const isModalOpen = isOpen !== undefined ? isOpen : showExportModal;
  const handleClose = onClose || (() => setShowExportModal(false));

  const printRef = useRef(null);

  if (!isModalOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    showToast('Preparing printable itinerary estimate...');
    window.print();
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

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) setShowExportModal(false);
      }}
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto cursor-default print:p-0 print:bg-white"
    >
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 animate-in zoom-in-95 duration-150 my-8 print:shadow-none print:border-none print:m-0 print:p-4">
        {/* Modal Top Bar (hidden during print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-teal-50 text-teal-800 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Official Trip Estimate & Itinerary Summary
              </h2>
              <p className="text-xs text-slate-500">
                Verified Tariff Documentation · Transparent Travel Intelligence
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Estimate Sheet */}
        <div ref={printRef} className="space-y-6 text-slate-800">
          {/* Header Brand & Metadata */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b-2 border-teal-900">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-teal-950">TRAAR</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-teal-900 text-teal-200">
                  Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                “Explore India. Support Local.” · Travel Intelligence
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-600 font-medium">
                <MapPin className="w-3.5 h-3.5 text-teal-700" />
                <span>Destination: <strong>{selectedDestination.name} ({selectedDestination.state})</strong></span>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-600 space-y-1">
              <p><strong className="text-slate-800">Date Issued:</strong> {new Date().toLocaleDateString('en-IN')}</p>
              <p><strong className="text-slate-800">Travellers:</strong> {travellerCount} Persons</p>
              <p><strong className="text-slate-800">Schedule:</strong> 3-Day Regional Plan</p>
            </div>
          </div>

          {/* Table of Selected Items */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Day</th>
                  <th className="py-2.5 px-3">Service / Activity</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3 text-right">Unit Tariff</th>
                  <th className="py-2.5 px-3 text-right">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tripItems.map((item) => {
                  const isExcluded = item.isUnknownPrice || item.price === null || item.price === undefined;
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-semibold text-slate-600">Day {item.dayNumber || 1}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        {item.title || item.name}
                        {item.isVehicleRate && (
                          <span className="block text-[10px] font-normal text-emerald-700">Vehicle rate (Flat)</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 capitalize text-slate-600">{item.category}</td>
                      <td className="py-2.5 px-3 text-right text-slate-600 font-mono">
                        {isExcluded ? 'N/A' : `₹${(item.price || 0).toLocaleString('en-IN')}`}
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900 font-mono">
                        {isExcluded || getItemLineTotal(item) === null ? (
                          <span className="text-[10px] text-amber-600 font-medium">Excluded</span>
                        ) : (
                          `₹${getItemLineTotal(item).toLocaleString('en-IN')}`
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Cost Summary Box (Section 16 Rules) */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-2 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Stays</span>
                <span className="text-sm font-bold text-slate-800">
                  ₹{budgetCalculations.staysTotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Food</span>
                <span className="text-sm font-bold text-slate-800">
                  ₹{budgetCalculations.foodTotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Places</span>
                <span className="text-sm font-bold text-slate-800">
                  ₹{budgetCalculations.placesTotal.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="p-2 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Transport</span>
                <span className="text-sm font-bold text-slate-800">
                  ₹{budgetCalculations.transportTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-slate-900 block">
                  Grand Estimated Budget: ₹{budgetCalculations.grandTotal.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-500">
                  Integer paise computation: {budgetCalculations.grandTotalPaise} paise
                </span>
              </div>

              {budgetCalculations.excludedItemsCount > 0 && (
                <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                  {budgetCalculations.excludedItemsCount} unverified price items excluded
                </span>
              )}
            </div>
          </div>

          {/* Official Disclaimer & Verification Note */}
          <div className="p-3.5 bg-teal-50/60 rounded-xl border border-teal-100 text-[11px] text-teal-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-teal-950">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
              <span>Official Tariff Audit Notice</span>
            </div>
            <p className="leading-relaxed">
              This estimate is computed strictly using verified published tariffs from state tourism corporations, municipal transport stage schedules, and Archaeological Survey of India (ASI) gazettes. Fares and fees are subject to seasonal revisions. Vehicle fares are not multiplied by passenger count.
            </p>
          </div>
        </div>

        {/* Action Buttons (hidden during print) */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 print:hidden">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
