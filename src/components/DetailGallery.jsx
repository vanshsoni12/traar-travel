import React from 'react';

export default function DetailGallery({ images = [], alt = 'Gallery image' }) {
  const fallback = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80';
  const imgList = images.length > 0 ? images : [fallback];

  const mainImage = imgList[0] || fallback;
  const secondImage = imgList[1] || imgList[0] || fallback;
  const thirdImage = imgList[2] || imgList[0] || fallback;

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-[280px] sm:h-[340px] md:h-[380px] rounded-md overflow-hidden">
        {/* Large main photo on the left */}
        <div className="md:col-span-2 h-full bg-gray-100 overflow-hidden relative">
          <img
            src={mainImage}
            alt={`${alt} main view`}
            className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-300"
            onError={(e) => { e.target.src = fallback; }}
          />
        </div>

        {/* Two smaller photos on the right */}
        <div className="hidden md:grid grid-rows-2 gap-3 h-full">
          <div className="bg-gray-100 overflow-hidden relative rounded-r">
            <img
              src={secondImage}
              alt={`${alt} view 2`}
              className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-300"
              onError={(e) => { e.target.src = fallback; }}
            />
          </div>
          <div className="bg-gray-100 overflow-hidden relative rounded-r">
            <img
              src={thirdImage}
              alt={`${alt} view 3`}
              className="w-full h-full object-cover hover:scale-[1.01] transition-transform duration-300"
              onError={(e) => { e.target.src = fallback; }}
            />
          </div>
        </div>
      </div>
      <span className="text-[11px] text-gray-400 block mt-1.5">
        Sample data · UI preview
      </span>
    </div>
  );
}
