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

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async (term?: string) => {
    const url = term ? `${API_URL}&query=${term}` : API_URL;
    try {
      const response = await axios.get<Photo[]>(url);
      setPhotos(response.data);
      console.log('responseeee', response.data[1]);
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  return (
    <div>
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
      <div>
        <h2>Popular Images</h2>
        {photos.map((photo) => (
          <div key={photo.id}>
            <img src={photo.urls.regular} alt={photo.id} />
            <button>View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeComponent;
