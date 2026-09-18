import React from 'react';
import { CheckCircle2, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Toast() {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
      <div className="bg-white text-slate-800 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold border border-slate-200/90 backdrop-blur-md">
        <CheckCircle2 className="w-4 h-4 shrink-0 text-teal-600" />
        <span>{toastMessage}</span>
      </div>
    </div>
  );
}
