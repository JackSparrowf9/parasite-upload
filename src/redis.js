import { Redis } from "ioredis";

const redisClient = new Redis({
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

redisClient.on("connect", () => {
  console.log("connected to redis sucessfully!");
});

redisClient.on("error", (err) => {
  console.log("Redis connect error: ", err);
});

export default redisClient;
