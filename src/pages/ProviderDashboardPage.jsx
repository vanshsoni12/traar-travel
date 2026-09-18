import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Plus, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Trash2, 
  Eye, 
  MessageSquare, 
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Building2,
  Calendar,
  DollarSign,
  ArrowLeft,
  MapPin
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ProviderDashboardPage() {
  const { 
    providerListings, 
    deleteProviderListing, 
    setActivePage, 
    currentUserId,
    currentProviderId,
    changeUserRole,
    setViewDetailsItem,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'Approved' | 'Pending Review' | 'Rejected'

  // Show all registered provider listings so users and testers can view all filings
  const myListings = providerListings;

  const filteredListings = myListings.filter(l => {
    if (activeTab === 'all') return true;
    return l.status.toLowerCase() === activeTab.toLowerCase();
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Approved</span>
          </span>
        );
      case 'Pending Review':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Review</span>
          </span>
        );
      case 'Rejected':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected</span>
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-24 max-w-6xl mx-auto">
      {/* Top Action Ribbon */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            changeUserRole('traveller');
            setActivePage('home');
          }}
          className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-bold shadow-2xs"
          title="Return to Traveller View"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Traveller Home</span>
        </button>

        <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Active Provider: {currentProviderId || 'prov-user-1'}</span>
        </span>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-teal-100 text-teal-800">
              <LayoutDashboard className="w-4 h-4" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Provider Portal & Operations
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your verified travel listings, inspect tariffs, and review admin feedback.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setActivePage('add-service')}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-white" />
            <span>+ Add New Service</span>
          </button>
        </div>
      </div>

      {/* Provider KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-slate-400 font-semibold block uppercase">Total Filings</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{myListings.length}</span>
          <span className="text-[10px] text-slate-500 mt-0.5 block">Under provider ID {currentProviderId || currentUserId || 'prov-user-1'}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-emerald-600 font-semibold block uppercase">Live & Approved</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">
            {myListings.filter(l => l.status === 'Approved').length}
          </span>
          <span className="text-[10px] text-emerald-600/80 mt-0.5 block">Publicly searchable</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-amber-600 font-semibold block uppercase">Pending Review</span>
          <span className="text-2xl font-black text-amber-700 mt-1 block">
            {myListings.filter(l => l.status === 'Pending Review').length}
          </span>
          <span className="text-[10px] text-amber-600/80 mt-0.5 block">In admin queue</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] text-lavender-600 font-semibold block uppercase">Monthly Views</span>
          <span className="text-2xl font-black text-lavender-700 mt-1 block">1,480</span>
          <span className="text-[10px] text-lavender-600/80 mt-0.5 block">+18% this week</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {['all', 'Approved', 'Pending Review', 'Rejected'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all capitalize ${
              activeTab === tab
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab === 'all' ? `All Listings (${myListings.length})` : `${tab} (${myListings.filter(l => l.status === tab).length})`}
          </button>
        ))}
      </div>

      {/* Listings List */}
      <div className="space-y-4">
        {filteredListings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-200 p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">No listings found in this tab</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Register your hotel, hostel, restaurant, or excursion to reach thousands of verified travellers.
            </p>
            <button
              type="button"
              onClick={() => setActivePage('add-service')}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 shadow-xs cursor-pointer mt-2"
            >
              <Plus className="w-4 h-4" />
              <span>Register New Service</span>
            </button>
          </div>
        ) : (
          filteredListings.map((listing) => (
            <div
              key={listing.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-teal-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              {/* Left Details */}
              <div className="flex items-start gap-3 min-w-0">
                <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                  <img src={listing.image} alt={listing.name} className="w-full h-full object-cover" />
                </div>

                <div className="min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{listing.name}</h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 capitalize">
                      {listing.category}
                    </span>
                    {getStatusBadge(listing.status)}
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{listing.neighbourhood || listing.address || 'Bhopal'}</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-bold text-slate-900">
                      ₹{listing.price}
                      <span className="font-normal text-slate-400 text-[11px] ml-1">
                        /{listing.unit || listing.priceUnit}
                      </span>
                    </span>
                    <span>•</span>
                    <span className="text-slate-400 text-[11px]">Updated: {listing.lastUpdated || 'Jan 2026'}</span>
                  </div>

                  {/* Admin Feedback Box if present */}
                  {listing.reviewFeedback && (
                    <div className="mt-2 text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-lavender-600 shrink-0 mt-0.5" />
                      <span className="text-slate-700">
                        <strong className="text-lavender-800">Admin Feedback:</strong> {listing.reviewFeedback}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Action Buttons */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => setViewDetailsItem(listing)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>Preview</span>
                </button>

                <button
                  type="button"
                  onClick={() => deleteProviderListing(listing.id)}
                  className="px-3 py-1.5 rounded-xl border border-rose-200 text-xs font-semibold text-rose-700 hover:bg-rose-50 flex items-center gap-1 transition-colors"
                  title="Withdraw listing"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Withdraw</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
