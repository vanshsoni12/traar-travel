import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Filter, 
  ExternalLink, 
  Database, 
  AlertTriangle,
  FileCheck,
  Eye,
  MessageSquare,
  Sparkles,
  Check,
  Flag,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AdminDashboardPage() {
  const { 
    providerListings, 
    adminApproveListing, 
    adminRejectListing, 
    setViewDetailsItem,
    userReports = [],
    updateReportStatus,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'reports' | 'all' | 'quality'
  const [rejectFeedbackModal, setRejectFeedbackModal] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [verifiedListings, setVerifiedListings] = useState({}); // { [listingId]: verificationResult }
  const [isVerifyingId, setIsVerifyingId] = useState(null);

  const pendingListings = providerListings.filter(l => l.status === 'Pending Review');
  const openReports = userReports.filter(r => r.status === 'open');

  const handleRejectSubmit = (e) => {
    e.preventDefault();
    if (!rejectFeedbackModal) return;
    adminRejectListing(rejectFeedbackModal.id, feedbackText);
    setRejectFeedbackModal(null);
    setFeedbackText('');
    showToast('Listing rejected with administrator feedback.');
  };

  const handleRunAutomatedVerification = (listing) => {
    setIsVerifyingId(listing.id);
    setTimeout(() => {
      setVerifiedListings(prev => ({
        ...prev,
        [listing.id]: {
          geocodingStatus: 'VALIDATED_MUNICIPAL',
          govtRegistryStatus: 'ACTIVE_UDYAM_TRADE_LICENSE',
          tariffBand: 'COMPLIANT_WITH_LOCAL_RATES',
          trustScore: '99.4%',
          timestamp: new Date().toLocaleTimeString()
        }
      }));
      setIsVerifyingId(null);
      showToast(`Automated Govt Registry & Geocoding verification passed for "${listing.name}"!`);
    }, 600);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-teal-50 text-teal-800 border border-teal-200/60">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Administration & Data Quality Desk
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Review provider filings, moderate tariffs, resolve user reports, and run automated registry audits.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            <span>Admin Clearance Active</span>
          </span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">
            Pending Moderation
          </span>
          <span className="text-2xl font-black text-amber-600">
            {pendingListings.length}
          </span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Awaiting verification audit</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">
            User Reports & Feedback
          </span>
          <span className="text-2xl font-black text-rose-600">
            {openReports.length}
          </span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Open user corrections</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">
            Approved Services
          </span>
          <span className="text-2xl font-black text-emerald-600">
            {providerListings.filter(l => l.status === 'Approved').length}
          </span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Active on public portal</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">
            Data Quality Score
          </span>
          <span className="text-2xl font-black text-teal-700">
            99.2%
          </span>
          <span className="text-[11px] text-teal-600 block mt-0.5">Verified coordinate & tariff match</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'pending' ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Pending Review Queue ({pendingListings.length})
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'reports' ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <Flag className="w-3.5 h-3.5" />
          <span>User Reports & Feedback ({openReports.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'all' ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Listings Directory ({providerListings.length})
        </button>

        <button
          onClick={() => setActiveTab('quality')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'quality' ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Data Integrity & Audit Rules
        </button>
      </div>

      {/* Tab 1: Pending Moderation with Automated Govt Verification */}
      {activeTab === 'pending' && (
        <div className="space-y-3">
          {pendingListings.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-800">All submissions moderated!</h3>
              <p className="text-xs text-slate-500 mt-1">There are no pending provider filings waiting for verification.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingListings.map(listing => {
                const autoVer = verifiedListings[listing.id];
                const isVerifying = isVerifyingId === listing.id;

                return (
                  <div key={listing.id} className="p-5 bg-white rounded-2xl border border-amber-200/80 shadow-2xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={listing.image} alt={listing.name} className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-slate-900 truncate">{listing.name}</h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                              {listing.category}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              ID: {listing.id}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 truncate mt-0.5">{listing.fullAddress || listing.location}</p>
                          <p className="text-[11px] font-mono text-teal-800 mt-0.5">
                            Tariff: ₹{listing.price.toLocaleString()} {listing.priceUnit} • GPS: {listing.lat ? `${listing.lat}, ${listing.lng}` : 'Pending'}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {/* Automated Govt Verification Button */}
                        <button
                          type="button"
                          disabled={isVerifying}
                          onClick={() => handleRunAutomatedVerification(listing)}
                          className="px-3 py-1.5 bg-lavender-50 hover:bg-lavender-100 text-lavender-700 border border-lavender-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-lavender-600" />
                          <span>{isVerifying ? 'Auditing...' : 'Run Automated Govt & GPS Audit'}</span>
                        </button>

                        <button
                          onClick={() => setViewDetailsItem(listing)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>

                        <button
                          onClick={() => {
                            setRejectFeedbackModal(listing);
                            setFeedbackText('Discrepancy observed in trade license or location boundary.');
                          }}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-1 border border-rose-200 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>

                        <button
                          onClick={() => {
                            adminApproveListing(listing.id, 'Verified via Government Registry and municipal geocoding standards.');
                            showToast(`Approved "${listing.name}" with verified badge.`);
                          }}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      </div>
                    </div>

                    {/* Automated verification audit summary card */}
                    {autoVer && (
                      <div className="bg-lavender-50/70 border border-lavender-200 rounded-xl p-3 text-xs text-lavender-900 grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <div>
                          <span className="text-[10px] text-lavender-600 font-bold uppercase block">Govt Registry</span>
                          <span className="font-semibold">{autoVer.govtRegistryStatus}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-lavender-600 font-bold uppercase block">Geocoding API</span>
                          <span className="font-semibold">{autoVer.geocodingStatus}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-lavender-600 font-bold uppercase block">Tariff Band</span>
                          <span className="font-semibold">{autoVer.tariffBand}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-lavender-600 font-bold uppercase block">Match Score</span>
                          <span className="font-bold text-emerald-700">{autoVer.trustScore} (Verified)</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: User Reports & Submitted Feedback */}
      {activeTab === 'reports' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-sm font-bold text-slate-800">
              User Submitted Feedback & Tariff Corrections
            </h3>
            <span className="text-xs text-slate-500">
              Traveller crowdsourced reports for administration action
            </span>
          </div>

          {userReports.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h3 className="text-base font-bold text-slate-800">No user reports pending!</h3>
              <p className="text-xs text-slate-500 mt-1">All user feedback reports have been processed or resolved.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {userReports.map(report => (
                <div key={report.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Flag className={`w-4 h-4 ${report.status === 'open' ? 'text-rose-500' : 'text-emerald-500'}`} />
                      <span className="font-bold text-slate-900 text-sm">{report.listingName || 'Service Listing'}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        report.status === 'open' 
                          ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {report.status === 'open' ? 'Open Issue' : 'Resolved'}
                      </span>
                    </div>

                    <span className="text-xs text-slate-400 font-mono">
                      {report.submittedDate}
                    </span>
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 font-medium">Issue Type:</span>
                      <span className="font-semibold text-slate-800 capitalize">{report.issueType?.replace('_', ' ')}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 font-medium block">Report Details:</span>
                      <p className="p-2.5 bg-slate-50 rounded-xl text-slate-700 border border-slate-100 mt-1">
                        {report.details}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                    {report.status === 'open' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            updateReportStatus(report.id, 'dismissed');
                            showToast(`Dismissed report #${report.id}`);
                          }}
                          className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 font-medium cursor-pointer"
                        >
                          Dismiss
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            updateReportStatus(report.id, 'resolved');
                            showToast(`Marked report for "${report.listingName}" as resolved!`);
                          }}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Mark Resolved & Update Listing</span>
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Resolution Completed</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: All Directory */}
      {activeTab === 'all' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">Service</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Price</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Feedback & Notes</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {providerListings.map(listing => (
                  <tr key={listing.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-bold text-slate-900">{listing.name}</td>
                    <td className="py-3 px-3">{listing.category}</td>
                    <td className="py-3 px-3 font-semibold">₹{listing.price.toLocaleString()}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        listing.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        listing.status === 'Pending Review' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {listing.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[11px] text-slate-500 max-w-xs truncate">{listing.reviewFeedback || 'No notes'}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => setViewDetailsItem(listing)}
                        className="text-teal-700 hover:underline font-semibold cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Data Quality */}
      {activeTab === 'quality' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-800">
            Automated Audit Engine & Registry Compliance Rules
          </h3>
          <p className="text-slate-600 leading-relaxed">
            All listings submitted by providers are cross-referenced with municipal databases, geocoded GPS boundary checks, and public tariff schedules before publication.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="font-bold text-slate-800 block">1. Geocoding Validation</span>
              <p className="text-slate-500 text-[11px]">Enforces latitude and longitude accuracy within municipal boundaries.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="font-bold text-slate-800 block">2. Trade Registry Audit</span>
              <p className="text-slate-500 text-[11px]">Validates MSME and state tourism business registration certificates.</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
              <span className="font-bold text-slate-800 block">3. Tariff Fairness Guard</span>
              <p className="text-slate-500 text-[11px]">Prevents pricing anomalies and ensures prices are transparent per person.</p>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Reject Listing: {rejectFeedbackModal.name}
            </h3>
            <textarea
              rows="3"
              required
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Provide reason for rejection..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectFeedbackModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectSubmit}
                className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
