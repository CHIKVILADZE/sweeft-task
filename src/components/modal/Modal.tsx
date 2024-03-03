import React from 'react';

export default function PhotoModal({
  setSelectedPhoto,
  selectedPhoto,
  setStatistics,
  statistics,
}: {
  setSelectedPhoto: (value: null) => void;
  selectedPhoto: any;
  setStatistics: any;
  statistics: any;
}) {
  const closeModal = () => {
    setSelectedPhoto(null);
    setStatistics(null);
  };

  return (
    <>
      {selectedPhoto && (
        <div className="modal-overlay " onClick={closeModal}>
          <div className="modal flex flex-col justify-center items-center">
            <img src={selectedPhoto.urls.small} alt={selectedPhoto.id} />
            {statistics && (
              <div className="stats text-xl">
                <p>
                  {' '}
                  <span className="font-bold">Views:</span> {statistics.views}
                </p>
                <p>
                  {' '}
                  <span className="font-bold">Likes:</span>{' '}
                  {selectedPhoto.likes}
                </p>
                <p>
                  {' '}
                  <span className="font-bold">Downloads:</span>{' '}
                  {statistics.downloads}
                </p>
              </div>
            )}
            <button
              className="w-1/2 mt-4 bg-blue-500 text-white rounded-xl p-3 text-xl text-center"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
