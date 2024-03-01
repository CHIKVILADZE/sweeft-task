import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useScrollContext } from '../context/PhotoContext';
import SearchComponent from './searchComponent';

import '../index.css';
import PhotoModal from './modal';

const HomeComponent: React.FC = () => {
  const { fetchPopularPhotos, photos, handleScroll, accessKey } =
    useScrollContext();
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [statistics, setStatistics] = useState<any | null>(null);

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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [photos]);

  console.log(selectedPhoto);

  return (
    <div>
      <div>
        {/* <SearchComponent fetchPopularPhotos={fetchPopularPhotos} /> */}
      </div>
      <div className=" flex flex-wrap gap-4 justify-center mt-40 ">
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
