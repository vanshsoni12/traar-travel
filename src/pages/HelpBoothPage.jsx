import React, { useState } from 'react';
import { 
  HelpCircle, 
  Phone, 
  ShieldAlert, 
  Bus, 
  MapPin, 
  FileText, 
  Database, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp, 
  Info,
  Car,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HELP_FAQS } from '../data/mockData';
export default function HelpBoothPage() {
  const { selectedDestination, showToast, setShowPipelineModal } = useApp();
  const [expandedFaq, setExpandedFaq] = useState(null);

  const emergencyContacts = [
    { name: 'Police Emergency Response', number: '100 / 112', desc: 'Statewide 24/7 emergency assistance' },
    { name: 'Medical Ambulance & Emergency', number: '108', desc: 'Government emergency ambulance service' },
    { name: 'Women Helpline', number: '1090', desc: 'Toll-free 24/7 dedicated support' },
    { name: 'MP Tourism Official Helpline', number: '1800 233 7777', desc: 'Tourist queries, booking aid & guides' },
    { name: 'Bhopal City Smart Helpline', number: '155304', desc: 'Municipal civic & tourist grievances' }
  ];

  const transitGuides = [
    {
      title: 'BCLL Red City Bus Network',
      mode: 'City Bus',
      desc: 'Over 25 routes connecting Bhopal Junction, Habibganj (RKMP), Upper Lake, Bairagarh, and Mandideep.',
      fare: '₹10 – ₹35 depending on distance stages',
      tip: 'Chalo Card / App accepted across all air-conditioned red buses.'
    },
    {
      title: 'Raja Bhoj Airport (BHO) Prepaid Taxis',
      mode: 'Airport Taxi',
      desc: 'Official police-regulated prepaid counter inside arrival hall terminal.',
      fare: '₹450 – ₹600 flat tariff to MP Nagar / New Market',
      tip: 'Do not pay unauthorized touts outside the main glass gates.'
    },
    {
      title: 'Railway Cloakrooms & Retiring Rooms',
      mode: 'Luggage Storage',
      desc: 'Available at Platform 1 of Bhopal Junction (BPL) and Rani Kamlapati (RKMP).',
      fare: '₹20 – ₹40 for 24 hours per locked piece',
      tip: 'Valid train ticket and lock/key mandatory for cloakroom intake.'
    }
  ];

  return (
    <div className="space-y-8 pb-24 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-teal-100 text-teal-800">
              <HelpCircle className="w-4 h-4" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Tourist Assistance & Help Booth
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Emergency helplines, local transport guides, safety tips, and verified tourism assistance.
          </p>
        </div>
      </div>

      {/* Emergency Contacts Cards */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-rose-800 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4" />
          <span>24/7 Verified Emergency Helplines</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {emergencyContacts.map((contact, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-slate-800 block">{contact.name}</span>
                <p className="text-[11px] text-slate-500 mt-0.5">{contact.desc}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-sm font-mono font-extrabold text-rose-700">{contact.number}</span>
                <a
                  href={`tel:${contact.number.split('/')[0].trim()}`}
                  className="px-2.5 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Local Transport Guidelines */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-teal-800 flex items-center gap-2">
          <Bus className="w-4 h-4" />
          <span>Verified Local Public Transport Advice</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {transitGuides.map((guide, i) => (
            <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{guide.title}</span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                  {guide.mode}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{guide.desc}</p>
              <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-100 text-xs text-teal-900 space-y-1">
                <p><strong className="text-teal-950">Official Tariff:</strong> {guide.fare}</p>
                <p className="text-[11px] text-teal-800"><strong className="text-teal-950">Traveller Tip:</strong> {guide.tip}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-teal-800 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span>Frequently Asked Questions (FAQ)</span>
        </h2>

        <div className="space-y-2">
          {HELP_FAQS.map((faq) => {
            const isOpen = expandedFaq === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-800 hover:text-teal-800"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
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
