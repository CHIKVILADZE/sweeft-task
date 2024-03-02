import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useScrollContext } from '../../context/PhotoContext';
import SearchComponent from '../search/Search';

import '../../index.css';
import PhotoModal from '../modal/Modal';

const HomeComponent: React.FC = () => {
  const { fetchPopularPhotos, photos, handleScroll, accessKey, setPhotos } =
    useScrollContext();
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [statistics, setStatistics] = useState<any | null>(null);
  const [searchTerms, setSearchTerms] = useState<string[]>([]);

  const handleImageClick = async (photo: any) => {
    setSelectedPhoto(photo);
    try {
      const response = await axios.get(
        `https://api.unsplash.com/photos/${photo.id}/statistics?client_id=${accessKey}`
      );
      const statisticsData = response.data;
      setStatistics({
        views: statisticsData.views.total,
        downloads: statisticsData.downloads.total,
      });
    } catch (error) {
      console.error('Error fetching photo statistics:', error);
      setStatistics(null);
    }
  };

  useEffect(() => {
    fetchPopularPhotos();
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  console.log(selectedPhoto);

  const handleSearch = async (searchTerm: string) => {
    try {
      if (searchTerm.trim() === '') {
        await fetchPopularPhotos();
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
        setPhotos(searchData.results);
        setSearchTerms((prevTerms) => [...prevTerms, searchTerm]);
      }
    } catch (error) {
      console.error('Error searching photos:', error);
    }
  };

  const handleSearchTermClick = async (term: string) => {
    await handleSearch(term);
  };

  console.log('PHOTTOOS', photos);
  return (
    <div>
      <div className="mt-20 flex justify-center">
        <SearchComponent
          handleSearch={handleSearch}
          setSearchTerms={setSearchTerms}
        />
      </div>
      <div>
        <h2>Search Historyjhjhjh</h2>
        <ul>
          {searchTerms.map((term, index) => (
            <li
              className="border-2 border-gray-600 w-40 p-1 rounded-xl cursor-pointer"
              key={index}
              onClick={() => handleSearchTermClick(term)}
            >
              {term}
            </li>
          ))}
        </ul>
      </div>
      <div className=" flex flex-wrap gap-4 justify-center mt-10 ">
        {photos.map((photo, index) => (
          <div
            key={`${photo.id}-${index}`}
            className="w-full   max-w-[500px] h-[333px]"
          >
            <img
              src={photo.urls.regular}
              alt={photo.id}
              onClick={() => handleImageClick(photo)}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
      <PhotoModal
        setSelectedPhoto={setSelectedPhoto}
        selectedPhoto={selectedPhoto}
        setStatistics={setStatistics}
        statistics={statistics}
      />
    </div>
  );
};

export default HomeComponent;
