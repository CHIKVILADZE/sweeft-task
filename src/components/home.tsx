import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Photo {
  id: string;
  urls: {
    regular: string;
    full: string;
  };
  downloads: number;
  likes: number;
  views: number;
}

const apiKey = process.env.REACT_APP_API_KEY;
const API_URL = `https://api.unsplash.com/photos?client_id=${apiKey}`;
console.log(apiKey);

const HomeComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const fetchPopularPhotos = async () => {
    const url = `${API_URL}&order_by=popular`;
    try {
      const response = await axios.get<Photo[]>(url);
      setPhotos(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching popular photos:', error);
    }
  };

  useEffect(() => {
    fetchPopularPhotos();
  }, []);

  const handleScroll = () => {
    const scrollThreshold = 100;
    const scrolledToBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - scrollThreshold;

    if (scrolledToBottom && !isLoading) {
      setIsLoading(true);
      setPage((prevPage) => prevPage + 1);
      fetchPopularPhotos();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading]);

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      fetchPopularPhotos();
      setSearchHistory((prev) => [...prev, searchTerm]);
    }
  };

  const fetchPhotoStatistics = async (photoId: string) => {
    const url = `https://api.unsplash.com/photos/${photoId}/statistics?client_id=${apiKey}`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching photo statistics:', error);
      return null;
    }
  };

  const handleSearchHistoryClick = (term: string) => {
    setSearchTerm(term);
    fetchPopularPhotos();
  };

  const handleImageClick = async (photo: Photo) => {
    setSelectedPhoto(photo);
    const statistics = await fetchPhotoStatistics(photo.id);
    if (statistics) {
      console.log('Views:', statistics.views.total);
      console.log('Downloads:', statistics.downloads.total);
    }
  };

  const closeModal = () => {
    setSelectedPhoto(null);
  };

  console.log('selectedPhoto', selectedPhoto);

  return (
    <div style={{ height: '100vh' }}>
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
      <div>
        <h2>Search History</h2>
        <ul>
          {searchHistory.map((term, index) => (
            <li key={index} onClick={() => handleSearchHistoryClick(term)}>
              {term}
            </li>
          ))}
        </ul>
      </div>
      <div className="border-2 border-green-700  flex mt-4 ">
        <h2 className="text-3xl font-bold underline">Popular Images</h2>
        {photos.map((photo) => (
          <div key={photo.id} className="">
            <img
              src={photo.urls.regular}
              alt={photo.id}
              width={200}
              height={200}
              onClick={() => handleImageClick(photo)}
            />
          </div>
        ))}
      </div>
      {selectedPhoto && (
        <div className="modal  border-4 w-1/2 h-1/2 border-red-500">
          <div className="modal-content w-1/2 h-1/2 border-4 border-green-500">
            <img src={selectedPhoto.urls.full} alt={selectedPhoto.id} />
            <p>Views: {selectedPhoto.views}</p>
            <p>Likes: {selectedPhoto.likes}</p>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeComponent;
