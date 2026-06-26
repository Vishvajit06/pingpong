// lib/rateLimiter.ts
import { RateLimiterRedis, RateLimiterRes } from "rate-limiter-flexible";
import redisClient from "@/lib/ConfigRedis";

declare global {
  var rateLimiter: RateLimiterRedis | undefined;
}

let rateLimiter: RateLimiterRedis;

if (!global.rateLimiter) {
  global.rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "rate_limit",
    points: 10, // 5 requests
    duration: 60, // per 60 seconds
  });
}
rateLimiter = global.rateLimiter;

export async function checkRateLimit(ip: string) {
  try {
    const res = await rateLimiter.consume(ip);
    return {
      success: true,
      remaining: res.remainingPoints,
    };
  } catch (err) {
    const error = err as RateLimiterRes;
    if (error.msBeforeNext) {
      return {
        success: false,
        retryAfter: Math.ceil(error.msBeforeNext / 1000),
      };
    } else {
      console.error("Rate limiter error:", err);
      return {
        success: true,
        remaining: 0,
      };
    }
  }
}
