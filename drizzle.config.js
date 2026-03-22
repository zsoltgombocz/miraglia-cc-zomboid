export default {
  dialect: 'sqlite',
  schema: './server/schema.js',
  out: './server/migrations',
  dbCredentials: {
    url: './server/data/zomboid.db',
  },
};
