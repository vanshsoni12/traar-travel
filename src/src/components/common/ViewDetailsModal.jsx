import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Star, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  Plus, 
  Navigation,
  Phone,
  Mail,
  HelpCircle,
  Flag
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ViewDetailsModal() {
  const { 
    viewDetailsItem, 
    setViewDetailsItem, 
    addToTrip, 
    setWayToItem,
    setReportModalItem,
    startingPoint,
    calculateDistance,
    personCount
  } = useApp();

  const [selectedGalleryImg, setSelectedGalleryImg] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setViewDetailsItem(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setViewDetailsItem]);

  if (!viewDetailsItem) return null;

  const item = viewDetailsItem;
  const dist = calculateDistance(item.lat, item.lng);
  const activeImg = selectedGalleryImg || item.image;

  const isFoodOrPlace = item.cuisine || item.openingHours || item.category === 'Food' || item.category === 'Places';

  const galleryImages = (item.gallery && item.gallery.length > 0) 
    ? item.gallery 
    : (item.images && item.images.length > 0) 
      ? item.images 
      : null;

  return (
    <div 
      onClick={(e) => {
        if (e.target === e.currentTarget) setViewDetailsItem(null);
      }}
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-start sm:items-[safe_center] justify-center p-4 overflow-y-auto cursor-default"
    >
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[calc(100dvh-4rem)] overflow-y-auto shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150 my-8">
        {/* Modal Image Gallery */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-100">
          <img 
            src={activeImg} 
            alt={item.name} 
            className="w-full h-full object-cover" 
          />
          <button
            type="button"
            onClick={() => setViewDetailsItem(null)}
            className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white text-slate-800 transition-colors backdrop-blur-xs flex items-center gap-1.5 text-xs font-bold shadow-md cursor-pointer border border-slate-200/60"
            aria-label="Cancel and close details"
          >
            <X className="w-4 h-4 text-slate-600" />
            <span>Cancel</span>
          </button>
          
          <div className="absolute bottom-3 left-4 flex flex-wrap gap-2">
            <span className="px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-xs text-xs font-bold text-slate-800 shadow-sm">
              {item.type || item.category || 'Listing'}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-teal-600 text-white text-xs font-semibold shadow-sm flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Data
            </span>
          </div>
        </div>

        {/* Multi-image thumbnail strip if gallery present */}
        {galleryImages && galleryImages.length > 1 && (
          <div className="flex gap-2 p-3 bg-slate-50 border-b border-slate-100 overflow-x-auto">
            {galleryImages.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="Thumbnail"
                onClick={() => setSelectedGalleryImg(img)}
                className={`w-14 h-14 rounded-lg object-cover cursor-pointer border-2 transition-all ${
                  activeImg === img ? 'border-teal-600 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              />
            ))}
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-900">{item.name}</h2>
              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{item.address || item.location}</span>
              </div>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <div className="text-xl font-extrabold text-teal-800">
                ₹{(item.price || item.avgCost || item.entryPrice || item.startingFare || 0).toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 font-medium">
                {item.priceUnit || 'standard tariff'}
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
            {item.rating && (
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold mb-0.5">Rating</span>
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  {item.rating} ({item.reviewsCount} reviews)
                </span>
              </div>
            )}

            {item.checkInTime ? (
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold mb-0.5">Check-in / Check-out</span>
                <span className="font-bold text-slate-800 truncate block">
                  {item.checkInTime} / {item.checkOutTime}
                </span>
              </div>
            ) : item.timings || item.openingHours ? (
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block text-[10px] uppercase font-bold mb-0.5">Timings</span>
                <span className="font-bold text-slate-800 flex items-center gap-1 truncate">
                  <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  {item.timings || `${item.openingHours} – ${item.closingHours}`}
                </span>
              </div>
            ) : null}

            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold mb-0.5">Information Freshness</span>
              <span className="font-bold text-slate-800 flex items-center gap-1 truncate">
                <Calendar className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                {item.updatedDate || 'Jan 2026'}
              </span>
            </div>
          </div>

          {/* Contact Details */}
          {(item.contact || item.email) && (
            <div className="flex flex-wrap gap-4 text-xs text-slate-600 py-1">
              {item.contact && (
                <span className="flex items-center gap-1 font-medium">
                  <Phone className="w-3.5 h-3.5 text-teal-600" />
                  {item.contact}
                </span>
              )}
              {item.email && (
                <span className="flex items-center gap-1 font-medium">
                  <Mail className="w-3.5 h-3.5 text-teal-600" />
                  {item.email}
                </span>
              )}
            </div>
          )}

          {/* Section 27: Explain why a recommendation appears */}
          {item.recommendationReason && (
            <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Why this recommendation? </span>
                <span>{item.recommendationReason}</span>
              </div>
            </div>
          )}

          {/* POSITION 1: OVERVIEW (Put First per user request) */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Overview
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* POSITION 2: DISTANCE FROM YOUR STARTING POINT (Put Below Overview per user request) */}
          <div className="p-3.5 rounded-2xl bg-teal-50/70 border border-teal-200/80 text-xs text-teal-950 space-y-1">
            <div className="flex items-center justify-between font-bold">
              <span className="flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5 text-teal-700" />
                <span>Distance from your starting point</span>
              </span>
              <span className="text-[11px] text-teal-700 font-semibold">{dist.basis}</span>
            </div>

            {dist.isAvailable ? (
              <>
                <p className="font-semibold text-sm text-slate-900">
                  {dist.distanceText}
                  {dist.durationMinutes && (
                    <span className="text-slate-500 font-normal text-xs ml-2">
                      • Estimated travel duration: {dist.durationMinutes} minutes
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-slate-500">
                  Based on: Starting point: <strong>{startingPoint.label}</strong> → Destination: <strong>{item.name}</strong>
                </p>
                {dist.basis.includes('Straight-line') && (
                  <p className="text-[10px] text-amber-700 italic">
                    Actual road distance may be longer than the straight-line estimate.
                  </p>
                )}
              </>
            ) : (
              <p className="text-slate-500 text-xs">
                Distance unavailable. Choose a starting point in the top header to estimate travel distance.
              </p>
            )}
          </div>

          {/* Mini-Menu (Food) */}
          {item.miniMenu && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-orange-600 mb-2">
                Popular Dishes & Pricing
              </h3>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {item.miniMenu.map((m, i) => (
                  <div key={i} className="p-2 bg-orange-50/50 rounded-lg border border-orange-100 flex justify-between">
                    <span className="font-semibold text-slate-800">{m.item}</span>
                    <span className="font-bold text-orange-900">₹{m.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Availability Notice: ONLY for stays, REMOVED from food and places to visit */}
          {!isFoodOrPlace && item.availabilityNotes && (
            <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
              <span className="font-bold text-slate-700">Notice: </span>
              {item.availabilityNotes}
            </div>
          )}

          {/* Footer Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-100">
            {/* Report Incorrect Info */}
            <button
              onClick={() => {
                setReportModalItem(item);
              }}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Report incorrect info</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setViewDetailsItem(null)}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5 text-slate-400" />
                <span>Cancel</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setWayToItem(item);
                }}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-teal-600" />
                <span>Ways to Reach</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  addToTrip(item, item.type || item.category || 'Listing');
                  setViewDetailsItem(null);
                }}
                className="flex items-center gap-2 px-5 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add to trip</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
