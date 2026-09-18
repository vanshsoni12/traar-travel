import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Upload, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  DollarSign, 
  Navigation,
  ArrowLeft,
  Image as ImageIcon,
  FileText,
  Trash2,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AddServicePage() {
  const { 
    addProviderListing, 
    setActivePage, 
    goBack,
    selectedCityId,
    currentProviderId,
    showToast 
  } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Stays',
    cityId: selectedCityId || 'bhopal',
    neighbourhood: '',
    lat: '',
    lng: '',
    address: '',
    contact: '',
    email: '',
    price: '',
    priceUnit: 'per room/night',
    timings: 'Check-in 12:00 PM / Check-out 11:00 AM',
    amenities: '',
    description: '',
    sourceLicense: 'Provider Direct Registration',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    verificationProofDoc: 'MSME / Udyam / Municipal Trade Certificate'
  });

  const [uploadedImages, setUploadedImages] = useState([
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80'
  ]);
  const [coverIndex, setCoverIndex] = useState(0);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [docFileName, setDocFileName] = useState('Govt_Trade_Certificate.pdf');
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
          setUploadedImages(prev => [...prev, reader.result]);
          showToast(`Uploaded ${file.name}`);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocFileName(file.name);
      showToast(`Attached document: ${file.name}`);
    }
  };

  const handleAddImageUrl = (e) => {
    e.preventDefault();
    if (!newImageUrl.trim()) return;
    setUploadedImages(prev => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
    showToast('Image added to gallery');
  };

  const handleRemoveImage = (indexToRemove) => {
    if (uploadedImages.length <= 1) {
      showToast('At least one image is required.');
      return;
    }
    setUploadedImages(prev => prev.filter((_, i) => i !== indexToRemove));
    if (coverIndex === indexToRemove) {
      setCoverIndex(0);
    } else if (coverIndex > indexToRemove) {
      setCoverIndex(coverIndex - 1);
    }
  };

  const handleFillSample = () => {
    setFormData({
      name: 'Bhopal Heritage Lake Resort & Suites',
      category: 'Stays',
      cityId: 'bhopal',
      neighbourhood: 'Shamla Hills, Bhopal',
      lat: '23.2384',
      lng: '77.3826',
      address: 'Near Lake View Club, Shamla Hills, Bhopal, MP 462013',
      contact: '+91 755 244 8899',
      email: 'reservations@bhopalheritage.in',
      price: '2800',
      priceUnit: 'per room/night',
      timings: 'Check-in 12:00 PM / Check-out 11:00 AM',
      amenities: 'Lake View Balcony, High-Speed Wi-Fi, Breakfast Included, Free Parking, Air Conditioning',
      description: 'Boutique lakeside heritage resort offering panoramic views of the Upper Lake, royal architecture, authentic Malwi cuisine, and eco-friendly hospitality.',
      sourceLicense: 'MP Tourism Hospitality Board Reg. #BPL-2026-881',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      verificationProofDoc: 'Govt_Hospitality_Trade_License_2026.pdf'
    });
    setErrors({});
    showToast('Filled sample provider listing for Bhopal Heritage Lake Resort!');
  };

  const validateCoordinates = () => {
    const errs = {};

    if (!formData.name.trim()) {
      errs.name = 'Service name is required.';
    }

    if (formData.lat && isNaN(Number(formData.lat))) {
      errs.lat = 'Latitude must be a valid number.';
    }

    if (formData.lng && isNaN(Number(formData.lng))) {
      errs.lng = 'Longitude must be a valid number.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleUseCurrentCoordinates = () => {
    if (formData.cityId === 'jaipur') {
      handleChange('lat', '26.9124');
      handleChange('lng', '75.7873');
      showToast('Populated Jaipur coordinates (26.9124, 75.7873)');
    } else {
      handleChange('lat', '23.2599');
      handleChange('lng', '77.4126');
      showToast('Populated Bhopal coordinates (23.2599, 77.4126)');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateCoordinates()) {
      showToast('Please enter a valid service name before submitting.');
      return;
    }

    const priceNum = formData.price ? Number(formData.price) : 1500;
    const pricePaise = priceNum * 100;
    const coverImage = uploadedImages[coverIndex] || uploadedImages[0] || formData.image;
    const effectiveNeighbourhood = formData.neighbourhood.trim() || (formData.cityId === 'jaipur' ? 'Pink City, Jaipur' : 'MP Nagar, Bhopal');
    const defaultLat = formData.cityId === 'jaipur' ? 26.9124 : 23.2599;
    const defaultLng = formData.cityId === 'jaipur' ? 75.7873 : 77.4126;

    const newListing = {
      id: `prov-${Date.now()}`,
      providerId: currentProviderId || 'prov-user-1',
      name: formData.name.trim(),
      category: formData.category,
      cityId: formData.cityId,
      neighbourhood: effectiveNeighbourhood,
      location: `${effectiveNeighbourhood}, ${formData.cityId === 'jaipur' ? 'Jaipur' : 'Bhopal'}`,
      address: formData.address.trim() || effectiveNeighbourhood,
      lat: formData.lat ? Number(formData.lat) : defaultLat,
      lng: formData.lng ? Number(formData.lng) : defaultLng,
      contact: formData.contact || '+91 98000 00000',
      email: formData.email || 'provider@traar.in',
      price: priceNum,
      pricePaise: pricePaise,
      priceUnit: formData.priceUnit,
      timings: formData.timings,
      description: formData.description || 'Verified local establishment registered on TRAAR.',
      amenities: formData.amenities ? formData.amenities.split(',').map(s => s.trim()) : ['Verified Listing', 'Local Support'],
      sourceLicense: formData.sourceLicense,
      image: coverImage,
      images: uploadedImages,
      verificationProofDoc: docFileName,
      status: 'Pending Review',
      reviewFeedback: 'Submitted and queued for administrative verification.',
      lastUpdated: 'Just now'
    };

    addProviderListing(newListing);
    setActivePage('dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goBack}
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Register New Tourism Service
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Provider Verification Onboarding Desk
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleFillSample}
            className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            title="Auto-fill with verified sample resort details"
          >
            ✨ Fill Sample Data
          </button>
          <span className="hidden sm:inline-block px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl">
            ID: {currentProviderId || 'prov-user-1'}
          </span>
        </div>
      </div>

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        {/* Section 1: Classification */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-teal-800 flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span>1. Service Category & Destination</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => {
                  handleChange('category', e.target.value);
                  if (e.target.value === 'Stays') {
                    handleChange('priceUnit', 'per room/night');
                    handleChange('timings', 'Check-in 12:00 PM / Check-out 11:00 AM');
                  } else if (e.target.value === 'Food') {
                    handleChange('priceUnit', 'per person average');
                    handleChange('timings', '11:00 AM – 11:00 PM');
                  } else if (e.target.value === 'Places') {
                    handleChange('priceUnit', 'per person entry');
                    handleChange('timings', '09:00 AM – 06:00 PM');
                  } else {
                    handleChange('priceUnit', 'per person / one way');
                    handleChange('timings', 'Scheduled departure');
                  }
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
              >
                <option value="Stays">Stays (Hotel, Hostel, PG, Homestay)</option>
                <option value="Food">Food (Restaurant, Cafe, Dhaba)</option>
                <option value="Places">Places to Visit (Attraction, Monument)</option>
                <option value="Nearby Trips">Nearby Trips & Transport (Bus, Taxi)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Destination City *
              </label>
              <input
                type="text"
                list="citySuggestions"
                value={formData.cityId === 'bhopal' ? 'Bhopal (Madhya Pradesh)' : formData.cityId === 'jaipur' ? 'Jaipur (Rajasthan)' : formData.cityId}
                onChange={(e) => {
                  const val = e.target.value.toLowerCase();
                  if (val.includes('jaipur')) handleChange('cityId', 'jaipur');
                  else handleChange('cityId', 'bhopal');
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
              <datalist id="citySuggestions">
                <option value="Bhopal (Madhya Pradesh)" />
                <option value="Jaipur (Rajasthan)" />
                <option value="Indore (Madhya Pradesh)" />
                <option value="Ujjain (Madhya Pradesh)" />
              </datalist>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Service / Business Name *
            </label>
            <input
              type="text"
              list="businessNameSuggestions"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="e.g. Lakeview Heritage Homestay, Royal Bhopal Sweets, etc."
              className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
              }`}
            />
            <datalist id="businessNameSuggestions">
              <option value="Lakeview Grand Residency" />
              <option value="Bhopal Heritage Homestay" />
              <option value="MP Tourism Palace Retreat" />
              <option value="Nawab Dining & Cafe" />
            </datalist>
            {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
          </div>
        </div>

        {/* Section 2: Location */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-teal-800 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span>2. Location & Verified Coordinates</span>
            </h2>
            <button
              type="button"
              onClick={handleUseCurrentCoordinates}
              className="text-xs font-bold text-teal-700 hover:text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 cursor-pointer"
            >
              Use City Centre GPS
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Neighbourhood / Locality *
              </label>
              <input
                type="text"
                list="neighbourhoodSuggestions"
                value={formData.neighbourhood}
                onChange={(e) => handleChange('neighbourhood', e.target.value)}
                placeholder="e.g. Shamla Hills, MP Nagar Zone-I, Arera Colony"
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                  errors.neighbourhood ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                }`}
              />
              <datalist id="neighbourhoodSuggestions">
                <option value="Shamla Hills" />
                <option value="MP Nagar Zone-I" />
                <option value="Arera Colony" />
                <option value="Bhadbhada Road" />
                <option value="VIP Road" />
              </datalist>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Street Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                placeholder="Plot no, Landmark, Road, Pin Code"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Latitude (WGS84 Decimal)
              </label>
              <input
                type="text"
                value={formData.lat}
                onChange={(e) => handleChange('lat', e.target.value)}
                placeholder="e.g. 23.2384"
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                  errors.lat ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Longitude (WGS84 Decimal)
              </label>
              <input
                type="text"
                value={formData.lng}
                onChange={(e) => handleChange('lng', e.target.value)}
                placeholder="e.g. 77.3826"
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                  errors.lng ? 'border-rose-400 bg-rose-50/30' : 'border-slate-200'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Section 3: Tariff & Capacity */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-teal-800 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            <span>3. Tariff & Commercials</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Base Tariff (₹ Integer) *
              </label>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                placeholder="e.g. 1500"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tariff Unit *
              </label>
              <input
                type="text"
                list="unitSuggestions"
                value={formData.priceUnit}
                onChange={(e) => handleChange('priceUnit', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
              <datalist id="unitSuggestions">
                <option value="per room/night" />
                <option value="per person" />
                <option value="per person average" />
                <option value="per person entry" />
                <option value="vehicle rate" />
              </datalist>
            </div>
          </div>
        </div>

        {/* Section 4: Multi-Image Upload & Card Cover Selection (Item 17) */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-teal-800 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            <span>4. Photos, Media & Main Card Cover Image</span>
          </h2>

          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              <label className="px-3.5 py-2 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 hover:bg-teal-100 text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Photos from Device</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Direct URL input */}
            <div className="flex gap-2 mb-3">
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="Or paste an image web URL..."
                className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-600"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-3 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 cursor-pointer"
              >
                Add URL
              </button>
            </div>

            {/* Uploaded Photos Grid with "Set as Main Card Cover" */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              {uploadedImages.map((img, idx) => {
                const isCover = coverIndex === idx;
                return (
                  <div
                    key={idx}
                    className={`relative rounded-xl overflow-hidden border-2 transition-all group ${
                      isCover ? 'border-teal-600 ring-2 ring-teal-500/20 shadow-xs' : 'border-slate-200'
                    }`}
                  >
                    <img src={img} alt="Uploaded" className="w-full h-24 object-cover" />
                    
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-900/70 text-white hover:bg-rose-600 transition-colors cursor-pointer"
                      title="Remove photo"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCoverIndex(idx);
                        showToast(`Image #${idx + 1} set as main cover.`);
                      }}
                      className={`w-full py-1 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                        isCover 
                          ? 'bg-teal-600 text-white' 
                          : 'bg-slate-900/70 hover:bg-slate-900 text-white backdrop-blur-xs'
                      }`}
                    >
                      {isCover ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>Main Cover</span>
                        </>
                      ) : (
                        <span>Set as Cover</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 5: Verification Document Upload */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-teal-800 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            <span>5. Government Trade License & Compliance Document</span>
          </h2>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Registry Document / License Proof
                </span>
                <span className="text-[11px] text-slate-500">
                  Current file: <strong className="text-slate-700">{docFileName}</strong>
                </span>
              </div>

              <label className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 shadow-2xs">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload New PDF/Doc</span>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleDocUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Section 6: Amenities & Description */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description & Highlights
            </label>
            <textarea
              rows="3"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Provide a detailed overview of your property, amenities, dining specialty, or tour package..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Amenities (comma separated)
            </label>
            <input
              type="text"
              value={formData.amenities}
              onChange={(e) => handleChange('amenities', e.target.value)}
              placeholder="e.g. Free Wi-Fi, Air Conditioning, Hot Water, In-house Cafe"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>
        </div>

        {/* Form Submit Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setActivePage('dashboard')}
            className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold rounded-xl cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Submit for Verification</span>
          </button>
        </div>
      </form>
    </div>
  );
}
