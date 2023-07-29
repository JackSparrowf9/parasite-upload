import { Queue } from "bullmq";
import redisClient from "../redis.js";

const queue = new Queue("pdf", { connection: redisClient });

export default queue;
