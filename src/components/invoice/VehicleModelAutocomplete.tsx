'use client';

import React, { useState, useRef, useEffect, useMemo, useId } from 'react';
import { createPortal } from 'react-dom';
import { searchModels, findVehicleMake, FlatModelItem } from '@/data/vehicleCatalogue';
import { Car, Check } from 'lucide-react';

interface VehicleModelAutocompleteProps {
  value: string;
  onChange: (model: string) => void;
  selectedMake?: string;
  onSelectMakeIfEmpty?: (make: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

function HighlightMatch({ text, query }: { text: string; query: string }) {
  const trimmed = query.trim();
  if (!trimmed) return <span>{text}</span>;

  try {
    const escaped = trimmed.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(${escaped})`, 'gi');
    const parts = text.split(regex);

    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark
              key={i}
              className="bg-amber-200/90 text-slate-900 rounded-xs px-0.5 font-bold no-underline"
            >
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
  } catch {
    return <span>{text}</span>;
  }
}

export function VehicleModelAutocomplete({
  value,
  onChange,
  selectedMake = '',
  onSelectMakeIfEmpty,
  placeholder = 'e.g. Creta SX (O)',
  className = '',
  id,
}: VehicleModelAutocompleteProps) {
  const autoId = useId();
  const inputId = id || autoId;
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollListRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    width: number;
    showAbove: boolean;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const matchedMakeObj = useMemo(() => findVehicleMake(selectedMake), [selectedMake]);

  // Compute suggestions based on typed query and currently selected make
  const suggestions = useMemo(() => {
    return searchModels(value, selectedMake, 15);
  }, [value, selectedMake]);

  // Update popup coordinates
  const updatePosition = () => {
    if (!inputRef.current) return;
    const rect = inputRef.current.getBoundingClientRect();
    const dropdownHeight = 260;
    const spaceBelow = window.innerHeight - rect.bottom;
    const showAbove = spaceBelow < dropdownHeight && rect.top > dropdownHeight;

    const width = Math.max(rect.width, 280);
    let left = rect.left;

    if (left + width > window.innerWidth - 8) {
      left = Math.max(8, window.innerWidth - width - 8);
    }

    setCoords({
      top: showAbove ? rect.top - 6 : rect.bottom + 6,
      left,
      width,
      showAbove,
    });
  };

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();

    const handleScrollOrResize = (e: Event) => {
      // If the scroll event originated inside our own dropdown list, ignore it
      if (dropdownRef.current && dropdownRef.current.contains(e.target as Node)) {
        return;
      }
      updatePosition();
    };

    window.addEventListener('resize', handleScrollOrResize, { passive: true });
    window.addEventListener('scroll', handleScrollOrResize, { passive: true, capture: true });

    return () => {
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, true);
    };
  }, [isOpen, suggestions.length]);

  // Completely isolate wheel & touch scrolling within the suggestions box
  useEffect(() => {
    if (!isOpen) return;
    const el = scrollListRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation();

      const isScrollingUp = e.deltaY < 0;
      const isScrollingDown = e.deltaY > 0;
      const atTop = el.scrollTop <= 0;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

      // Prevent outer screen from scrolling when reaching boundaries inside the box
      if ((isScrollingUp && atTop) || (isScrollingDown && atBottom)) {
        e.preventDefault();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.stopPropagation();
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isOpen, suggestions.length]);

  // Handle click outside
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        inputRef.current?.contains(target) ||
        dropdownRef.current?.contains(target)
      ) {
        return;
      }
      setIsOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [isOpen]);

  const handleSelect = (item: FlatModelItem) => {
    onChange(item.model);

    // Auto-fill Make if user hadn't selected one yet
    if (!selectedMake && onSelectMakeIfEmpty) {
      onSelectMakeIfEmpty(item.make);
    }

    setIsOpen(false);
    setHighlightedIndex(-1);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'ArrowDown' && suggestions.length > 0) {
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        e.preventDefault();
        handleSelect(suggestions[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setHighlightedIndex(-1);
    } else if (e.key === 'Tab') {
      setIsOpen(false);
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (highlightedIndex < 0 || !dropdownRef.current) return;
    const activeEl = dropdownRef.current.querySelector(
      `[data-model-index="${highlightedIndex}"]`
    ) as HTMLElement | null;
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex]);

  const hasQuery = (value || '').trim().length > 0;
  // Show dropdown if open AND either user typed a letter OR a company is chosen
  const shouldShowDropdown = isOpen && (hasQuery || Boolean(matchedMakeObj));

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        id={inputId}
        type="text"
        autoComplete="off"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          if (!isOpen) setIsOpen(true);
          setHighlightedIndex(-1);
        }}
        onFocus={() => {
          // Open dropdown if company is chosen or user typed something
          if (matchedMakeObj || hasQuery) {
            setIsOpen(true);
            updatePosition();
          }
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={className}
      />

      {/* Floating Suggestions Portal */}
      {mounted &&
        shouldShowDropdown &&
        coords &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: 'fixed',
              top: coords.showAbove ? undefined : coords.top,
              bottom: coords.showAbove ? window.innerHeight - coords.top : undefined,
              left: coords.left,
              width: coords.width,
              zIndex: 99999,
            }}
            className="bg-white rounded-xl shadow-2xl border border-slate-200/90 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-100 ring-1 ring-black/5"
          >
            {/* Header info */}
            <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
              <span className="flex items-center gap-1.5 text-[#073763]">
                <Car className="size-3 text-[#073763]" />
                {matchedMakeObj
                  ? `${matchedMakeObj.make} Models (${suggestions.length})`
                  : `Model Suggestions (${suggestions.length})`}
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                ↑↓ navigate • ↵ select
              </span>
            </div>

            {/* Suggestions List */}
            <div
              ref={scrollListRef}
              className="max-h-56 overflow-y-auto overscroll-contain touch-pan-y divide-y divide-slate-100 p-1"
            >
              {suggestions.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-500">
                  <p className="font-medium text-slate-700">No catalogue model match</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    You can keep typing your custom model/trim.
                  </p>
                </div>
              ) : (
                suggestions.map((item, idx) => {
                  const isHighlighted = idx === highlightedIndex;
                  const isCurrent =
                    value.trim().toLowerCase() === item.model.toLowerCase();

                  return (
                    <div
                      key={`${item.make}-${item.model}`}
                      data-model-index={idx}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelect(item);
                      }}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      className={`px-3 py-2 rounded-lg cursor-pointer transition-colors text-left flex items-center justify-between gap-2 ${
                        isHighlighted
                          ? 'bg-[#073763] text-white'
                          : isCurrent
                          ? 'bg-blue-50/80 text-[#073763]'
                          : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="min-w-0 flex-1 flex items-center justify-between gap-2">
                        <div
                          className={`text-xs font-semibold truncate ${
                            isHighlighted ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          {isHighlighted ? (
                            <span>{item.model}</span>
                          ) : (
                            <HighlightMatch text={item.model} query={value} />
                          )}
                        </div>

                        {/* Brand badge */}
                        <span
                          className={`text-[9.5px] font-medium px-1.5 py-0.5 rounded truncate shrink-0 ${
                            isHighlighted
                              ? 'bg-white/20 text-white'
                              : item.make.toLowerCase() === (matchedMakeObj?.make || '').toLowerCase()
                              ? 'bg-blue-100 text-[#073763]'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {item.make}
                        </span>
                      </div>

                      {isCurrent && (
                        <Check
                          className={`size-3.5 shrink-0 ${
                            isHighlighted ? 'text-white' : 'text-[#073763]'
                          }`}
                        />
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-3 py-1 bg-slate-50/80 border-t border-slate-100 text-[9.5px] text-slate-400 flex items-center justify-between">
              <span>
                {matchedMakeObj
                  ? `Filtered for ${matchedMakeObj.make}`
                  : 'Multi-brand catalog'}
              </span>
              <span>Custom model names allowed</span>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
