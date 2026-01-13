import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

export interface SearchableSelectOption {
  value: number | string;
  label: string;
  disabled?: boolean;
}

interface SearchableSelectProps {
  options: SearchableSelectOption[];
  value: number | string | null;
  onChange: (value: number | string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

const SearchableSelect = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  className = '',
  'aria-label': ariaLabel,
}: SearchableSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Get current selected option label
  const selectedOption = options.find((opt) => opt.value === value);

  // Filter options based on search term
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset highlighted index when filtered options change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchTerm]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (isOpen && listRef.current) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen) {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
          e.preventDefault();
          setIsOpen(true);
        }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setHighlightedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredOptions[highlightedIndex] && !filteredOptions[highlightedIndex].disabled) {
            onChange(filteredOptions[highlightedIndex].value);
            setIsOpen(false);
            setSearchTerm('');
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          setSearchTerm('');
          break;
      }
    },
    [isOpen, filteredOptions, highlightedIndex, onChange]
  );

  const handleSelect = (optionValue: number | string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    setSearchTerm('');
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            if (!isOpen) {
              setTimeout(() => inputRef.current?.focus(), 0);
            }
          }
        }}
        disabled={disabled}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`
          w-full flex items-center justify-between gap-2
          bg-slate-800/60 border border-slate-700/50 text-gray-300
          px-4 py-2 rounded-md text-sm text-left
          focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50
          transition-all
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-800/80'}
          ${isOpen ? 'ring-2 ring-cyan-500/50 border-cyan-500/50' : ''}
        `.replace(/\s+/g, ' ').trim()}
      >
        <span className={selectedOption ? 'text-gray-200' : 'text-gray-500'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className="flex items-center gap-1">
          {selectedOption && !disabled && (
            <X
              size={16}
              className="text-gray-400 hover:text-gray-200 transition-colors"
              onClick={handleClear}
            />
          )}
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-slate-800 border border-slate-700/50 rounded-md shadow-lg shadow-black/20 overflow-hidden">
          {/* Search Input */}
          <div className="p-2 border-b border-slate-700/50">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                ref={inputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Type to search..."
                className="w-full bg-slate-900/50 border border-slate-700/50 text-gray-200 pl-9 pr-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500/50 placeholder-gray-500"
              />
            </div>
          </div>

          {/* Options List */}
          <ul
            ref={listRef}
            role="listbox"
            className="max-h-60 overflow-y-auto py-1"
          >
            {filteredOptions.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-500 text-center">
                No results found
              </li>
            ) : (
              filteredOptions.map((option, index) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={option.value === value}
                  aria-disabled={option.disabled}
                  onClick={() => !option.disabled && handleSelect(option.value)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`
                    px-4 py-2 text-sm cursor-pointer transition-colors
                    ${option.value === value ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-300'}
                    ${index === highlightedIndex && !option.disabled ? 'bg-slate-700/50' : ''}
                    ${option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-700/50'}
                  `.replace(/\s+/g, ' ').trim()}
                >
                  {option.label}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
