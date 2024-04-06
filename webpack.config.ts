import { resolve } from 'path';

const webpackConfig = {
  resolve: {
    fallback: {
      "crypto": require.resolve("crypto-browserify")
    }
  }
};

export default webpackConfig;