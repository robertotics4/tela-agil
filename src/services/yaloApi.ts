import axios from 'axios';

const devConfig = {
  url: process.env.REACT_APP_API_URL,
};

const yaloApi = axios.create({
  baseURL: devConfig.url,
});

export default yaloApi;
