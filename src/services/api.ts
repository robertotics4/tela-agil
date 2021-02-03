import axios from 'axios';

const prodConfig = {
  url: 'http://sistemas.equatorialenergia.com.br/integracaoca/api',
  token: 'yuS3txGkbzhzVvCOS1BbI3U4zRVC+ov58+TUdr7ocNuVwvVyP+95gNwMX+pwx/uR',
};

const devConfig = {
  url: 'http://localhost:3333',
};

const api = axios.create({
  baseURL: devConfig.url,
});

// api.defaults.headers.Autorizacao = token;

export default api;
