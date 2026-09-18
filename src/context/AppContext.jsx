import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { DESTINATIONS, STAYS_DATA, FOOD_DATA, PLACES_DATA, NEARBY_TRIPS_DATA, INITIAL_PROVIDER_LISTINGS } from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Navigation & User Roles
  const getInitialPage = () => {
    if (typeof window === 'undefined') return 'home';
    const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
    if (!path) return 'home';
    if (path.includes('admin')) return 'admin';
    if (path.includes('trip')) return 'trip';
    if (path.includes('stays')) return 'stays';
    if (path.includes('food')) return 'food';
    if (path.includes('places')) return 'places';
    if (path.includes('nearby')) return 'nearby';
    if (path.includes('dashboard') || path.includes('provider/services/new')) {
      return path.includes('new') ? 'add-service' : 'dashboard';
    }
    if (path.includes('provider')) return 'dashboard';
    if (path.includes('add-service')) return 'add-service';
    if (path.includes('help')) return 'help';
    if (path.includes('destination')) return 'destination';
    return 'home';
  };

  const [activePage, _setActivePage] = useState(getInitialPage);
  const [pageHistory, setPageHistory] = useState(['home']);

  const setActivePage = (newPage) => {
    _setActivePage((current) => {
      if (current !== newPage) {
        setPageHistory((prev) => [...prev, current]);
      }
      return newPage;
    });
  };

  const goBack = () => {
    if (['stays', 'food', 'places', 'nearby'].includes(activePage)) {
      _setActivePage('destination');
      return;
    }
    if (activePage === 'destination') {
      _setActivePage('home');
      return;
    }
    if (activePage === 'add-service') {
      _setActivePage('dashboard');
      return;
    }
    if (activePage === 'dashboard' || activePage === 'admin') {
      _setActivePage('home');
      return;
    }
    setPageHistory((prev) => {
      if (prev.length === 0) {
        _setActivePage('home');
        return [];
      }
      const previousPage = prev[prev.length - 1];
      _setActivePage(previousPage);
      return prev.slice(0, -1);
    });
  };

  const [userRole, setUserRole] = useState(() => {
    return window.location.pathname.includes('admin') ? 'admin' : 
           window.location.pathname.includes('provider') ? 'provider' : 'traveller';
  }); // 'traveller' | 'provider' | 'admin'
  const currentProviderId = 'prov-user-1';
  const currentUserId = (userRole === 'provider' || activePage === 'dashboard' || activePage === 'add-service') 
    ? currentProviderId 
    : userRole === 'admin' ? 'admin-user' : 'user-traveller-1';

  // Automatically sync userRole when navigating to provider or admin pages
  useEffect(() => {
    if (activePage === 'dashboard' || activePage === 'add-service') {
      if (userRole !== 'provider') setUserRole('provider');
    } else if (activePage === 'admin') {
      if (userRole !== 'admin') setUserRole('admin');
    }
  }, [activePage]);

  // Sync URL with activePage
  useEffect(() => {
    const pageToPath = {
      home: '/',
      destination: '/destinations/bhopal',
      stays: '/stays',
      food: '/food',
      places: '/places',
      nearby: '/nearby',
      trip: '/trip',
      dashboard: '/provider',
      'add-service': '/provider/services/new',
      help: '/help',
      admin: '/admin'
    };
    const targetPath = pageToPath[activePage] || '/';
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
  }, [activePage]);

  useEffect(() => {
    const onPop = () => {
      setActivePage(getInitialPage());
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Selected Destination (Default: Bhopal, MP)
  const [selectedCityId, setSelectedCityId] = useState('bhopal');

  const selectedDestination = useMemo(() => {
    return DESTINATIONS.find(d => d.id === selectedCityId) || DESTINATIONS[0];
  }, [selectedCityId]);

  // Global search
  const [searchQuery, setSearchQuery] = useState('');

  // Starting Point & Distance Engine (Section 26 & Pages 14-16)
  const [startingPoint, setStartingPoint] = useState({
    type: 'centre', // 'centre' | 'manual' | 'location' | 'none'
    label: 'Bhopal City Centre',
    name: 'Bhopal City Centre',
    lat: 23.2599,
    lng: 77.4126,
    status: 'active', // 'active' | 'denied' | 'unavailable' | 'none'
    statusMessage: null
  });

  // Calculate distance from starting point to any target coordinates
  const calculateDistance = (targetLat, targetLng, overrideRoadDistance = null) => {
    if (!startingPoint || startingPoint.status !== 'active' || !startingPoint.lat || !targetLat) {
      return {
        rawKm: 999999,
        label: 'Distance unavailable',
        distanceText: 'Distance unavailable',
        formattedLabel: 'Distance unavailable',
        basis: 'Distance unavailable',
        isStraightLine: false,
        durationMinutes: null,
        isAvailable: false
      };
    }

    // Haversine formula for straight-line distance
    const R = 6371; // Earth radius in km
    const dLat = (targetLat - startingPoint.lat) * (Math.PI / 180);
    const dLon = (targetLng - startingPoint.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(startingPoint.lat * (Math.PI / 180)) *
      Math.cos(targetLat * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const straightLine = R * c;

    // Use road distance if available, otherwise straight-line estimate fallback
    let distanceValue = overrideRoadDistance !== null ? overrideRoadDistance : straightLine * 1.25; // 1.25 empirical road factor
    const isRoad = overrideRoadDistance !== null;

    // Formatting rules: metres below 1 km, kilometres from 1 km onward rounded to 1 decimal place
    let distanceText = '';
    if (distanceValue < 1.0) {
      const metres = Math.round(distanceValue * 1000);
      distanceText = `${metres} m away`;
    } else {
      distanceText = `${distanceValue.toFixed(1)} km away`;
    }

    const basisLabel = isRoad ? 'Road distance' : 'Straight-line estimate';
    const durationMinutes = Math.max(5, Math.round(distanceValue * 2.8)); // approx driving time in Indian city traffic

    return {
      rawKm: distanceValue,
      label: distanceText,
      distanceText,
      formattedLabel: `${distanceText} · ${basisLabel}`,
      basis: basisLabel,
      isStraightLine: !isRoad,
      durationMinutes,
      isAvailable: true
    };
  };

  // Set Starting Point Actions
  const setStartingPointCentre = () => {
    setStartingPoint({
      type: 'centre',
      label: `${selectedDestination.name} City Centre`,
      name: `${selectedDestination.name} City Centre`,
      lat: selectedDestination.lat,
      lng: selectedDestination.lng,
      status: 'active',
      statusMessage: null
    });
  };

  const setStartingPointManual = (label, lat, lng) => {
    const ptName = label || 'Custom Starting Point';
    setStartingPoint({
      type: 'manual',
      label: ptName,
      name: ptName,
      lat: lat || selectedDestination.lat,
      lng: lng || selectedDestination.lng,
      status: 'active',
      statusMessage: null
    });
  };

  const setStartingPointLocation = () => {
    if (!navigator.geolocation) {
      setStartingPoint({
        type: 'location',
        label: 'Device Location',
        name: 'Device Location',
        lat: null,
        lng: null,
        status: 'unavailable',
        statusMessage: 'We could not determine your location. Try again or enter a starting point manually.'
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // Rule: Using device location must never silently change the selected destination!
        setStartingPoint({
          type: 'location',
          label: 'Current Location (GPS)',
          name: 'Current Location (GPS)',
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          status: 'active',
          statusMessage: null
        });
      },
      (err) => {
        // Location permission denied rule
        setStartingPoint({
          type: 'location',
          label: 'Location Access Denied',
          name: 'Location Access Denied',
          lat: null,
          lng: null,
          status: 'denied',
          statusMessage: 'Location access was not granted. You can enter a starting point manually or continue without distance information.'
        });
      }
    );
  };

  const clearStartingPoint = () => {
    setStartingPoint({
      type: 'none',
      label: 'No starting point selected',
      name: 'No starting point selected',
      lat: null,
      lng: null,
      status: 'none',
      statusMessage: 'Choose a starting point to see distances.'
    });
  };

  // Trip Items State - with Day Number & Cost Calculation Attributes (Default for 1 person)
  const [tripItems, setTripItems] = useState([
    {
      id: 'trip-stay-1',
      sourceId: 'stay-1',
      title: 'Hotel Lake View Ashok',
      category: 'Stays',
      itemType: 'hotel',
      unitPricePaise: 250000,
      price: 2500,
      priceUnit: 'per room/night',
      rooms: 1,
      nights: 1,
      quantity: 1,
      dayNumber: 1,
      isVehicleRate: false,
      isUnknownPrice: false,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80',
      location: 'Near Upper Lake',
      sublabel: 'Deluxe Room • 1 Night'
    },
    {
      id: 'trip-food-1',
      sourceId: 'food-1',
      title: 'Manohar Dairy & Restaurant',
      category: 'Food',
      itemType: 'food',
      unitPricePaise: 20000,
      price: 200,
      priceUnit: 'per person/meal',
      people: 1,
      meals: 1,
      quantity: 1,
      dayNumber: 1,
      isVehicleRate: false,
      isUnknownPrice: false,
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80',
      location: 'MP Nagar',
      sublabel: '1 Person • 1 Meal'
    },
    {
      id: 'trip-place-1',
      sourceId: 'place-3',
      title: 'Van Vihar National Park',
      category: 'Attractions',
      itemType: 'attraction',
      unitPricePaise: 5000,
      price: 50,
      priceUnit: 'per entry ticket',
      ticketQuantity: 1,
      quantity: 1,
      dayNumber: 2,
      isVehicleRate: false,
      isUnknownPrice: false,
      image: 'https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=400&q=80',
      location: 'Lake View Road',
      sublabel: '1 Entry Ticket'
    },
    {
      id: 'trip-trans-1',
      sourceId: 'nearby-1-bus',
      title: 'Sanchi Intercity Express Bus',
      category: 'Transport',
      itemType: 'public_transport',
      unitPricePaise: 6500,
      price: 65,
      priceUnit: 'per passenger / leg',
      passengers: 1,
      legs: 1,
      quantity: 1,
      dayNumber: 2,
      isVehicleRate: false,
      isUnknownPrice: false,
      image: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?auto=format&fit=crop&w=400&q=80',
      location: 'ISBT Bhopal to Sanchi',
      sublabel: '1 Passenger • 1 Leg'
    }
  ]);

  // Trip Days & Person Count (Fixed/default for 1 person)
  const [tripDays, setTripDays] = useState(3);
  const [personCount, setPersonCount] = useState(1);

  // Trip Meta
  const [tripMeta, setTripMeta] = useState({
    destination: 'Bhopal, Madhya Pradesh',
    startDate: '2026-10-12',
    endDate: '2026-10-14',
    travellers: 1,
    days: 3,
    budget: 6000,
    budgetPaise: 600000,
    isReviewed: false
  });

  const setTripBudget = (newBudget) => {
    const val = Number(newBudget) || 0;
    setTripMeta(prev => ({
      ...prev,
      budget: val,
      budgetPaise: val * 100
    }));
  };

  // Budget warning dismiss state
  const [isBudgetWarningDismissed, setIsBudgetWarningDismissed] = useState(false);

  // Favourites & Comparison
  const [savedFavourites, setSavedFavourites] = useState(['stay-1', 'food-1']);
  const [compareListings, setCompareListings] = useState([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const toggleFavourite = (id) => {
    setSavedFavourites(prev => {
      const exists = prev.includes(id);
      const updated = exists ? prev.filter(item => item !== id) : [...prev, id];
      showToast(exists ? 'Removed from saved favourites' : 'Saved to favourites ❤️');
      return updated;
    });
  };

  const addToCompare = (listing) => {
    if (compareListings.some(l => l.id === listing.id)) {
      setCompareListings(prev => prev.filter(l => l.id !== listing.id));
      showToast(`Removed "${listing.name}" from comparison`);
      return;
    }
    if (compareListings.length >= 3) {
      showToast('You can compare up to 3 listings at a time.');
      return;
    }
    setCompareListings(prev => [...prev, listing]);
    showToast(`Added "${listing.name}" to compare list`);
  };

  const removeFromCompare = (id) => {
    setCompareListings(prev => prev.filter(l => l.id !== id));
  };

  // Provider Scoping & Admin Listings State
  const [providerListings, setProviderListings] = useState(INITIAL_PROVIDER_LISTINGS);

  // User Reports & Feedback System
  const [userReports, setUserReports] = useState([
    {
      id: 'rep-1',
      listingId: 'stay-1',
      listingName: 'Hotel Lake View Ashok',
      category: 'Stays',
      issueType: 'Incorrect Price',
      comments: 'Standard room rack rate is currently ₹2,800 on direct portal.',
      reporterEmail: 'traveller@traar.in',
      submittedAt: '18 Sep 2026, 02:45 PM',
      status: 'Pending'
    },
    {
      id: 'rep-2',
      listingId: 'nearby-1-bus',
      listingName: 'Sanchi Intercity Express Bus',
      category: 'Nearby Trips',
      issueType: 'Outdated Timings',
      comments: 'Morning 6:00 AM bus departure shifted to 06:15 AM from platform 3.',
      reporterEmail: 'local.rider@gmail.com',
      submittedAt: '17 Sep 2026, 11:20 AM',
      status: 'Reviewed'
    }
  ]);

  const submitUserReport = (reportData) => {
    const newReport = {
      id: `rep-${Date.now()}`,
      listingId: reportData.listingId || reportModalItem?.id || 'gen-1',
      listingName: reportData.listingName || reportModalItem?.name || 'Listing',
      category: reportData.category || reportModalItem?.type || 'Listing',
      issueType: reportData.issueType || 'Incorrect Information',
      comments: reportData.comments || reportData.explanation || '',
      reporterEmail: reportData.email || 'user@traar.in',
      submittedAt: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      status: 'Pending'
    };
    setUserReports(prev => [newReport, ...prev]);
    showToast('Feedback submitted to administration. Thank you!');
  };

  const updateReportStatus = (reportId, newStatus) => {
    setUserReports(prev => prev.map(r => r.id === reportId ? { ...r, status: newStatus } : r));
    showToast(`Report marked as ${newStatus}`);
  };

  // Modals & UI states
  const [viewDetailsItem, setViewDetailsItem] = useState(null);
  const [wayToItem, setWayToItem] = useState(null);
  const [reportModalItem, setReportModalItem] = useState(null);
  const [isTripDrawerOpen, setIsTripDrawerOpen] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showPipelineModal, setShowPipelineModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Cost calculation rules (Section 16)
  const budgetCalculations = useMemo(() => {
    let staysTotalPaise = 0;
    let foodTotalPaise = 0;
    let placesTotalPaise = 0;
    let transportTotalPaise = 0;
    let excludedItemsCount = 0;

    tripItems.forEach(item => {
      // If unknown price, mark as excluded (never treat as zero)
      if (item.isUnknownPrice || item.price === null || item.price === undefined) {
        excludedItemsCount++;
        return;
      }

      const unitPaise = item.unitPricePaise || ((Number(item.price) || 0) * 100);
      let linePaise = 0;

      const cat = (item.category || '').toLowerCase();
      const travellers = Number(tripMeta.travellers) || 1;
      const qty = item.quantity || 1;

      if (cat.includes('stay') || cat.includes('hotel') || cat.includes('hostel')) {
        // Hotel: Nightly room price × rooms × nights/qty
        const rooms = item.rooms || 1;
        linePaise = unitPaise * rooms * qty;
        staysTotalPaise += linePaise;
      } else if (cat.includes('food') || cat.includes('restaurant') || cat.includes('dhaba')) {
        // Food: Cost per person per meal × travellers count × selected meals/qty
        linePaise = unitPaise * travellers * qty;
        foodTotalPaise += linePaise;
      } else if (cat.includes('attraction') || cat.includes('place') || cat.includes('sight')) {
        // Attraction: Ticket price × travellers count × quantity
        linePaise = unitPaise * travellers * qty;
        placesTotalPaise += linePaise;
      } else if (cat.includes('transport') || cat.includes('travel') || cat.includes('bus') || cat.includes('train') || cat.includes('nearby') || item.mode || item.isVehicleRate) {
        if (item.isVehicleRate) {
          // Rule: Taxi / Quoted vehicle fare - Flat vehicle fare (does NOT multiply by passenger count)
          linePaise = unitPaise * qty;
        } else {
          // Public transport: Fare per passenger per leg × travellers count × legs/qty
          linePaise = unitPaise * travellers * qty;
        }
        transportTotalPaise += linePaise;
      } else {
        linePaise = unitPaise * qty;
        placesTotalPaise += linePaise;
      }
    });

    const grandTotalPaise = staysTotalPaise + foodTotalPaise + placesTotalPaise + transportTotalPaise;
    const grandTotal = Math.round(grandTotalPaise / 100);
    const userBudget = Number(tripMeta.budget) || 0;
    const difference = userBudget - grandTotal;
    const isOverBudget = grandTotal > userBudget;

    return {
      staysTotal: Math.round(staysTotalPaise / 100),
      foodTotal: Math.round(foodTotalPaise / 100),
      placesTotal: Math.round(placesTotalPaise / 100),
      transportTotal: Math.round(transportTotalPaise / 100),
      grandTotal,
      grandTotalPaise,
      totalRupees: grandTotal,
      userBudget,
      difference,
      isOverBudget,
      excludedItemsCount
    };
  }, [tripItems, tripMeta.budget, tripMeta.travellers]);

  // Trip item operations
  const addToTrip = (item, categoryName, options = {}) => {
    const effectiveCategory = categoryName || item.category || 'Other';
    const effectiveOptions = typeof categoryName === 'object' ? categoryName : options;
    const isVehicle = item.isVehicleRate !== undefined 
      ? item.isVehicleRate 
      : (effectiveOptions.isVehicle || (item.fareUnit && item.fareUnit.includes('vehicle')) || false);
    const isUnknown = item.isUnknownPrice !== undefined 
      ? item.isUnknownPrice 
      : (item.price === null || item.price === undefined);
    const sourceId = item.sourceId || item.id;

    const existingIndex = tripItems.findIndex(i => 
      i.sourceId === sourceId || i.id === sourceId || (item.id && (i.sourceId === item.id || i.id === item.id))
    );

    if (existingIndex > -1) {
      setTripItems(prev => prev.map((it, idx) =>
        idx === existingIndex ? { ...it, quantity: (it.quantity || 1) + 1 } : it
      ));
      showToast(`Updated quantity for "${item.title || item.name}" in My Trip`);
    } else {
      // Always initialize new trip items for 1 person with quantity 1
      const newItem = {
        id: item.id || `trip-${Date.now()}`,
        sourceId: sourceId || item.id,
        title: item.title || item.name,
        name: item.name || item.title,
        category: effectiveCategory,
        itemType: effectiveCategory.toLowerCase(),
        unitPricePaise: isUnknown ? null : (item.pricePaise || (Number(item.price !== undefined ? item.price : (item.avgCost || item.entryPrice || 0)) * 100)),
        price: isUnknown ? null : (item.price !== undefined ? item.price : (item.avgCost || item.entryPrice || 0)),
        priceUnit: item.priceUnit || item.fareUnit || 'per unit',
        quantity: 1,
        rooms: 1,
        nights: 1,
        people: 1,
        meals: 1,
        ticketQuantity: 1,
        passengers: 1,
        legs: 1,
        dayNumber: item.day || item.dayNumber || effectiveOptions.dayNumber || 1,
        isVehicleRate: isVehicle,
        isUnknownPrice: isUnknown,
        image: item.image,
        location: item.location || (item.distanceKm ? `${item.distanceKm} km from center` : selectedDestination.name),
        sublabel: item.sublabel || item.tagline || item.type || item.cuisine || 'Verified Item'
      };
      setTripItems(prev => [...prev, newItem]);
      showToast(`Added "${item.title || item.name}" to your Trip (1 person)!`);
    }
  };

  const removeFromTrip = (id) => {
    setTripItems(prev => prev.filter(item => item.id !== id && item.sourceId !== id));
    showToast('Item removed from trip planner');
  };

  const updateItemQuantity = (id, newQty) => {
    if (newQty <= 0) {
      removeFromTrip(id);
      return;
    }
    setTripItems(prev => prev.map(item => item.id === id ? { ...item, quantity: newQty } : item));
  };

  const updateItemDay = (id, dayNum) => {
    setTripItems(prev => prev.map(item => item.id === id ? { ...item, dayNumber: dayNum } : item));
  };

  const duplicateTrip = () => {
    showToast('Itinerary duplicated as "My Trip (Copy)"');
  };

  // Provider operations (Section 17: Providers manage their registered listings)
  const addProviderListing = (newListing) => {
    const assignedProviderId = newListing.providerId || currentProviderId || 'prov-user-1';
    const listingWithMeta = {
      ...newListing,
      id: newListing.id || `prov-${Date.now()}`,
      providerId: assignedProviderId,
      status: newListing.status || 'Pending Review',
      reviewFeedback: newListing.reviewFeedback || 'Submitted and queued for administrative verification.',
      lastUpdated: 'Just now',
      image: newListing.image || (newListing.images && newListing.images[0]) || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80'
    };
    setUserRole('provider');
    setProviderListings(prev => [listingWithMeta, ...prev]);
    showToast(`Service "${newListing.name}" registered and submitted for review!`);
  };

  const deleteProviderListing = (id) => {
    setProviderListings(prev => prev.filter(l => l.id !== id));
    showToast('Listing withdrawn successfully');
  };

  // Administrator Moderation
  const adminApproveListing = (id, comments) => {
    setProviderListings(prev => prev.map(l =>
      l.id === id ? { ...l, status: 'Approved', reviewFeedback: comments || 'Verified by Administrator.' } : l
    ));
    showToast('Listing marked as Approved and published to directory');
  };

  const adminRejectListing = (id, feedback) => {
    setProviderListings(prev => prev.map(l =>
      l.id === id ? { ...l, status: 'Rejected', reviewFeedback: feedback || 'Documentation does not meet verification requirements.' } : l
    ));
    showToast('Listing marked as Rejected');
  };

  // Mapped approved provider listings to appear seamlessly in public directories
  const approvedProviderStays = useMemo(() => {
    return providerListings
      .filter(l => l.status === 'Approved' && (l.category === 'Stays' || l.category === 'Stay'))
      .map(l => ({
        id: l.id,
        cityId: l.cityId || 'bhopal',
        name: l.name,
        type: l.type || 'Hotel',
        price: Number(l.price) || 2000,
        pricePaise: (Number(l.price) || 2000) * 100,
        priceUnit: l.priceUnit || 'per room/night',
        location: l.location || l.neighbourhood || 'Bhopal',
        rating: l.rating || 4.8,
        reviewsCount: l.reviewsCount || 1,
        lat: Number(l.lat) || 23.2599,
        lng: Number(l.lng) || 77.4126,
        image: l.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80',
        images: l.images && l.images.length > 0 ? l.images : [l.image],
        gallery: l.images && l.images.length > 0 ? l.images : [l.image],
        description: l.description || 'Verified accommodation registered on TRAAR.',
        amenities: l.amenities || ['Verified Listing', 'Wi-Fi'],
        contact: l.contact,
        email: l.email,
        address: l.address,
        isProviderListing: true,
        status: 'Approved'
      }));
  }, [providerListings]);

  const approvedProviderFood = useMemo(() => {
    return providerListings
      .filter(l => l.status === 'Approved' && (l.category === 'Food' || l.category === 'Dining'))
      .map(l => ({
        id: l.id,
        cityId: l.cityId || 'bhopal',
        name: l.name,
        cuisine: l.cuisine || 'Authentic & Multi-Cuisine',
        type: l.type || 'Restaurant',
        avgCost: Number(l.price) || 350,
        price: Number(l.price) || 350,
        location: l.location || l.neighbourhood || 'Bhopal',
        rating: l.rating || 4.7,
        reviewsCount: l.reviewsCount || 1,
        lat: Number(l.lat) || 23.2599,
        lng: Number(l.lng) || 77.4126,
        image: l.image || 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=400&q=80',
        images: l.images && l.images.length > 0 ? l.images : [l.image],
        gallery: l.images && l.images.length > 0 ? l.images : [l.image],
        description: l.description || 'Verified dining establishment registered on TRAAR.',
        isVeg: l.isVeg ?? true,
        contact: l.contact,
        email: l.email,
        address: l.address,
        isProviderListing: true,
        status: 'Approved'
      }));
  }, [providerListings]);

  const approvedProviderPlaces = useMemo(() => {
    return providerListings
      .filter(l => l.status === 'Approved' && (l.category === 'Places' || l.category === 'Attraction'))
      .map(l => ({
        id: l.id,
        cityId: l.cityId || 'bhopal',
        name: l.name,
        category: l.type || 'Historical & Heritage',
        location: l.location || l.neighbourhood || 'Bhopal',
        entryFee: Number(l.price) || 0,
        rating: l.rating || 4.8,
        reviewsCount: l.reviewsCount || 1,
        lat: Number(l.lat) || 23.2599,
        lng: Number(l.lng) || 77.4126,
        image: l.image,
        images: l.images && l.images.length > 0 ? l.images : [l.image],
        gallery: l.images && l.images.length > 0 ? l.images : [l.image],
        description: l.description,
        highlights: l.amenities || ['Verified Sight'],
        isProviderListing: true,
        status: 'Approved'
      }));
  }, [providerListings]);

  const approvedProviderNearby = useMemo(() => {
    return providerListings
      .filter(l => l.status === 'Approved' && (l.category === 'Nearby Trips' || l.category === 'Transport'))
      .map(l => ({
        id: l.id,
        cityId: l.cityId || 'bhopal',
        name: l.name,
        destination: l.location || 'Excursion',
        distanceKm: l.distanceKm || 45,
        tagline: l.description || 'Verified excursion & transport route',
        description: l.description,
        image: l.image,
        images: l.images && l.images.length > 0 ? l.images : [l.image],
        gallery: l.images && l.images.length > 0 ? l.images : [l.image],
        transportOptions: {
          bus: { fare: Number(l.price) || 120, operator: 'Verified Operator', departurePoint: 'Main Depot', boardingPoint: 'ISBT', arrivalPoint: l.location, travelTime: '1 hr 15 mins' },
          car: { fare: (Number(l.price) || 120) * 8, operator: 'Verified Fleet', vehicle: 'Sedan / SUV', boardingPoint: 'Doorstep', arrivalPoint: l.location, travelTime: '55 mins' }
        },
        isProviderListing: true,
        status: 'Approved'
      }));
  }, [providerListings]);

  const changeUserRole = (newRole) => {
    setUserRole(newRole);
    if (newRole === 'admin') {
      setActivePage('admin');
    } else if (newRole === 'provider') {
      setActivePage('dashboard');
    } else if (newRole === 'traveller') {
      if (activePage === 'admin' || activePage === 'dashboard' || activePage === 'add-service') {
        setActivePage('home');
      }
    }
  };

  const clearTrip = () => {
    setTripItems([]);
    showToast('Trip planner itinerary cleared');
  };

  // Check schedule validity
  const scheduleWarnings = useMemo(() => {
    return [];
  }, [tripItems]);

  const isItemInTrip = (id) => {
    if (!id) return false;
    return tripItems.some(item => item.id === id || item.sourceId === id);
  };

  const toggleTripItem = (item, categoryName, options = {}) => {
    const id = item.sourceId || item.id;
    if (isItemInTrip(id)) {
      removeFromTrip(id);
    } else {
      addToTrip(item, categoryName, options);
    }
  };

  return (
    <AppContext.Provider
      value={{
        activePage, setActivePage, goBack, pageHistory,
        userRole, setUserRole, changeUserRole, currentUserId, currentProviderId,
        selectedCityId, setSelectedCityId, selectedDestination,
        searchQuery, setSearchQuery,
        startingPoint, setStartingPointCentre, setStartingPointManual, setStartingPointLocation, clearStartingPoint,
        calculateDistance,
        tripItems, addToTrip, removeFromTrip, updateItemQuantity, updateItemDay, duplicateTrip, clearTrip,
        isItemInTrip, toggleTripItem,
        tripDays, setTripDays,
        personCount, setPersonCount, travellerCount: personCount,
        tripMeta, setTripMeta, setTripBudget,
        budgetCalculations,
        isBudgetWarningDismissed, setIsBudgetWarningDismissed,
        savedFavourites, toggleFavourite,
        compareListings, addToCompare, removeFromCompare, isCompareModalOpen, setIsCompareModalOpen,
        providerListings, addProviderListing, deleteProviderListing,
        approvedProviderStays, approvedProviderFood, approvedProviderPlaces, approvedProviderNearby,
        adminApproveListing, adminRejectListing,
        userReports, submitUserReport, updateReportStatus,
        scheduleWarnings,
        viewDetailsItem, setViewDetailsItem,
        wayToItem, setWayToItem,
        reportModalItem, setReportModalItem,
        isTripDrawerOpen, setIsTripDrawerOpen,
        showExportModal, setShowExportModal,
        showSupportModal, setShowSupportModal,
        isMobileSidebarOpen, setIsMobileSidebarOpen,
        toastMessage, showToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);