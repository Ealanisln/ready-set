'use client';

import { useEffect, useState } from 'react';
import { H } from 'highlight.run';
import { CONSTANTS } from '@/constants';
import { Button } from '@/components/ui/button';
import { logError } from '@/utils/error-logging';

export default function HighlightTest() {
  const [status, setStatus] = useState<string>('Initializing...');
  const [logs, setLogs] = useState<string[]>([]);
  
  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toISOString().split('T')[1].split('.')[0]} - ${message}`]);
  };
  
  useEffect(() => {
    try {
      // Check if Highlight is initialized
      const isInitialized = (window.H as any)?.__initialized || false;
      addLog(`Highlight initialized: ${isInitialized}`);
      
      // Try to initialize it again for testing with correct options
      H.init(CONSTANTS.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID, {
        debug: true,
        networkRecording: {
          enabled: true,
          recordHeadersAndBody: true,
          urlBlocklist: ['/api/auth', '/api/login'],
        }
      });
      
      // Mark as initialized
      (window.H as any).__initialized = true;
      
      // Set custom attribute
      H.identify('test-user-id', { 
        highlightTest: true,
        tester: 'Admin User',
        environment: process.env.NODE_ENV || 'development'
      });
      
      // Test event tracking
      H.track('highlight_test_page_load', {
        timestamp: new Date().toISOString(),
        path: window.location.pathname
      });
      
      addLog('Highlight re-initialized and test event sent');
      setStatus('Ready for testing');
    } catch (err) {
      console.error('Error in HighlightTest:', err);
      addLog(`Initialization error: ${err instanceof Error ? err.message : String(err)}`);
      setStatus('Failed to initialize');
    }
  }, []);
  
  const testError = () => {
    try {
      addLog('Triggering test error...');
      throw new Error('This is an intentional test error from the Highlight Test page');
    } catch (err) {
      if (err instanceof Error) {
        addLog(`Error caught: ${err.message}`);
        H.consumeError(err);
        
        // Also use the error logging utility
        logError(err, {
          message: 'Test error triggered manually',
          source: 'api:other',
          additionalContext: {
            testType: 'manual-trigger',
            component: 'HighlightTest'
          }
        });
        
        setStatus('Test error sent to Highlight');
      }
    }
  };
  
  const testPromiseRejection = () => {
    addLog('Triggering unhandled promise rejection...');
    
    // This creates a promise rejection that should be caught by window.onunhandledrejection
    Promise.reject(new Error('Test promise rejection from Highlight Test'));
    
    setStatus('Unhandled rejection triggered');
  };
  
  const triggerUncaughtError = () => {
    addLog('Triggering uncaught error (check console)...');
    
    // Delay to allow the log to be displayed first
    setTimeout(() => {
      // This will create an error that will be caught by window.onerror
      const obj: any = null;
      // @ts-ignore - intentional error
      obj.nonExistentMethod();
    }, 100);
  };
  
  const testApiError = async () => {
    addLog('Testing API error tracking...');
    try {
      const response = await fetch('/api/highlight-test?error=true');
      const data = await response.json();
      
      addLog(`API response: ${JSON.stringify(data)}`);
    } catch (err) {
      addLog(`API fetch error: ${err instanceof Error ? err.message : String(err)}`);
      if (err instanceof Error) {
        H.consumeError(err);
      }
    }
  };
  
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Highlight.io Error Testing</h1>
      
      <div className="p-4 bg-slate-100 rounded-md mb-6">
        <p className="font-semibold">Status: <span className={status.includes('Failed') ? 'text-red-600' : 'text-green-600'}>{status}</span></p>
        <p className="text-sm mt-1">Project ID: {CONSTANTS.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID}</p>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <Button onClick={testError} variant="outline">
          Send Test Error
        </Button>
        
        <Button onClick={testPromiseRejection} variant="outline">
          Test Promise Rejection
        </Button>
        
        <Button onClick={triggerUncaughtError} variant="destructive">
          Trigger Uncaught Error
        </Button>
        
        <Button onClick={testApiError} variant="outline" className="bg-amber-100">
          Test API Error
        </Button>
      </div>
      
      <div className="border rounded-md p-4 bg-black text-white font-mono text-sm">
        <h2 className="text-lg mb-2 font-bold text-white">Logs:</h2>
        <div className="max-h-60 overflow-y-auto">
          {logs.map((log, i) => (
            <div key={i} className="border-b border-gray-800 py-1">{log}</div>
          ))}
          {logs.length === 0 && <div className="text-gray-500">No logs yet...</div>}
        </div>
      </div>
    </div>
  );
} 