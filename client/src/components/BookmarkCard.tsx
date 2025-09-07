import React from 'react';
import { PLATFORM_LOGOS, getPlatform, getFavicon } from '../utils/platformLogos';

function formatDateTime(dt?: string | Date) {
  if (!dt) return '';
  return new Date(dt).toLocaleString();
}

interface BookmarkCardProps {
  item: any;
  menuOpen: string | null;
  setMenuOpen: (id: string | null) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const BookmarkCard: React.FC<BookmarkCardProps> = ({ item, menuOpen, setMenuOpen, onEdit, onDelete }) => {
  const platform = getPlatform(item.url);
  const logo = platform && PLATFORM_LOGOS[platform] ? PLATFORM_LOGOS[platform] : item.url && getFavicon(item.url) ? getFavicon(item.url) : undefined;

  return (
    <div
      className="relative flex flex-col p-5 rounded-xl shadow bg-white hover:shadow-md gap-3 transition cursor-pointer card mb-8 break-inside-avoid border border-gray-100 group"
    >
      {/* 3-dots menu button, shown on hover */}
      <button
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-gray-100 shadow transition-opacity opacity-0 group-hover:opacity-100 z-20"
        onClick={() => setMenuOpen(item.id || item._id)}
        tabIndex={-1}
        aria-label="Options"
      >
        <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
          <circle cx="4" cy="10" r="2" fill="#888" />
          <circle cx="10" cy="10" r="2" fill="#888" />
          <circle cx="16" cy="10" r="2" fill="#888" />
        </svg>
      </button>
      {/* Dropdown menu */}
      {menuOpen === (item.id || item._id) && (
        <div className="absolute top-12 right-4 w-32 bg-white rounded-lg shadow-lg border border-gray-100 z-30 flex flex-col text-sm">
          <button className="px-4 py-2 text-left hover:bg-gray-100" onClick={() => onEdit(item.id || item._id)}>Edit</button>
          <button className="px-4 py-2 text-left text-red-600 hover:bg-gray-100" onClick={() => onDelete(item.id || item._id)}>Delete</button>
        </div>
      )}
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
        tabIndex={-1}
      >
        <div className="flex items-center justify-center w-full">
          {item.imageUrl || item.image ? (
            <img src={item.imageUrl || item.image} alt={item.title || item.name} className="w-full object-cover rounded-lg mb-2" />
          ) : null}
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <div className="font-semibold text-base break-words mb-2 text-gray-900">{item.title || item.name}</div>
          <div className="text-sm text-gray-600 break-words mb-2 line-clamp-2 max-h-12 overflow-hidden">{item.description}</div>
          {(item.createdAt || item.updatedAt) && (
            <div className="mt-auto text-right">
              <span className="font-medium text-xs text-gray-400">{formatDateTime(item.createdAt || item.updatedAt)}</span>
            </div>
          )}
        </div>
      </a>
      {logo && (
        <img
          src={logo}
          alt={platform || 'favicon'}
          className="absolute bottom-4 left-4 w-7 h-7 object-contain z-10"
          title={platform ? platform.charAt(0).toUpperCase() + platform.slice(1) : 'Site favicon'}
        />
      )}
    </div>
  );
};

export default BookmarkCard;
