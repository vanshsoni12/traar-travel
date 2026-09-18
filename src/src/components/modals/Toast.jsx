import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useTrip } from '../../context/TripContext';

export default function Toast() {
  const { toastMessage } = useTrip();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-bounce-short">
      <div className="bg-[#176B4A] text-white px-4 py-2.5 rounded shadow-lg flex items-center gap-2.5 text-xs font-medium border border-emerald-600">
        <CheckCircle className="w-4 h-4 shrink-0 text-emerald-200" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
}
