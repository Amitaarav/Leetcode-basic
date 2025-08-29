export interface ExecutionResult {
  success: boolean;
  output: string;
  executionTime: number;
  timestamp: string;
  error?: string;
}

export interface HistoryItem {
  id: string;
  code: string;
  result: ExecutionResult;
  timestamp: string;
}