'use client';

import { Terminal, CheckCircle, AlertCircle, Clock, Zap } from 'lucide-react';
import { ExecutionResult } from '@/types/executions';

interface OutputPanelProps {
  output: ExecutionResult | null;
  streamOutput?: string;
  isRunning: boolean;
}

export default function OutputPanel({ output, streamOutput = '', isRunning }: OutputPanelProps) {
  const hasStreamOutput = streamOutput.length > 0;
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700">
      <div className="flex items-center space-x-2 p-4 border-b border-gray-700">
        <Terminal className="h-5 w-5 text-green-400" />
        <h3 className="text-lg font-semibold text-gray-100">Output</h3>
        {hasStreamOutput && (
          <div className="flex items-center space-x-1 text-xs text-blue-400">
            <Zap className="h-3 w-3" />
            <span>Live</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        {isRunning ? (
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-blue-400">
              <div className="animate-spin h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full"></div>
              <span>Executing code...</span>
            </div>
            
            {/* Stream output while running */}
            {hasStreamOutput && (
              <div className="p-3 rounded-md border bg-gray-900 border-blue-500/30">
                <div className="flex items-center space-x-2 mb-2">
                  <Zap className="h-3 w-3 text-blue-400" />
                  <span className="text-xs text-blue-400 font-medium">Real-time Output</span>
                </div>
                <pre className="text-sm font-mono whitespace-pre-wrap text-gray-100 max-h-32 overflow-y-auto">
                  {streamOutput}
                </pre>
              </div>
            )}
          </div>
        ) : output ? (
          <div className="space-y-3">
            {/* Status indicator */}
            <div className="flex items-center space-x-2">
              {output.success ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-400" />
              )}
              <span className={`font-medium ${output.success ? 'text-green-400' : 'text-red-400'}`}>
                {output.success ? 'Success' : 'Error'}
              </span>
              <span className="text-gray-500">•</span>
              <div className="flex items-center space-x-1 text-gray-400 text-sm">
                <Clock className="h-3 w-3" />
                <span>{output.executionTime}ms</span>
              </div>
            </div>

            {/* Output content */}
            <div className={`p-3 rounded-md border ${
              output.success 
                ? 'bg-gray-900 border-green-500/30' 
                : 'bg-red-900/20 border-red-500/30'
            }`}>
              <pre className={`text-sm font-mono whitespace-pre-wrap ${
                output.success ? 'text-gray-100' : 'text-red-200'
              }`}>
                {output.output}
              </pre>
            </div>
          </div>
        ) : (
          <div className="text-gray-400 text-center py-8">
            <Terminal className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Run your code to see the output here</p>
            <p className="text-sm mt-1 text-gray-500">Real-time streaming enabled</p>
          </div>
        )}
      </div>
    </div>
  );
}