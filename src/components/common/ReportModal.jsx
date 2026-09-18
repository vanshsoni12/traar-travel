import React, { useState } from 'react';
import { X, AlertCircle, CheckCircle2, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ReportModal() {
  const { reportModalItem, setReportModalItem, submitUserReport, showToast } = useApp();
  const [reportType, setReportType] = useState('price_mismatch');
  const [notes, setNotes] = useState('');

  if (!reportModalItem) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (submitUserReport) {
      submitUserReport({
        listingId: reportModalItem.id,
        listingName: reportModalItem.name,
        issueType: reportType,
        details: notes,
        type: reportModalItem.type || reportModalItem.category || 'Listing'
      });
    } else {
      showToast(`Report submitted for ${reportModalItem.name}`);
    }
    setReportModalItem(null);
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2 text-amber-700 font-bold text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>Report Incorrect Information</span>
          </div>
          <button onClick={() => setReportModalItem(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-500">
          Help the administration maintain verified, trustworthy travel intelligence for <strong>{reportModalItem.name}</strong>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Issue Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
            >
              <option value="price_mismatch">Outdated Tariff or Price Mismatch</option>
              <option value="wrong_timings">Inaccurate Opening/Closing Hours</option>
              <option value="wrong_location">Incorrect Address or GPS Coordinates</option>
              <option value="closed_down">Establishment Closed or Unreachable</option>
              <option value="other">Other Information Correction</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Correction Details</label>
            <textarea
              rows="3"
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Explain the correct tariff or information based on your observation..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setReportModalItem(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Report</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
