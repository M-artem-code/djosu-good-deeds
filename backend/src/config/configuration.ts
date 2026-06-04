export default () => ({
  port: parseInt(process.env.PORT ?? '3001', 10),
  mongodbUri: process.env.MONGODB_URI ?? 'mongodb://localhost:27017/djosu',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
  jwt: {
    secret: process.env.JWT_SECRET ?? 'dev-secret-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  },
});
