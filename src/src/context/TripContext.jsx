import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const TripContext = createContext(null);

const STORAGE_KEY = 'traar_trip_state_v1';

const INITIAL_TRIP_ITEMS = [
  {
    id: 'trip-stay-1',
    sourceId: 'bhopal-heritage-stay',
    name: 'Heritage Stay',
    sublabel: 'Bhopal Heritage Hotel (Sample data · UI preview)',
    category: 'Stay',
    price: 1200,
    priceUnit: 'room / night',
    unitType: 'room',
    periodType: 'night',
    rooms: 1,
    nights: 1,
    day: 'day1',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80',
    isExcluded: false
  },
  {
    id: 'trip-food-1',
    sourceId: 'lakeview-kitchen',
    name: 'Lunch',
    sublabel: 'Local restaurant (Sample data · UI preview)',
    category: 'Food',
    price: 250,
    priceUnit: 'person / meal',
    unitType: 'people',
    periodType: 'meal',
    people: 2,
    meals: 1,
    day: 'day1',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80',
    isExcluded: false
  },
  {
    id: 'trip-place-1',
    sourceId: 'tribal-museum',
    name: 'Museum',
    sublabel: 'State Museum Bhopal (Sample data · UI preview)',
    category: 'Place',
    price: 100,
    priceUnit: 'ticket',
    unitType: 'ticket',
    tickets: 2,
    day: 'day1',
    image: 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?auto=format&fit=crop&w=400&q=80',
    isExcluded: false
  },
  {
    id: 'trip-trans-1',
    sourceId: 'local-transport',
    name: 'Local transport',
    sublabel: '(Sample data · UI preview)',
    category: 'Transport',
    price: null,
    priceUnit: '',
    reason: 'Price unavailable (excluded from estimate)',
    day: 'day1',
    image: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?auto=format&fit=crop&w=400&q=80',
    isExcluded: true
  }
];

const INITIAL_PROVIDER_LISTINGS = [
  {
    id: 'prov-1',
    name: 'Heritage Stay',
    category: 'Stay',
    status: 'Approved',
    updated: '12 Sep 2026',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=150&q=80',
    reviewFeedback: null
  },
  {
    id: 'prov-2',
    name: 'Lakeview Kitchen',
    category: 'Food',
    status: 'Pending review',
    updated: '13 Sep 2026',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=150&q=80',
    reviewFeedback: 'Address details needed.'
  },
  {
    id: 'prov-3',
    name: 'City Taxi',
    category: 'Transport',
    status: 'Draft',
    updated: '14 Sep 2026',
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=150&q=80',
    reviewFeedback: null
  }
];

const INITIAL_ADMIN_REVIEWS = [
  {
    id: 'admin-rev-1',
    name: 'Lakeview Kitchen',
    category: 'Food',
    status: 'Pending',
    submittedOn: '14 Apr 2025',
    address: 'Van Vihar Road, Near Upper Lake, Bhopal, Madhya Pradesh 462016',
    price: '₹250 / person / meal',
    photosCount: 3,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=300&q=80',
    providerEvidence: 'Private (visible to admins only)',
    reviewerNote: ''
  },
  {
    id: 'admin-rev-2',
    name: 'City Taxi',
    category: 'Transport',
    status: 'Pending',
    submittedOn: '12 Apr 2025',
    address: 'Bhopal Junction Platform 1 Taxi Stand, Bhopal 462001',
    price: '₹12 / km estimate',
    photosCount: 2,
    image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=300&q=80',
    providerEvidence: 'RTO Commercial Permit Uploaded',
    reviewerNote: ''
  }
];

export function TripProvider({ children }) {
  // Load saved state or use defaults
  const [selectedState, setSelectedState] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_state`);
      return saved || 'Madhya Pradesh';
    } catch {
      return 'Madhya Pradesh';
    }
  });

  const [selectedCity, setSelectedCity] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_city`);
      return saved || 'Bhopal';
    } catch {
      return 'Bhopal';
    }
  });

  const [startingPoint, setStartingPoint] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_startpoint`);
      return saved || 'city_centre';
    } catch {
      return 'city_centre';
    }
  });

  const [budget, setBudget] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_budget`);
      return saved ? Number(saved) : 3000;
    } catch {
      return 3000;
    }
  });

  const [tripItems, setTripItems] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_items`);
      return saved ? JSON.parse(saved) : INITIAL_TRIP_ITEMS;
    } catch {
      return INITIAL_TRIP_ITEMS;
    }
  });

  const [providerListings, setProviderListings] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_prov`);
      return saved ? JSON.parse(saved) : INITIAL_PROVIDER_LISTINGS;
    } catch {
      return INITIAL_PROVIDER_LISTINGS;
    }
  });

  const [adminReviews, setAdminReviews] = useState(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_admin`);
      return saved ? JSON.parse(saved) : INITIAL_ADMIN_REVIEWS;
    } catch {
      return INITIAL_ADMIN_REVIEWS;
    }
  });

  // Modal & Notification States
  const [activeModal, setActiveModal] = useState(null); // { type: 'directions'|'export'|'share'|'report', data: any }
  const [toastMessage, setToastMessage] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_state`, selectedState);
      localStorage.setItem(`${STORAGE_KEY}_city`, selectedCity);
      localStorage.setItem(`${STORAGE_KEY}_startpoint`, startingPoint);
      localStorage.setItem(`${STORAGE_KEY}_budget`, budget.toString());
      localStorage.setItem(`${STORAGE_KEY}_items`, JSON.stringify(tripItems));
      localStorage.setItem(`${STORAGE_KEY}_prov`, JSON.stringify(providerListings));
      localStorage.setItem(`${STORAGE_KEY}_admin`, JSON.stringify(adminReviews));
    } catch (e) {
      console.error('Storage sync error:', e);
    }
  }, [selectedState, selectedCity, startingPoint, budget, tripItems, providerListings, adminReviews]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Calculations per item
  const calculateItemTotal = (item) => {
    if (item.isExcluded || item.price === null || item.price === undefined) {
      return 0;
    }
    if (item.category === 'Stay') {
      const r = item.rooms || 1;
      const n = item.nights || 1;
      return item.price * r * n;
    }
    if (item.category === 'Food') {
      const p = item.people || 1;
      const m = item.meals || 1;
      return item.price * p * m;
    }
    if (item.category === 'Place' || item.category === 'Attraction') {
      const t = item.tickets || 1;
      return item.price * t;
    }
    if (item.category === 'Transport') {
      const p = item.passengers || 1;
      const legs = item.legs || 1;
      return item.price * p * legs;
    }
    return item.price * (item.quantity || 1);
  };

  // Aggregates
  const { activeItems, excludedItems, estimatedTotal, remainingBudget } = useMemo(() => {
    const active = [];
    const excluded = [];
    let total = 0;

    tripItems.forEach((item) => {
      if (item.isExcluded || item.price === null || item.price === undefined) {
        excluded.push(item);
      } else {
        active.push(item);
        total += calculateItemTotal(item);
      }
    });

    return {
      activeItems: active,
      excludedItems: excluded,
      estimatedTotal: total,
      remainingBudget: (budget || 0) - total
    };
  }, [tripItems, budget]);

  // Trip item actions
  const addToTrip = (item, customProps = {}) => {
    const isAlreadyAdded = tripItems.some((t) => t.sourceId === item.id || t.id === item.id);
    if (isAlreadyAdded) {
      showToast(`"${item.name}" is already in your trip!`);
      return;
    }

    const hasPrice = item.price !== null && item.price !== undefined && item.hasPrice !== false;
    const newItem = {
      id: `trip-${Date.now()}`,
      sourceId: item.id,
      name: item.name,
      sublabel: item.locality || item.type || '(Sample data · UI preview)',
      category: item.type === 'Hotel' || item.type === 'Hostel' || item.type === 'Guesthouse' || item.type === 'PG' ? 'Stay' :
                item.type === 'Restaurant' || item.type === 'Cafe' || item.type === 'Dhaba' ? 'Food' :
                item.faresAndSchedules ? 'Transport' : 'Place',
      price: hasPrice ? item.price : null,
      priceUnit: item.priceUnit || '',
      image: item.image,
      rooms: customProps.rooms || item.defaultUnits || 1,
      nights: customProps.nights || item.defaultNights || 1,
      people: customProps.people || item.defaultPeople || 2,
      meals: customProps.meals || item.defaultMeals || 1,
      tickets: customProps.tickets || item.defaultTickets || 2,
      passengers: customProps.passengers || 2,
      day: customProps.day || 'day1',
      isExcluded: !hasPrice,
      reason: !hasPrice ? (item.warning || 'Price unavailable (excluded from estimate)') : null
    };

    setTripItems((prev) => [...prev, newItem]);
    showToast(`Added "${item.name}" to your trip`);
  };

  const removeFromTrip = (id) => {
    const item = tripItems.find((i) => i.id === id);
    setTripItems((prev) => prev.filter((i) => i.id !== id));
    if (item) {
      showToast(`Removed "${item.name}" from your trip`);
    }
  };

  const updateItem = (id, updates) => {
    setTripItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const clearAllTrip = () => {
    setTripItems([]);
    showToast('Trip items cleared');
  };

  // Provider actions
  const addProviderListing = (listing) => {
    const newEntry = {
      id: `prov-${Date.now()}`,
      name: listing.name,
      category: listing.category,
      status: listing.status || 'Pending review',
      updated: 'Just now',
      image: listing.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=150&q=80',
      reviewFeedback: null,
      ...listing
    };
    setProviderListings((prev) => [newEntry, ...prev]);

    // Also add to admin pending reviews if pending
    if (newEntry.status === 'Pending review') {
      const adminEntry = {
        id: `admin-rev-${Date.now()}`,
        name: listing.name,
        category: listing.category,
        status: 'Pending',
        submittedOn: 'Today',
        address: listing.address || 'Submitted address',
        price: listing.price ? `₹${listing.price} / ${listing.unit || 'night'}` : 'Not provided',
        photosCount: 1,
        image: newEntry.image,
        providerEvidence: 'Uploaded by provider in portal',
        reviewerNote: ''
      };
      setAdminReviews((prev) => [adminEntry, ...prev]);
    }

    showToast(`Service "${listing.name}" submitted successfully!`);
  };

  const updateListingStatus = (id, newStatus) => {
    setProviderListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status: newStatus, updated: 'Just now' } : l))
    );
    showToast(`Listing status updated to ${newStatus}`);
  };

  // Admin actions
  const updateAdminReview = (id, actionStatus, note = '') => {
    setAdminReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: actionStatus, reviewerNote: note } : r))
    );

    // Sync provider listing status
    const target = adminReviews.find((r) => r.id === id);
    if (target) {
      setProviderListings((prev) =>
        prev.map((l) => {
          if (l.name.toLowerCase() === target.name.toLowerCase()) {
            return {
              ...l,
              status: actionStatus === 'Approved' ? 'Approved' : actionStatus === 'Rejected' ? 'Rejected' : 'Pending review',
              reviewFeedback: note || (actionStatus === 'Changes Requested' ? 'Please revise listing details.' : null),
              updated: 'Just now'
            };
          }
          return l;
        })
      );
    }

    showToast(`Review completed: ${actionStatus}`);
  };

  const contextValue = {
    selectedState,
    setSelectedState,
    selectedCity,
    setSelectedCity,
    startingPoint,
    setStartingPoint,
    budget,
    setBudget,
    tripItems,
    activeItems,
    excludedItems,
    estimatedTotal,
    remainingBudget,
    calculateItemTotal,
    addToTrip,
    removeFromTrip,
    updateItem,
    clearAllTrip,
    providerListings,
    addProviderListing,
    updateListingStatus,
    adminReviews,
    updateAdminReview,
    activeModal,
    setActiveModal,
    toastMessage,
    showToast
  };

  return (
    <TripContext.Provider value={contextValue}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
}
