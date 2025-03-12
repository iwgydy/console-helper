
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { LogEntry } from '@/utils/api';
import { cn } from '@/lib/utils';

interface LogItemProps {
  log: LogEntry;
  index: number;
}

export const LogItem = ({ log, index }: LogItemProps) => {
  const [expanded, setExpanded] = useState(false);
  
  const logLevelColors = {
    info: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20',
    warning: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20',
    error: 'text-red-500 bg-red-50 dark:bg-red-900/20',
    debug: 'text-gray-500 bg-gray-50 dark:bg-gray-800/40',
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString() + ' ' + date.toLocaleDateString();
    } catch (e) {
      return timestamp;
    }
  };

  const hasDetails = log.details && Object.keys(log.details).length > 0;
  
  return (
    <motion.div 
      className="log-item bg-white/10 dark:bg-black/10 border border-gray-100 dark:border-gray-800"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div 
        className={cn(
          "flex items-start cursor-pointer",
          hasDetails ? "space-x-3" : "space-x-2"
        )}
        onClick={() => hasDetails && setExpanded(!expanded)}
      >
        {hasDetails && (
          <div className="mt-1">
            {expanded ? (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronRight className="h-4 w-4 text-gray-400" />
            )}
          </div>
        )}
        
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <span 
              className={cn(
                "px-2 py-0.5 text-xs font-medium rounded-full mr-2",
                logLevelColors[log.level]
              )}
            >
              {log.level.toUpperCase()}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTimestamp(log.timestamp)}
            </span>
          </div>
          
          <div className="console-text">
            {log.message}
          </div>
          
          {expanded && hasDetails && (
            <motion.div 
              className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 rounded bg-gray-50 dark:bg-gray-900/50 p-3 overflow-x-auto"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <pre className="console-text text-xs whitespace-pre-wrap">
                {JSON.stringify(log.details, null, 2)}
              </pre>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default LogItem;
