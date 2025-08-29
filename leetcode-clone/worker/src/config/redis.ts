import { createClient, type RedisClientType } from "redis";

export const redisClient: RedisClientType = createClient({
  socket: { host: "localhost", port: 6379 },
});

export async function connectRedis() {
    await redisClient.connect();
    console.log("Worker connected to Redis");
}
