'use client';

import { History, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { HistoryItem } from '@/types/executions';

interface HistoryPanelProps {
  history: HistoryItem[];
  onLoadFromHistory: (item: HistoryItem) => void;
}

export default function HistoryPanel({ history, onLoadFromHistory }: HistoryPanelProps) {
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const truncateCode = (code: string, maxLength: number = 50) => {
    const firstLine = code.split('\n')[0];
    if (firstLine.length <= maxLength) return firstLine;
    return firstLine.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700">
      <div className="flex items-center space-x-2 p-4 border-b border-gray-700">
        <History className="h-5 w-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-gray-100">Recent Executions</h3>
      </div>
      
      <div className="p-4">
        {history.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No execution history yet</p>
            <p className="text-sm mt-1">Run some code to see history here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => onLoadFromHistory(item)}
                className="p-3 bg-gray-750 rounded-md border border-gray-600 cursor-pointer hover:bg-gray-700 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {item.result.success ? (
                      <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex items-center space-x-1 text-xs text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>{formatTime(item.timestamp)}</span>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {item.result.executionTime}ms
                  </span>
                </div>
                
                <div className="text-sm">
                  <div className="text-gray-300 font-mono mb-1 group-hover:text-white transition-colors">
                    {truncateCode(item.code)}
                  </div>
                  <div className={`text-xs ${
                    item.result.success ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {truncateCode(item.result.output, 40)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}