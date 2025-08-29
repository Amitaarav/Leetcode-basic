'use client';

import { Play, Code } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  onExecute: () => void;
  isRunning: boolean;
}

export default function CodeEditor({ code, onChange, onExecute, isRunning }: CodeEditorProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      
      const newValue = code.substring(0, start) + '    ' + code.substring(end);
      onChange(newValue);
      
      setTimeout(() => {
        e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 4;
      }, 0);
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isRunning) {
        onExecute();
      }
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl border border-gray-700">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <Code className="h-5 w-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-gray-100">Python Editor</h2>
          <div className="flex items-center space-x-1 text-xs text-gray-400">
            <span>•</span>
            <span>Real-time execution</span>
          </div>
        </div>
        <button
          onClick={onExecute}
          disabled={isRunning}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
            isRunning
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25'
          }`}
        >
          <Play className={`h-4 w-4 ${isRunning ? 'animate-pulse' : ''}`} />
          <span>{isRunning ? 'Running...' : 'Run Code'}</span>
        </button>
      </div>
      
      <div className="relative">
        <textarea
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full h-96 p-4 bg-transparent text-gray-100 font-mono text-sm resize-none focus:outline-none"
          placeholder="# Write your Python code here..."
          spellCheck={false}
        />
        
        {/* Line numbers */}
        <div className="absolute top-0 left-0 p-4 text-gray-500 font-mono text-sm pointer-events-none select-none">
          {code.split('\n').map((_, index) => (
            <div key={index} className="leading-6">
              {index + 1}
            </div>
          ))}
        </div>
        
        {/* Indent guide */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="w-full h-full opacity-10">
            {/* Grid pattern for better code visualization */}
          </div>
        </div>
      </div>
      
      <div className="px-4 py-2 bg-gray-750 border-t border-gray-700 text-xs text-gray-400">
        Press <kbd className="px-1 py-0.5 bg-gray-700 rounded">Tab</kbd> for indentation • 
        Press <kbd className="px-1 py-0.5 bg-gray-700 rounded">Ctrl+Enter</kbd> to run
      </div>
    </div>
  );
}