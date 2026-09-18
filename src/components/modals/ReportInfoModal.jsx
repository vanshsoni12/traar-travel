import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useTrip } from '../../context/TripContext';

export default function ReportInfoModal({ isOpen, onClose, itemName = 'this listing' }) {
  if (!isOpen) return null;

  const { showToast } = useTrip();
  const [issueType, setIssueType] = useState('price');
  const [details, setDetails] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast('Thank you! Information report submitted to admin review.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-5 shadow-xl border border-gray-200">
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <h3 className="text-base font-semibold text-gray-900">
              Report incorrect information
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3 text-xs">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Listing:</label>
            <p className="font-semibold text-gray-800">{itemName}</p>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">What is incorrect?</label>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-gray-800 bg-white"
            >
              <option value="price">Price or tariff is outdated</option>
              <option value="timings">Timings or opening hours changed</option>
              <option value="address">Address or road location incorrect</option>
              <option value="permanently_closed">Listing is closed or moved</option>
              <option value="other">Other issue</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Details & corrections:</label>
            <textarea
              required
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Please describe what should be updated (e.g. current entry fee is ₹150)..."
              className="w-full p-2 border border-gray-300 rounded text-gray-800 placeholder:text-gray-400"
            />
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 bg-[#176B4A] hover:bg-[#135A3E] text-white font-medium rounded"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
