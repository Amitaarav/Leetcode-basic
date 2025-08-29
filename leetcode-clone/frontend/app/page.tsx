'use client';

import { useState, useEffect, useRef } from 'react';
import CodeEditor from '@/components/CodeEditor';
import OutputPanel from '@/components/OutputPanel';
import HistoryPanel from '@/components/HistoryPanel';
import { ExecutionResult, HistoryItem } from '@/types/executions';
import {Navbar} from "@/components/Navbar";
export default function Home() {
  const [code, setCode] = useState(`# Write your Python code here
print("Hello, World!")

# Example: Calculate factorial
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(f"Factorial of 5: {factorial(5)}")

# Example: List comprehension
numbers = [1, 2, 3, 4, 5]
squares = [x**2 for x in numbers]
print(f"Squares: {squares}")
`);
  const [output, setOutput] = useState<ExecutionResult | null>(null);
  const [streamOutput, setStreamOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  
  const socketRef = useRef<WebSocket | null>(null);
  const currentJobRef = useRef<string | null>(null);

  // Initialize WebSocket connection
  useEffect(() => {
  const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000");
  socketRef.current = ws;

  ws.onopen = () => {
    console.log("Connected to server");
    setConnectionStatus("connected");
  };

  ws.onclose = () => {
    console.log("Disconnected from server");
    setConnectionStatus("disconnected");
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "job_queued":
          console.log("Job queued:", data.jobId);
          currentJobRef.current = data.jobId;
          setStreamOutput("");
          break;

        case "execution_stream":
          if (data.jobId === currentJobRef.current) {
            setStreamOutput((prev) => prev + data.chunk);
          }
          break;

        case "execution_result":
          if (data.jobId === currentJobRef.current) {
            const result: ExecutionResult = {
              success: data.success,
              output: data.output,
              executionTime: data.executionTime,
              timestamp: new Date().toISOString(),
            };

            setOutput(result);
            setIsRunning(false);

            const newHistoryItem: HistoryItem = {
              id: data.jobId,
              code,
              result,
              timestamp: new Date().toISOString(),
            };

            setHistory((prev) => [newHistoryItem, ...prev.slice(0, 2)]);
            currentJobRef.current = null;
          }
          break;

        default:
          console.warn("Unknown message type:", data);
      }
    } catch (err) {
      console.error("Error parsing WebSocket message:", err);
    }
  };

  return () => {
    ws.close();
  };
}, [code]);


  // Load history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('codeExecutionHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error loading history from localStorage:', error);
      }
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('codeExecutionHistory', JSON.stringify(history));
  }, [history]);

  const executeCode = async () => {
    if (!code.trim()) {
      setOutput({
        success: false,
        output: 'Please enter some code to execute.',
        executionTime: 0,
        timestamp: new Date().toISOString()
      });
      return;
    }

    if (connectionStatus !== 'connected') {
      // Fallback to REST API if WebSocket is not connected
      executeCodeREST();
      return;
    }

    setIsRunning(true);
    setOutput(null);
    setStreamOutput('');

    socketRef.current?.send(
    JSON.stringify({
      type: "submit_code",
      code
    })
  );
  };

  // Fallback REST API execution
  const executeCodeREST = async () => {
    setIsRunning(true);
    setOutput(null);
    setStreamOutput('');

    try {
      const response = await fetch('http://localhost:4000/api/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      const result = await response.json();
      setOutput(result);

      // Add to history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        code,
        result,
        timestamp: new Date().toISOString()
      };

      setHistory(prev => [newHistoryItem, ...prev.slice(0, 2)]);

    } catch (error) {
      setOutput({
        success: false,
        output: 'Failed to connect to execution server. Make sure the backend is running on port 4000.',
        executionTime: 0,
        timestamp: new Date().toISOString()
      });
    } finally {
      setIsRunning(false);
    }
  };

  const loadFromHistory = (historyItem: HistoryItem) => {
    setCode(historyItem.code);
    setOutput(historyItem.result);
    setStreamOutput('');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar/>
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            CodeRunner Pro
          </h1>
          <p className="text-gray-400 mt-2">Execute Python code safely with real-time streaming</p>
          
          {/* Connection Status */}
          <div className="mt-4 flex items-center justify-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-400' : 
              connectionStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' : 
              'bg-red-400'
            }`}></div>
            <span className="text-sm text-gray-400">
              {connectionStatus === 'connected' ? 'Real-time connected' : 
               connectionStatus === 'connecting' ? 'Connecting...' : 
               'Using fallback mode'}
            </span>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Code Editor */}
          <div className="lg:col-span-2">
            <CodeEditor
              code={code}
              onChange={setCode}
              onExecute={executeCode}
              isRunning={isRunning}
            />
          </div>

          {/* Output and History */}
          <div className="space-y-6">
            <OutputPanel 
              output={output} 
              streamOutput={streamOutput}
              isRunning={isRunning} 
            />
            <HistoryPanel history={history} onLoadFromHistory={loadFromHistory} />
          </div>
        </div>
      </div>
    </div>
  );
}