import React from 'react';
import { Info, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTrip } from '../context/TripContext';

export default function BudgetSummary() {
  const { budget, setBudget, estimatedTotal, remainingBudget } = useTrip();

  return (
    <div className="bg-white border border-gray-200 rounded-md p-5 shadow-sm space-y-4">
      <h3 className="text-base font-semibold text-gray-900">
        Trip budget
      </h3>

      <div>
        <div className="relative">
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value) || 0)}
            className="w-full py-2 px-3 pr-8 border border-gray-300 rounded text-sm text-gray-800 focus:outline-none focus:border-[#176B4A]"
          />
          <span className="absolute right-3 top-2.5 text-xs text-gray-500">
            ₹
          </span>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
        <div className="flex items-center justify-between text-gray-600">
          <span>Estimated total</span>
          <span className="font-bold text-gray-900">
            ₹{estimatedTotal.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="flex items-center justify-between text-gray-600">
          <span>Remaining</span>
          <span className={`font-bold ${remainingBudget >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
            ₹{remainingBudget.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      <div className="border-t border-gray-100 pt-3 flex items-start gap-2 text-xs text-gray-500">
        <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
        <span>Trip estimate, not a booking.</span>
      </div>

      <div className="pt-2">
        <Link
          to="/destinations/bhopal"
          className="w-full py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-medium rounded flex items-center justify-center gap-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add more to trip</span>
        </Link>
      </div>
    </div>
  );
}
