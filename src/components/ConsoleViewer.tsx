
import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLogData } from '@/utils/api';
import LogItem from './LogItem';
import { ClipboardCopy, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface ConsoleViewerProps {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

const ConsoleViewer = ({ 
  autoRefresh = true, 
  refreshInterval = 5000 
}: ConsoleViewerProps) => {
  const { logs, isLoading, error, refreshLogs } = useLogData(
    autoRefresh ? refreshInterval : 0
  );
  const { toast } = useToast();
  const consoleEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (consoleEndRef.current) {
      consoleEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const copyLogsToClipboard = () => {
    const logText = logs.map(log => 
      `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}${
        log.details ? `\nDetails: ${JSON.stringify(log.details, null, 2)}` : ''
      }`
    ).join('\n\n');
    
    navigator.clipboard.writeText(logText).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "All logs have been copied to your clipboard.",
      });
    }).catch(err => {
      console.error('Failed to copy logs:', err);
      toast({
        title: "Copy failed",
        description: "Could not copy logs to clipboard.",
        variant: "destructive",
      });
    });
  };

  return (
    <motion.div 
      className="console-container w-full max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex items-center">
        <div className="flex space-x-2 mr-4">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 text-center text-sm font-medium text-gray-600 dark:text-gray-300">
          Console Logs
        </div>
        <button 
          onClick={copyLogsToClipboard}
          className="flex items-center text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <ClipboardCopy className="h-4 w-4 mr-1" />
          Copy Logs
        </button>
      </div>
      
      <div className="console-container-inner">
        {isLoading && logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-8 h-8 mb-4 border-2 border-console-accent border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Loading logs...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3 mb-4">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="text-lg font-medium mb-2">Failed to load logs</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 max-w-xs">
              {error}
            </p>
            <button
              onClick={refreshLogs}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-gray-500 dark:text-gray-400">No logs available</p>
          </div>
        ) : (
          <div className="console-body">
            <AnimatePresence>
              {logs.map((log, index) => (
                <LogItem key={log.id || index} log={log} index={index} />
              ))}
            </AnimatePresence>
            <div ref={consoleEndRef} />
          </div>
        )}
      </div>
      
      <div className={cn(
        "px-4 py-3 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex justify-between",
        isLoading && "animate-pulse"
      )}>
        <span>
          {logs.length} {logs.length === 1 ? 'entry' : 'entries'}
        </span>
        <span>
          {isLoading ? 'Updating...' : 'Last updated: ' + new Date().toLocaleTimeString()}
        </span>
      </div>
    </motion.div>
  );
};

export default ConsoleViewer;
