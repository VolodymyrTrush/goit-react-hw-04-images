
import axios from 'axios';
import { BASE_URL, API_KEY } from '../constants/constants';

const instance = axios.create({
  baseURL: BASE_URL,
  params: {
    key: API_KEY,
  },
});

export const getImages = async (query, page) => {
   const response = await instance.get(``, {
    params: {
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      per_page: 12,
      q: query,
      page: page,
    },
  });
  return response.data.hits;
};
