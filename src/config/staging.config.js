import devConfig from './development.config';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  ...devConfig,
  client: {
    baseURL: 'http://localhost:3000',
  },
};
