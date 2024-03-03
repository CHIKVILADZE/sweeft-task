import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';

const accessKey = process.env.REACT_APP_API_KEY;
const apiUrl = `https://api.unsplash.com/photos`;

const fetchPhotos = async (searchTerm: string) => {
  if (searchTerm.trim() === '') {
    const response = await axios.get(apiUrl, {
      params: {
        client_id: accessKey,
        order_by: 'popular',
        per_page: 5,
      },
    });
    return response.data;
  } else {
    const response = await axios.get(`${apiUrl}/search`, {
      params: {
        client_id: accessKey,
        query: searchTerm,
        per_page: 20,
      },
    });
    return response.data.results;
  }
};
