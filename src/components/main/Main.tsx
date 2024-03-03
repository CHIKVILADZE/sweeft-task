import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useGalleryContext } from '../../context/PhotoContext';
import SearchComponent from '../search/Search';

import '../../index.css';
import PhotoModal from '../modal/Modal';

const HomeComponent: React.FC = () => {
  const {
    fetchPopularPhotos,
    photos: originalPhotos,
    handleScroll,
    accessKey,
    handleSearch,
    searchTerm,
    setSearchedPhotos,
    searchTerms,
    searchedPhotos,
  } = useGalleryContext();
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
    if (searchTerm === '') {
      setSearchedPhotos(originalPhotos);
    }
  }, [searchTerm, originalPhotos]);

  console.log(selectedPhoto);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll);
  }, [searchTerms]);

  console.log('searchTerm', searchTerm);

  return (
    <div>
      <div className="mt-20 flex justify-center">
        <SearchComponent />
      </div>

      <div className=" flex flex-wrap gap-4 justify-center mt-10 ">
        {searchedPhotos.map((searchedPhoto, index) => (
          <div
            key={`${searchedPhoto.id}-${index}`}
            className="w-full   max-w-[500px] h-[333px]"
          >
            <img
              src={searchedPhoto.urls.regular}
              alt={searchedPhoto.id}
              onClick={() => handleImageClick(searchedPhoto)}
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
