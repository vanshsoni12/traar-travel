import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function CategoryCard({
  title,
  description,
  to,
  exploreText,
  icon: Icon,
  accentBg = 'bg-emerald-50',
  accentColor = 'text-[#176B4A]',
  accentBorder = 'border-emerald-100'
}) {
  return (
    <Link
      to={to}
      className="bg-white border border-gray-200 hover:border-[#176B4A] rounded-md p-4 transition-all group shadow-sm flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start gap-3 mb-2">
          {Icon && (
            <div className={`w-8 h-8 rounded ${accentBg} ${accentColor} flex items-center justify-center shrink-0 border ${accentBorder}`}>
              <Icon className="w-4 h-4" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-[#176B4A] flex items-center justify-between">
              <span>{title}</span>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#176B4A] transition-transform group-hover:translate-x-0.5" />
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {description}
            </p>
          </div>
        </div>
      </div>
      <span className="text-xs font-medium text-[#176B4A] mt-3 inline-flex items-center gap-1">
        {exploreText || `→ Explore ${title.toLowerCase()}`}
      </span>
    </Link>
  );
}
