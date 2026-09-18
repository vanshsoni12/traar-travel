import React from 'react';
import { Briefcase } from 'lucide-react';

export default function EmptyState({
  icon: Icon = Briefcase,
  title = 'No items found',
  description = 'Try adjusting your filters or search terms.',
  actionLabel,
  onAction
}) {
  return (
    <div className="text-center py-12 px-4 bg-white border border-gray-200 rounded-md shadow-sm">
      <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 mx-auto mb-3">
        <Icon className="w-6 h-6 stroke-[1.5]" />
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="py-1.5 px-3 bg-[#176B4A] hover:bg-[#135A3E] text-white text-xs font-medium rounded transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
