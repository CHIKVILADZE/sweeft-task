import { useState } from 'react';

interface SearchComponentProps {
  fetchPopularPhotos: () => Promise<void>;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  fetchPopularPhotos,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async () => {
    if (searchTerm.trim() !== '') {
      await fetchPopularPhotos();
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        className="border-2"
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      <button className="border-2" onClick={handleSearch}>
        Search
      </button>
    </div>
  );
};

export default SearchComponent;
