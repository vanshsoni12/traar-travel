import React, { useRef } from 'react';
import { X, Printer, Download, Check } from 'lucide-react';
import { useTrip } from '../../context/TripContext';

export default function ExportEstimateModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const { tripItems, estimatedTotal, budget, remainingBudget, calculateItemTotal } = useTrip();
  const printRef = useRef(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-xl border border-gray-200">
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Export Trip Estimate
            </h3>
            <p className="text-xs text-gray-500">
              TRAAR · Verified Trip Estimate
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

        {/* Printable Area */}
        <div ref={printRef} className="my-4 p-4 border border-gray-200 rounded-md bg-white text-gray-800 text-sm">
          <div className="flex justify-between items-start border-b border-gray-200 pb-3 mb-4">
            <div>
              <span className="text-xl font-bold text-[#176B4A]">TRAAR</span>
              <p className="text-xs text-gray-500">Travel · Explore · Belong</p>
            </div>
            <div className="text-right text-xs text-gray-500">
              <p>Trip: <strong>Bhopal 2-Day Itinerary</strong></p>
              <p>Dates: 20 – 21 Sep 2026</p>
            </div>
          </div>

          <table className="w-full text-xs text-left border-collapse mb-4">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-gray-600">
                <th className="py-2 px-2">Item</th>
                <th className="py-2 px-2">Category</th>
                <th className="py-2 px-2 text-right">Unit Price</th>
                <th className="py-2 px-2 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tripItems.map((item) => (
                <tr key={item.id}>
                  <td className="py-2 px-2">
                    <span className="font-medium text-gray-800">{item.name}</span>
                    <span className="text-gray-400 block text-[10px]">{item.sublabel}</span>
                  </td>
                  <td className="py-2 px-2 text-gray-500">{item.category}</td>
                  <td className="py-2 px-2 text-right text-gray-600">
                    {item.price !== null ? `₹${item.price.toLocaleString('en-IN')}` : 'Unavailable'}
                  </td>
                  <td className="py-2 px-2 text-right font-medium text-gray-900">
                    {item.price !== null ? `₹${calculateItemTotal(item).toLocaleString('en-IN')}` : 'Excluded'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t border-gray-200 pt-3 space-y-1.5 text-xs text-right">
            <div className="flex justify-end gap-6">
              <span className="text-gray-500">Trip Budget:</span>
              <span className="font-semibold text-gray-800">₹{budget.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-end gap-6">
              <span className="text-gray-500">Estimated Total:</span>
              <span className="font-bold text-gray-900">₹{estimatedTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-end gap-6">
              <span className="text-gray-500">Balance Remaining:</span>
              <span className={`font-semibold ${remainingBudget >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                ₹{remainingBudget.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-dashed border-gray-200 text-[10px] text-gray-400">
            * Note: This is an informational student estimate created on TRAAR and not an official booking receipt. Prices subject to on-ground provider confirmation.
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
          >
            Done
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 text-xs bg-[#176B4A] hover:bg-[#135A3E] text-white rounded font-medium inline-flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
}
