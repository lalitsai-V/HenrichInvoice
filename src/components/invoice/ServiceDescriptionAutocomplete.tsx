'use client';

import React, { useState, useRef, useEffect, useMemo, useId } from 'react';
import { createPortal } from 'react-dom';
import { ALL_FLAT_SERVICES, FlatServiceItem } from '@/data/serviceCatalogue';
import { Wrench, Check } from 'lucide-react';

interface ServiceDescriptionAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
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

export function ServiceDescriptionAutocomplete({
  value,
  onChange,
  placeholder = 'Type service description or choose from catalogue...',
  className = '',
  id,
}: ServiceDescriptionAutocompleteProps) {
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

  // Filter & rank suggestions based on user input
  const suggestions = useMemo(() => {
    const q = (value || '').trim().toLowerCase();
    if (!q) return [];

    const startsWithMatches: FlatServiceItem[] = [];
    const wordStartsMatches: FlatServiceItem[] = [];
    const containsMatches: FlatServiceItem[] = [];
    const categoryMatches: FlatServiceItem[] = [];
    const seenNames = new Set<string>();

    for (const item of ALL_FLAT_SERVICES) {
      const nameLower = item.name.toLowerCase();
      const catLower = item.category.toLowerCase();

      if (nameLower === q) {
        startsWithMatches.unshift(item);
        seenNames.add(nameLower);
      } else if (nameLower.startsWith(q)) {
        startsWithMatches.push(item);
        seenNames.add(nameLower);
      } else {
        const words = nameLower.split(/[\s/-]+/);
        if (words.some((w) => w.startsWith(q))) {
          wordStartsMatches.push(item);
          seenNames.add(nameLower);
        } else if (nameLower.includes(q)) {
          containsMatches.push(item);
          seenNames.add(nameLower);
        } else if (catLower.includes(q)) {
          categoryMatches.push(item);
          seenNames.add(nameLower);
        }
      }
    }

    const merged = [
      ...startsWithMatches,
      ...wordStartsMatches,
      ...containsMatches,
      ...categoryMatches,
    ];

    // Return top 15 matches to keep the dropdown responsive and clean
    return merged.slice(0, 15);
  }, [value]);

  // Recalculate dropdown position
  const updatePosition = () => {
    if (!inputRef.current) return;
    const rect = inputRef.current.getBoundingClientRect();
    const dropdownHeight = 280;
    const spaceBelow = window.innerHeight - rect.bottom;
    const showAbove = spaceBelow < dropdownHeight && rect.top > dropdownHeight;

    const width = Math.max(rect.width, 320);
    let left = rect.left;

    // Boundary check so dropdown doesn't overflow screen width
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

  // Re-position when suggestions change or on window resize/scroll outside dropdown
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

  // Handle clicking outside
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

  const handleSelect = (item: FlatServiceItem) => {
    onChange(item.name);
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
      `[data-item-index="${highlightedIndex}"]`
    ) as HTMLElement | null;
    if (activeEl) {
      activeEl.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex]);

  const hasSearchQuery = (value || '').trim().length > 0;
  const shouldShowDropdown = isOpen && hasSearchQuery;

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
          if (hasSearchQuery) {
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
            {/* Header / query status */}
            <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
              <span className="flex items-center gap-1.5 text-[#073763]">
                <Wrench className="size-3 text-[#073763]" />
                Catalogue Suggestions ({suggestions.length})
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                ↑↓ to navigate • ↵ to select • ESC to close
              </span>
            </div>

            {/* List */}
            <div
              ref={scrollListRef}
              className="max-h-64 overflow-y-auto overscroll-contain touch-pan-y divide-y divide-slate-100 p-1"
            >
              {suggestions.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-500">
                  <p className="font-medium text-slate-700">No exact catalogue match</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    You can keep typing your custom service description freely.
                  </p>
                </div>
              ) : (
                suggestions.map((svc, idx) => {
                  const isHighlighted = idx === highlightedIndex;
                  const isCurrent =
                    value.trim().toLowerCase() === svc.name.toLowerCase();

                  return (
                    <div
                      key={`${svc.categoryId}-${svc.name}`}
                      data-item-index={idx}
                      onMouseDown={(e) => {
                        // Prevent input blur before click registers
                        e.preventDefault();
                        handleSelect(svc);
                      }}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      className={`px-3 py-2 rounded-lg cursor-pointer transition-colors text-left flex items-center justify-between gap-2.5 ${
                        isHighlighted
                          ? 'bg-[#073763] text-white'
                          : isCurrent
                          ? 'bg-blue-50/80 text-[#073763]'
                          : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div
                          className={`text-xs font-semibold truncate ${
                            isHighlighted ? 'text-white' : 'text-slate-900'
                          }`}
                        >
                          {isHighlighted ? (
                            <span>{svc.name}</span>
                          ) : (
                            <HighlightMatch text={svc.name} query={value} />
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`text-[9.5px] font-medium px-1.5 py-0.5 rounded truncate ${
                              isHighlighted
                                ? 'bg-white/20 text-white'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {svc.category}
                          </span>
                          {svc.categoryNote && (
                            <span
                              className={`text-[9px] font-medium ${
                                isHighlighted ? 'text-amber-200' : 'text-amber-600'
                              }`}
                            >
                              • BS6
                            </span>
                          )}
                        </div>
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

            {/* Footer tip */}
            <div className="px-3 py-1.5 bg-slate-50/80 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
              <span>Matching against Henrich 11-category catalog</span>
              <span>Custom text allowed</span>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
