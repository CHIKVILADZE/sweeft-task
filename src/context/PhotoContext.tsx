import axios from 'axios';
import React, { createContext, useContext, useRef, useState } from 'react';

interface ScrollContextProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  fetchPopularPhotos: () => Promise<void>;
  photos: any[];
  handleScroll: () => void;
  accessKey?: string;
  setPhotos: React.Dispatch<React.SetStateAction<any[]>>;
}

const ScrollContext = createContext<ScrollContextProps | null>(null);

const accessKey = process.env.REACT_APP_API_KEY;
const apiUrl = `https://api.unsplash.com/photos?client_id=${accessKey}`;

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [photos, setPhotos] = useState<any[]>([]);

  const page = useRef<number>(1);

  const fetchPopularPhotos = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(apiUrl, {
        params: {
          order_by: 'popular',
          per_page: 5,
          page: page.current,
        },
      });
      const newPhotos = response.data;
      setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
      console.log('Hello');
      setIsLoading(false);
      page.current++;
    } catch (error) {
      console.error('Error fetching popular photos:', error);
      setIsLoading(false);
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.scrollHeight - 100
    ) {
      fetchPopularPhotos();
    }
  };

  return (
    <ScrollContext.Provider
      value={{
        setIsLoading,
        isLoading,
        fetchPopularPhotos,
        photos,
        setPhotos,
        handleScroll,
        accessKey,
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
};

export const useScrollContext = () => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScrollContext must be used within a ScrollProvider');
  }
  return context;
};
