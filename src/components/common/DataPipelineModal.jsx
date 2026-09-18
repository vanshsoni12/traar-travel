import React, { useState } from 'react';
import { 
  X, 
  Database, 
  ArrowRight, 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle2, 
  FileCode, 
  Layers, 
  RefreshCw,
  Server,
  Code
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function DataPipelineModal({ isOpen, onClose }) {
  const { showPipelineModal, setShowPipelineModal } = useApp();
  const [activeTab, setActiveTab] = useState('pipeline'); // 'pipeline' | 'sources' | 'payload'

  const isModalOpen = isOpen !== undefined ? isOpen : showPipelineModal;
  const handleClose = onClose || (() => setShowPipelineModal(false));

  if (!isModalOpen) return null;

  const dataSources = [
    {
      domain: 'Railway & Fares',
      sources: 'IRCTC / Indian Railways (WCR)',
      url: 'https://www.irctc.co.in',
      feedInto: 'Nearby Trips (Train Tab)',
      tariffSample: 'Bhopal to Sanchi: ₹45 (2S) • Bhopal to Ujjain: ₹110 (2S)',
      method: 'IRCTC Tariff Tables & NTES distance matrix',
      freshness: 'Verified Jan 2026'
    },
    {
      domain: 'City & Intercity Buses',
      sources: 'Bhopal City Link Ltd (BCLL) / MP Transport',
      url: 'https://www.smartbhopal.city',
      feedInto: 'Nearby Trips (Bus Tab) & Way-to Modals',
      tariffSample: 'ISBT to Sanchi: ₹65 • City Red Bus: ₹15–₹30',
      method: 'Stage fare circulars & ISBT scheduled timetables',
      freshness: 'Verified Jan 2026'
    },
    {
      domain: 'Heritage & Entry Fees',
      sources: 'Archaeological Survey of India (ASI)',
      url: 'https://asi.nic.in',
      feedInto: 'Places to Visit (Entry Tariffs)',
      tariffSample: 'Bhojpur: ₹20 • Sanchi: ₹40 • Van Vihar: ₹50',
      method: 'ASI Gazette & MP Forest Department entry notifications',
      freshness: 'Verified Jan 2026'
    },
    {
      domain: 'Hotels & Heritage Stays',
      sources: 'MP State Tourism Dev Corp (MPSTDC)',
      url: 'https://www.mpstdc.com',
      feedInto: 'Stays Directory',
      tariffSample: 'Hotel Lake View Ashok: ₹2,500/night standard rack',
      method: 'MPSTDC published tariffs & verified local registries',
      freshness: 'Verified Jan 2026'
    },
    {
      domain: 'Dining & Iconic Food',
      sources: 'Bhopal Culinary Registry & Food Outlets',
      url: 'https://manohardairy.com',
      feedInto: 'Food Directory & Meal Budgeter',
      tariffSample: 'Manohar Dairy: ₹200/person • ICH: ₹150/person',
      method: 'Standard menu cards & local verified price surveys',
      freshness: 'Verified Jan 2026'
    }
  ];

  const sampleJsonPayload = `{
  "id": "nearby-1-bus",
  "route": "Bhopal (ISBT) to Sanchi",
  "distance_km": 46,
  "transport_mode": "bus",
  "operator": "BCLL & MP Intercity State Express",
  "fare_inr": 65,
  "fare_unit": "per passenger / one way",
  "timings": {
    "first_departure": "06:00 AM",
    "last_departure": "08:30 PM",
    "frequency": "Every 30 mins"
  },
  "source_authority": "Bhopal City Link Limited (BCLL)",
  "verification_status": "VERIFIED_SIH2026",
  "last_verified_date": "2026-01-14T10:30:00Z"
}`;

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto cursor-default"
    >
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150 my-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-50 text-teal-800 rounded-xl border border-teal-200/60">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-slate-900">
                  Data Architecture & Provenance Engine
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold uppercase">
                  SIH 2026 Demo
                </span>
              </div>
              <p className="text-xs text-slate-500">
                How TRAAR acquires, validates, and feeds real-world travel data into the platform
              </p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 pt-4 pb-2">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'pipeline' 
                ? 'bg-teal-700 text-white shadow-xs' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            1. Ingestion Pipeline (Flow)
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'sources' 
                ? 'bg-teal-700 text-white shadow-xs' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            2. Source Registry (Provenance)
          </button>
          <button
            onClick={() => setActiveTab('payload')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'payload' 
                ? 'bg-teal-700 text-white shadow-xs' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            3. Live Schema Payload (JSON)
          </button>
        </div>

        {/* Tab 1: Pipeline Architecture */}
        {activeTab === 'pipeline' && (
          <div className="space-y-4 py-2 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {/* Step 1 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2">
                <div>
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs mb-2">
                    1
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Extraction</h4>
                  <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
                    Automated collectors fetch from official public sources (IRCTC, BCLL, ASI, MPSTDC) and the <strong>Provider Portal</strong>.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-2 py-1 rounded">
                  ETL Batch & Webhook
                </span>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2">
                <div>
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs mb-2">
                    2
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Validation Engine</h4>
                  <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
                    Cross-references tariffs against government Gazette slabs, strips unverified claims, and assigns a freshness timestamp.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2 py-1 rounded">
                  Pydantic / Schema Check
                </span>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-2">
                <div>
                  <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xs mb-2">
                    3
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">Database & Store</h4>
                  <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
                    Loaded into indexed relational/JSON storage. Unverified items enter <strong>Pending Review</strong> in Provider Dashboard.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-1 rounded">
                  SQLite / PostGIS / JSON
                </span>
              </div>

              {/* Step 4 */}
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex flex-col justify-between space-y-2">
                <div>
                  <div className="w-6 h-6 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center text-xs mb-2">
                    4
                  </div>
                  <h4 className="font-bold text-teal-950 text-sm">Frontend Feed</h4>
                  <p className="text-teal-800 text-[11px] mt-1 leading-relaxed">
                    Components consume data via <code>AppContext</code>. Real-time budget engine calculates totals and triggers limit warnings.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-teal-900 bg-teal-100 px-2 py-1 rounded font-bold">
                  React Reactive State
                </span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
              <h5 className="font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Why We Don't Rely on Uncached Live Web Scraping</span>
              </h5>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                Live scraping public government servers on every user page load creates latency, breaks when DOM structures shift, and risks rate-limiting. TRAAR utilizes an <strong>Aggregated Cache Pipeline</strong>: tariffs are verified and cached locally with transparent freshness timestamps (e.g. <i>"Updated 14 Jan 2026"</i>), delivering sub-50ms page responsiveness.
              </p>
            </div>
          </div>
        )}

        {/* Tab 2: Source Registry Table */}
        {activeTab === 'sources' && (
          <div className="space-y-3 py-2">
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-2.5 px-3">Domain</th>
                    <th className="py-2.5 px-3">Official Authority</th>
                    <th className="py-2.5 px-3">Feeds Into Feature</th>
                    <th className="py-2.5 px-3">Sample Tariff Benchmark</th>
                    <th className="py-2.5 px-3">Freshness</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {dataSources.map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-bold text-slate-900">{s.domain}</td>
                      <td className="py-2.5 px-3">
                        <a 
                          href={s.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-teal-700 hover:underline flex items-center gap-1 font-medium"
                        >
                          <span>{s.sources}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">{s.feedInto}</td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">{s.tariffSample}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-teal-50 text-teal-800 text-[10px] font-bold border border-teal-200">
                          {s.freshness}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Live Schema Payload */}
        {activeTab === 'payload' && (
          <div className="space-y-3 py-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">
                Sample Normalized Transport Entity (Fed into <code>NearbyTripsPage.jsx</code>)
              </span>
              <span className="text-[11px] text-slate-500 font-mono">
                Schema: SIH_TRAAR_TRANSPORT_V1
              </span>
            </div>
            <pre className="p-4 rounded-2xl bg-slate-950 text-teal-300 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
              {sampleJsonPayload}
            </pre>
            <p className="text-[11px] text-slate-500">
              Every card rendered on the TRAAR website is bound to this standardized JSON schema. If an operator fare or departure time is missing from the source registry, the UI displays <i>"Not available"</i> instead of fabricating speculative values.
            </p>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 mt-4 text-xs">
          <span className="text-slate-500 text-[11px]">
            Ready for live demonstration during SIH 2026 Jury Presentation
          </span>
          <button
            onClick={handleClose}
            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-xs transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
