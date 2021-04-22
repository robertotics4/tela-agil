import axios from 'axios';

// const prodConfig = {
//   url: 'https://services.equatorialenergia.com.br/api',
// };

const devConfig = {
  url: process.env.REACT_APP_API_URL,
};

const eqtlBarApi = axios.create({
  baseURL: devConfig.url,
});

export default eqtlBarApi;
