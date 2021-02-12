import axios from 'axios';

// const prodConfig = {
//   url: 'http://sistemas.equatorialenergia.com.br/integracaoca/api',
// };

const devConfig = {
  url: 'http://localhost:3333',
};

const authenticationApi = axios.create({
  baseURL: devConfig.url,
});

export default authenticationApi;