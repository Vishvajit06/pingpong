// lib/ConfigRedis.ts
import Redis from "ioredis";

const redisClient = new Redis(); // defaults to localhost:6379

redisClient.on("connect", () => console.log("✅ Redis connected"));
redisClient.on("error", (err) => console.error("Redis error:", err));

export default redisClient;
