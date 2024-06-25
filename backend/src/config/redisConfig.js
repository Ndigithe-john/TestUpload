require("dotenv").config();
const Redis = require("redis");

const RedisClient = Redis.createClient({
  url: process.env.REDIS_URL,
});

const BlackListedRedisClient = Redis.createClient({
  url: process.env.REDIS_URL,
  password: "",
});
RedisClient.on("connect", () => {
  console.log("Redis running on: localhost");
});

RedisClient.on("error", (error) => {
  console.error("Redis connection error:", error);
});

module.exports = { RedisClient, BlackListedRedisClient };
