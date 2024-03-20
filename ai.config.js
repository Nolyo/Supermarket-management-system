// ai.config.js
const config = {
  development: {
    config: {
      instrumentationKey: process.env.APPINSIGHTS_INSTRUMENTATIONKEY_DEV,
    },
  },
  production: {
    config: {
      instrumentationKey: process.env.APPINSIGHTS_INSTRUMENTATIONKEY_PROD,
    },
  },
};

const env = process.env.NODE_ENV || 'development';

export default config[env];
