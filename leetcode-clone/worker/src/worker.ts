import { connectRedis, redisClient } from "./config/redis.js";
import { executePythonCode} from "./services/codeExecuterService.js";
import { submission } from "./types/type.js";
async function startWorker() {
  await connectRedis();
  console.log("Worker started. Waiting for jobs...");

  while (true) {
    try {
      const response = await redisClient.brPop("submission", 0);
      if (!response) continue;

      const submission: Submission = JSON.parse(response.element);
      console.log(`Processing job ${submission.jobId}`);

      const result = await executePythonCode(submission);
      console.log(`Job ${result.jobId} processed: ${result.success ? "SUCCESS" : "ERROR"}`);
    } catch (err) {
      console.error("Worker error:", err);
    }
  }
}

// Handle graceful shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down worker...");
  await redisClient.quit();
  process.exit(0);
});

// Handle graceful shutdown
process.on("SIGTERM", async () => {
  console.log("Shutting down worker...");
  await redisClient.quit();
  process.exit(0);
});

startWorker();
