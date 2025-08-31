import { spawn } from "child_process";
import fs from "fs";
import os from "os";
import path from "path";

interface ExecutionResult {
  success: boolean;
  output: string;
  executionTime: number;
}

const BANNED_TOKENS = ["import os", "subprocess", "exec(", "eval(", "open("];
/**
 * const BANNED_PATTERNS = [
  /\bimport\s+os\b/,
  /\bsubprocess\b/,
  /\bexec\s*\(/,
  /\beval\s*\(/,
  /\bopen\s*\(/,
  /__import__\s*\(/
];

Better and safer alternatives : regex based scanning
this would detect hidden import like - import os or _import-("os")
  
 */
function isSafe(code: string): boolean {
  const lowered = code.toLowerCase();
  return !BANNED_TOKENS.some((t) => lowered.includes(t));
}

function createTempFile(code: string): string {
  const filePath = path.join(os.tmpdir(), `exec_${Date.now()}.py`); //path: /tmp/exec_1693473189111.py
  fs.writeFileSync(filePath, code);
  return filePath;
}

function cleanup(filePath: string) {
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
}

export async function executePython(code: string): Promise<ExecutionResult> {
  return new Promise((resolve) => {

    if (!isSafe(code)) {
      return resolve({
        success: false,
        output: "Blocked unsafe code",
        executionTime: 0,
      });
    }

    const filePath = createTempFile(code);
    const start = Date.now(); // start timestamp for measuring execution time
    const proc = spawn("python3", [filePath]);

    let stdout = "";
    let stderr = "";

    proc.stdout.on("data", (data) => (stdout += data.toString()));
    proc.stderr.on("data", (data) => (stderr += data.toString()));

    proc.on("close", (code) => {
      cleanup(filePath);
      resolve({
        success: code === 0,
        output: code === 0 ? stdout || "Executed with no output" : stderr,
        executionTime: Date.now() - start,
      });
    });

    proc.on("error", (err) => {
      cleanup(filePath);
      resolve({ success: false, output: `Error: ${err.message}`, executionTime: Date.now() - start });
    });

    setTimeout(() => {
      if (!proc.killed) {
        proc.kill("SIGKILL");
        cleanup(filePath);
        resolve({ success: false, output: "Timeout (5s)", executionTime: 5000 });
      }
    }, 5000);
  });
}
