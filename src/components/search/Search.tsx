import React, { useState, useEffect } from 'react';

interface SearchComponentProps {
  handleSearch: (searchTerm: string) => Promise<void>;
  setSearchTerms: React.Dispatch<React.SetStateAction<string[]>>;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  handleSearch,
  setSearchTerms,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [delay, setDelay] = useState(1000); // Throttle delay
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const delayedSearch = (term: string) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const id = setTimeout(() => {
      handleSearch(term);
    }, delay);
    setTimeoutId(id);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    delayedSearch(term);
  };

  return (
    <div>
      <input
        className="p-2 rounded-xl border-2 border-gray-300 w-80 mt-4"
        type="text"
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search..."
      />
    </div>
  );
};

export default SearchComponent;
