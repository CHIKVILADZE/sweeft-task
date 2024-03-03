import React, { useEffect } from 'react';
import { useGalleryContext } from '../../context/PhotoContext';
import axios from 'axios';

function HistoryComponent() {
  const {
    searchTerms,
    searchedPhotos,
    setSearchTerm,
    fetchPopularPhotos,
    setSearchedPhotos,
    searchTerm,
  } = useGalleryContext();

  const handleSearchTermClick = async (searchTerm: string) => {
    try {
      setSearchTerm(searchTerm);
      if (searchTerm.trim() === '') {
        await fetchPopularPhotos();
      } else {
        const response = await axios.get(
          `https://api.unsplash.com/search/photos`,
          {
            params: {
              query: searchTerm,
              per_page: 100,
              client_id: process.env.REACT_APP_API_KEY,
            },
          }
        );
        console.log('response', response);

        const searchData = response.data;
        setSearchedPhotos(searchData.results);
      }
    } catch (error) {
      console.error('Error searching photos:', error);
    }
  };

  const handleScroll = () => {
    if (
      window.innerHeight + window.scrollY >=
      document.body.scrollHeight - 100
    ) {
      if (searchTerms.length > 0) {
        if (searchTerm === searchTerms[searchTerms.length - 1]) {
          handleSearchTermClick(searchTerm);
        }
      } else {
        fetchPopularPhotos();
      }
    }
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  return (
    <div className="w-full flex ">
      <div className="w-1/3 mt-20 p-4 ">
        <table className="mt-4">
          <thead>
            <tr>
              <th className="p-2 border border-gray-400 rounded-md">#</th>
              <th className="p-2 border border-gray-400 rounded-md">History</th>
            </tr>
          </thead>
          <tbody>
            {searchTerms.map((term, index) => (
              <tr
                key={index}
                className="cursor-pointer"
                onClick={() => handleSearchTermClick(term)}
              >
                <td className="p-2 border border-gray-400 rounded-md">
                  {index + 1}
                </td>
                <td className="p-2 border border-gray-400 rounded-md">
                  {term}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="0 w-2/3 mt-20 flex flex-wrap gap-2 justify-center ">
        {' '}
        {searchedPhotos.map((searchedPhoto, index) => (
          <div
            key={`${searchedPhoto.id}-${index}`}
            className="w-full    max-w-[500px] h-[333px]"
          >
            <img
              src={searchedPhoto.urls.regular}
              alt={searchedPhoto.id}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default HistoryComponent;
