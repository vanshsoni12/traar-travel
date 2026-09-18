import React from 'react';
import { Link } from 'react-router-dom';

export default function Breadcrumbs({ items = [], separator = '/' }) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="py-2.5 text-xs text-gray-500 mb-2">
      <ol className="flex items-center flex-wrap gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className="hover:text-gray-800 transition-colors hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'text-gray-700 font-medium' : ''}>
                  {item.label}
                </span>
              )}
              {!isLast && <span className="text-gray-400 select-none">{separator}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
