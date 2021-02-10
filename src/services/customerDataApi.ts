import axios from 'axios';

// const prodConfig = {
//   url: 'https://services.equatorialenergia.com.br/api',
// };

const devConfig = {
  url: 'http://localhost:3333',
};

const customerDataApi = axios.create({
  baseURL: devConfig.url,
});

export default customerDataApi;
