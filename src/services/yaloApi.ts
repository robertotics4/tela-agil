import axios from 'axios';

// const prodConfig = {
//   url: 'https://api-wa.yalochat.com/firehose/api',
// };

const devConfig = {
  url: 'http://localhost:3333',
};

const yaloApi = axios.create({
  baseURL: devConfig.url,
});

export default yaloApi;
