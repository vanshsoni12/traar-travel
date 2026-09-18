import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';
import { useTrip } from '../../context/TripContext';

export default function ShareTripModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/trip?shared=bhopal-demo`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-5 shadow-xl border border-gray-200">
        <div className="flex items-center justify-between pb-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#176B4A]" />
            <h3 className="text-base font-semibold text-gray-900">Share Trip Plan</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          <p className="text-xs text-gray-600">
            Share this link with your travelling companions to let them view your Bhopal itinerary and estimated costs.
          </p>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-300 rounded text-gray-700 select-all"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-2 bg-[#176B4A] hover:bg-[#135A3E] text-white text-xs font-medium rounded flex items-center gap-1 shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="pt-3 border-t border-gray-100 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-xs border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
