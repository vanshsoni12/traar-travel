import React, { useState } from 'react';
import { X, ChevronDown, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function HelpBoothModal() {
  const { showHelpModal, setShowHelpModal } = useApp();
  const [openIndex, setOpenIndex] = useState(0); // First question open by default as shown in Screen 09

  if (!showHelpModal) return null;

  const faqs = [
    {
      question: 'How do I plan a trip?',
      answer: 'Search a city, choose your starting point, then open Stays, Places to visit, Food or Nearby trips. Add only the items you need.'
    },
    {
      question: 'How do prices and receipts work?',
      answer: 'Prices shown are estimated sample rates or verified tariffs. You can review and download a free PDF/printable receipt estimate of your planned trip at any time from the right-hand trip planner.'
    },
    {
      question: 'Why are some distances or pictures missing?',
      answer: 'Some local listings in the demo dataset lack exact GPS coordinates or photographic records. We label them as unverified or straight-line estimates until provider-supplied data is verified.'
    },
    {
      question: 'Are bookings and providers verified?',
      answer: 'In this preview demo, Traar facilitates travel planning and discovery only. We do not process direct financial transactions or hotel reservations.'
    },
    {
      question: 'Will my plan be saved?',
      answer: 'Your current plan stays active in your browser session while you explore different tabs and categories. You can download the complete estimate receipt before leaving.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 tracking-tight">
            Help Booth
          </h3>
          <button
            onClick={() => setShowHelpModal(false)}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Accordion List */}
        <div className="divide-y divide-slate-100 p-2">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="py-2.5 px-3">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                  className="w-full text-left flex items-start gap-2.5 text-xs font-semibold text-slate-800 hover:text-blue-600 transition-colors focus:outline-none"
                >
                  <span className="text-slate-400 mt-0.5 shrink-0">
                    {isOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </span>
                  <span>{faq.question}</span>
                </button>

                {isOpen && (
                  <div className="mt-2 ml-6 text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-md border border-slate-100">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
