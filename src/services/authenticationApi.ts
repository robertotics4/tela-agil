import axios from 'axios';

// const prodConfig = {
//   url: 'http://sistemas.equatorialenergia.com.br/integracaoca/api',
// };

const devConfig = {
  url: process.env.REACT_APP_API_URL,
};

const authenticationApi = axios.create({
  baseURL: devConfig.url,
});

export default authenticationApi;
