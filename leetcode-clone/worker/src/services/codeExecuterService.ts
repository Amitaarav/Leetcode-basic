import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";

import { redisClient } from "../config/redis";
import { Submission, ExecutionResult } from "../types/type";

const BANNED_TOKENS = [
  "import os", "import sys", "subprocess", "open(", "exec(", "eval(",
  "__import__", "shutil", "socket", "requests", "fork", "spawn", "pty",
  "pip", "write(", "remove(", "rmdir(", "system(", "popen(",
  "input(", "raw_input(", "__file__", "__name__", "globals(", "locals(",
  "dir(", "vars(", "compile(", "reload(", "help(", "quit(", "exit(",
];

function isSafe(code: string): boolean {
  return !BANNED_TOKENS.some((token) => code.toLowerCase().includes(token));
}

function createTempFile(code: string): string {
  const fileName = `python_exec_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.py`;
  const filePath = path.join(os.tmpdir(), fileName);
  fs.writeFileSync(filePath, code);
  return filePath;
}

function cleanupTempFile(filePath: string): void {
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

export async function executePythonCode(submission: Submission): Promise<ExecutionResult> {
  return new Promise((resolve) => {
    const { jobId, code } = submission;

    if (!isSafe(code)) {
      const result: ExecutionResult = {
        jobId,
        success: false,
        output: "Error: Code contains blocked operations",
        executionTime: 0,
        timestamp: new Date().toISOString(),
      };
      redisClient.setEx(`result:${jobId}`, 300, JSON.stringify(result));
      return resolve(result);
    }

    const filePath = createTempFile(code);
    const start = Date.now();
    const proc: ChildProcessWithoutNullStreams = spawn("python3", [filePath]);

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (data: Buffer) => (stdout += data.toString()));
    proc.stderr.on("data", (data: Buffer) => (stderr += data.toString()));

    proc.on("close", (code: number) => {
      cleanupTempFile(filePath);
      const result: ExecutionResult = {
        jobId,
        success: code === 0,
        output: code === 0 ? stdout || "No output" : stderr || "Unknown error",
        executionTime: Date.now() - start,
        timestamp: new Date().toISOString(),
      };
      redisClient.setEx(`result:${jobId}`, 300, JSON.stringify(result));
      resolve(result);
    });

    proc.on("error", (err: Error) => {
      cleanupTempFile(filePath);
      const result: ExecutionResult = {
        jobId,
        success: false,
        output: `Execution error: ${err.message}`,
        executionTime: Date.now() - start,
        timestamp: new Date().toISOString(),
      };
      redisClient.setEx(`result:${jobId}`, 300, JSON.stringify(result));
      resolve(result);
    });

    // timeout safeguard
    setTimeout(() => {
      if (!proc.killed) {
        proc.kill("SIGKILL");
        cleanupTempFile(filePath);
        const result: ExecutionResult = {
          jobId,
          success: false,
          output: "Timeout (5s)",
          executionTime: 5000,
          timestamp: new Date().toISOString(),
        };
        redisClient.setEx(`result:${jobId}`, 300, JSON.stringify(result));
        resolve(result);
      }
    }, 5000);
  });
}
