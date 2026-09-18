import React from 'react';
import { Heart, Trash2, Plus, ArrowRight, Eye, Navigation } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { STAYS_DATA, FOOD_DATA, PLACES_DATA, NEARBY_TRIPS_DATA } from '../data/mockData';

export default function FavouritesPage() {
  const { 
    savedFavourites, 
    toggleFavourite, 
    setViewDetailsItem, 
    setWayToItem, 
    addToTrip, 
    isItemInTrip, 
    removeFromTrip,
    setActivePage,
    goBack
  } = useApp();

  const allItems = [...STAYS_DATA, ...FOOD_DATA, ...PLACES_DATA, ...NEARBY_TRIPS_DATA];
  const favouritedItems = allItems.filter(item => savedFavourites.includes(item.id));

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-4 h-4 fill-rose-500" />
            <span>Saved Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Your Saved Favourites ({savedFavourites.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Quickly access your shortlisted stays, food spots, attractions, and excursion trips.
          </p>
        </div>

        <button
          onClick={goBack}
          className="px-4 py-2 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-700 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <span>← Back</span>
        </button>
      </div>

      {favouritedItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 max-w-lg mx-auto my-8">
          <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto text-rose-500">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No saved favourites yet</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Click the heart icon on any stay, cafe, landmark, or nearby trip card to save it for easy access here.
          </p>
          <div className="pt-2 flex justify-center gap-2">
            <button
              onClick={() => setActivePage('stays')}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              Browse Stays
            </button>
            <button
              onClick={() => setActivePage('food')}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer"
            >
              Browse Food
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {favouritedItems.map((item) => {
            const inTrip = isItemInTrip(item.id);
            const priceVal = item.price || item.avgCost || item.entryPrice || item.startingFare || 0;
            const categoryLabel = item.type || item.category || 'Listing';

            return (
              <div 
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 rounded-xl overflow-hidden mb-3 bg-slate-100">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover" 
                    />
                    <button
                      onClick={() => toggleFavourite(item.id)}
                      className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/90 hover:bg-white text-rose-500 transition-colors shadow-sm cursor-pointer"
                      title="Remove from favourites"
                    >
                      <Heart className="w-4 h-4 fill-rose-500" />
                    </button>
                    <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-md bg-white/95 text-slate-800 text-[11px] font-bold shadow-xs">
                      {categoryLabel}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base line-clamp-1">{item.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{item.location || item.address}</p>

                  <div className="mt-3 flex items-baseline justify-between pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-xs text-slate-400">Price: </span>
                      <span className="font-extrabold text-teal-700 text-sm">₹{priceVal.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400 ml-1">per person</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setViewDetailsItem(item)}
                    className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Details</span>
                  </button>

                  <button
                    onClick={() => setWayToItem(item)}
                    className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Navigation className="w-3.5 h-3.5 text-teal-600" />
                    <span>Ways</span>
                  </button>

                  <button
                    onClick={() => inTrip ? removeFromTrip(item.id) : addToTrip(item, categoryLabel)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                      inTrip ? 'bg-rose-50 text-rose-700 hover:bg-rose-100' : 'bg-teal-600 hover:bg-teal-700 text-white'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{inTrip ? 'In Trip' : 'Add'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
