import React, { useEffect, useRef, useState } from "react";
import type { FC } from "react";
import { Button } from "@/components/ui/button"; // optional: remove if you don't want the Button component

interface PlatformFilterProps {
  platforms: string[];
  selectedPlatforms: string[];
  onPlatformToggle: (platform: string) => void;
}

const PlatformFilter: FC<PlatformFilterProps> = ({
  platforms,
  selectedPlatforms,
  onPlatformToggle,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocumentClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", onDocumentClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocumentClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const allSelected = platforms.length > 0 && platforms.every((p) => selectedPlatforms.includes(p));

  const toggleAll = () => {
    if (allSelected) {
      // clear all
      platforms.forEach((p) => {
        if (selectedPlatforms.includes(p)) onPlatformToggle(p);
      });
    } else {
      // select missing
      platforms.forEach((p) => {
        if (!selectedPlatforms.includes(p)) onPlatformToggle(p);
      });
    }
  };

  const selectedLabel =
    selectedPlatforms.length === 0
      ? "All platforms"
      : selectedPlatforms.length === 1
      ? selectedPlatforms[0]
      : `${selectedPlatforms.length} selected`;

  return (
    <div ref={ref} className="relative inline-block text-left">
      {/* Trigger */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((s) => !s)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-gray-900/40 border border-gray-700 text-gray-200 hover:bg-gray-900/60 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-cabinet"
      >
        <span className="text-sm">{selectedLabel}</span>
        <svg
          className={`w-4 h-4 transition-transform ${open ? "rotate-180" : "rotate-0"}`}
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden
        >
          <path d="M5 7l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="dialog"
          aria-label="Platform filter"
          className="absolute mt-2 right-0 z-50 w-64 bg-gray-900/50 backdrop-blur-sm border border-gray-700/20 rounded-md shadow-lg py-2"
        >
          <div className="px-3 pb-2 border-b border-gray-800/40">
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm text-gray-300 font-semibold">Platforms</div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleAll}
                  className="text-xs px-2 py-1 rounded-md bg-gray-800/40 hover:bg-gray-800/60 text-gray-200"
                >
                  {allSelected ? "Clear" : "Select all"}
                </button>
              </div>
            </div>
            <div className="text-xs text-gray-400 mt-1">Filter results by platform</div>
          </div>

          <ul
            role="listbox"
            aria-multiselectable
            className="max-h-40 overflow-auto py-2 px-2 space-y-1"
          >
            {platforms.length === 0 ? (
              <li className="px-2 py-1 text-sm text-gray-400">No platforms</li>
            ) : (
              platforms.map((platform) => {
                const checked = selectedPlatforms.includes(platform);
                return (
                  <li key={platform} className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-800/40">
                    <label className="flex items-center cursor-pointer gap-2 w-full">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => onPlatformToggle(platform)}
                        className="w-4 h-4 rounded bg-gray-800 border-gray-600 text-indigo-400 focus:ring-indigo-500"
                        aria-checked={checked}
                      />
                      <span className="text-sm text-gray-200">{platform}</span>
                      <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-gray-800/40 text-gray-300">
                      </span>
                    </label>
                  </li>
                );
              })
            )}
          </ul>

          <div className="px-3 pt-2 border-t border-gray-800/40 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                // clear selections
                platforms.forEach((p) => {
                  if (selectedPlatforms.includes(p)) onPlatformToggle(p);
                });
                setOpen(false);
              }}
              className="text-xs text-gray-300 px-2 py-1 rounded-md hover:bg-gray-800/40"
            >
              Clear
            </button>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs bg-indigo-600/80 text-white px-3 py-1 rounded-md hover:brightness-105"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformFilter;
