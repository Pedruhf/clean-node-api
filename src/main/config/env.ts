export default {
  mongoUrl: process.env.MONGO_URL || "mongodb://mongo/clean-node-api",
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || "peikidz2231",
}
