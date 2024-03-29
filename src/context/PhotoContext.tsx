import axios from 'axios';
import React, { createContext, useContext, useRef, useState } from 'react';

interface GaleryContext {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  fetchPopularPhotos: () => Promise<void>;
  photos: any[];
  handleScroll: () => void;
  accessKey?: string;
  setPhotos: React.Dispatch<React.SetStateAction<any[]>>;
  handleSearch: (searchTerm: string) => Promise<void>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  searchTerms: string[];
  searchedPhotos: any[];
  setSearchedPhotos: React.Dispatch<React.SetStateAction<any[]>>;
  setSearchTerms: React.Dispatch<React.SetStateAction<string[]>>;
}

const GalleryContext = createContext<GaleryContext | null>(null);

const accessKey = '-x_Qs82taDBdtqh3XnlggA5g58UaRZu7IOIwKJ3I8-c';
const apiUrl = `https://api.unsplash.com/photos?client_id=${accessKey}`;

export const GalleryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [photos, setPhotos] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchTerms, setSearchTerms] = useState<string[]>([]);
  const [searchedPhotos, setSearchedPhotos] = useState<any[]>([]);

  const searchCache = useRef<{ [key: string]: any[] }>({});

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
      if (searchedPhotos.length > 0) {
        // If there are searched photos, fetch more
        fetchMoreSearchedPhotos();
      } else {
        // If there are no searched photos, fetch popular photos
        fetchPopularPhotos();
      }
    }
  };

  const fetchMoreSearchedPhotos = async () => {
    try {
      const response = await axios.get(
        `https://api.unsplash.com/search/photos`,
        {
          params: {
            query: searchTerm,
            per_page: 20,
            client_id: process.env.REACT_APP_API_KEY,
            page: page.current,
          },
        }
      );
      const searchData = response.data;
      setSearchedPhotos((prevPhotos) => [...prevPhotos, ...searchData.results]);
      page.current++;
    } catch (error) {
      console.error('Error fetching more searched photos:', error);
    }
  };

  const handleSearch = async (searchTerm: string) => {
    try {
      setSearchTerm(searchTerm);
      if (searchTerm.trim() === '') {
        await fetchPopularPhotos();
      } else {
        // Check if search results are cached
        if (searchCache.current[searchTerm]) {
          setSearchedPhotos(searchCache.current[searchTerm]);
        } else {
          const response = await axios.get(
            `https://api.unsplash.com/search/photos`,
            {
              params: {
                query: searchTerm,
                per_page: 20,
                client_id: process.env.REACT_APP_API_KEY,
              },
            }
          );
          const searchData = response.data;
          setSearchedPhotos(searchData.results);
          setSearchTerms((prevTerms) => [...prevTerms, searchTerm]);

          // Cache the search results
          searchCache.current[searchTerm] = searchData.results;
        }
      }
    } catch (error) {
      console.error('Error searching photos:', error);
    }
  };

  return (
    <GalleryContext.Provider
      value={{
        setIsLoading,
        isLoading,
        fetchPopularPhotos,
        photos,
        setPhotos,
        handleScroll,
        accessKey,
        handleSearch,
        searchTerm,
        setSearchTerm,
        searchTerms,
        searchedPhotos,
        setSearchedPhotos,
        setSearchTerms,
      }}
    >
      {children}
    </GalleryContext.Provider>
  );
};

export const useGalleryContext = () => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('useGalleryContext must be used within a GalleryProvider');
  }
  return context;
};
