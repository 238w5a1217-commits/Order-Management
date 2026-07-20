import { useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ value, onChange }) => {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <Search className="w-4 h-4 text-surface-400" />
      </div>
      <input
        ref={inputRef}
        id="search-input"
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Search by Order ID or Customer Name..."
        className="input-field pl-9 pr-8"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-3 flex items-center text-surface-400 hover:text-surface-600 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
