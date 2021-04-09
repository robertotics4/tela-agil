import axios from 'axios';

const devConfig = {
  url: 'http://localhost:3333',
};

const yaloApi = axios.create({
  baseURL: devConfig.url,
});

export default yaloApi;
