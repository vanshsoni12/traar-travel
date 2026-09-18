import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16 text-sm text-gray-500 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left: TRAAR */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
          <span className="font-semibold text-gray-800">TRAAR</span>
          <span>·</span>
          <span>Transparent Travel Intelligence</span>
        </div>

        {/* Right: Links */}
        <div className="flex items-center gap-6 text-xs sm:text-sm">
          <Link to="/help" className="hover:text-gray-900 transition-colors">
            About
          </Link>
          <Link to="/help" className="hover:text-gray-900 transition-colors">
            Contact
          </Link>
          <Link to="/help" className="hover:text-gray-900 transition-colors">
            Terms
          </Link>
          <Link to="/help" className="hover:text-gray-900 transition-colors">
            Privacy
          </Link>
          <span className="text-[11px] text-gray-400 hidden lg:inline">
            UI concept · Demo data
          </span>
        </div>
      </div>
    </footer>
  );
}
