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

const API_KEY = 'uptUNlgKP2lnP_twCh_zQREVyC49F96JabqiACl4QRo';
const API_URL = `https://api.unsplash.com/photos?client_id=${API_KEY}`;

const HomeComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async (term?: string, pageNum: number = page) => {
    const url = term
      ? `${API_URL}&query=${term}&page=${pageNum}`
      : `${API_URL}&page=${pageNum}`;
    try {
      const response = await axios.get<Photo[]>(url);
      if (pageNum === 1) {
        setPhotos(response.data);
      } else {
        setPhotos((prevPhotos) => [...prevPhotos, ...response.data]);
      }
      setIsLoading(false); // Reset isLoading after fetching photos
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  const handleScroll = () => {
    const scrollThreshold = 100;
    const scrolledToBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - scrollThreshold;

    if (scrolledToBottom && !isLoading) {
      setIsLoading(true);
      setPage((prevPage) => prevPage + 1);
      fetchPhotos(searchTerm, page + 1);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isLoading]);

  return (
    <div style={{ height: '100vh' }}>
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
        />
      </div>
      <div>
        <h2>Search History</h2>
      </div>
      <div className="border-2 border-green-700  flex flex-row flex-wrap gap-4 ">
        <h2 className="text-3xl font-bold underline">Popular Images</h2>
        {photos.map((photo) => (
          <div key={photo.id} className="">
            <img
              src={photo.urls.regular}
              alt={photo.id}
              width={200}
              height={200}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeComponent;
