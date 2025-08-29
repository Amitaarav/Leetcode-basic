export interface Submission {
  jobId: string;
  code: string;
}

export interface ExecutionResult {
  jobId: string;
  success: boolean;
  output: string;
  executionTime: number;
  timestamp: string;
}
