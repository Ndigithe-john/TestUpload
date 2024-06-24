const Redis = require("redis");

const RedisClient = Redis.createClient({
  url: "redis://localhost:6379",
});

const BlackListedRedisClient = Redis.createClient({
  url: "redis://localhost:6379",
  password: "",
});
RedisClient.on("connect", () => {
  console.log("Redis running on: localhost");
});

RedisClient.on("error", (error) => {
  console.error("Redis connection error:", error);
});

module.exports = { RedisClient, BlackListedRedisClient };
