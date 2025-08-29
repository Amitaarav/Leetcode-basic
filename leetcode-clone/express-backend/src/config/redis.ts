import { createClient, type RedisClientType  } from "redis";

export const redisClient: RedisClientType = createClient({
    socket: { host: "localhost", port: 6379 },
});


export const redisSubscriber: RedisClientType = createClient({
    socket: { host: "localhost", port: 6379 },
});

export async function connectRedis(){
    await redisClient.connect()
    await redisSubscriber.connect()

    console.log("Redis client connected");
}