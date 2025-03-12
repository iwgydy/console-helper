
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  details?: Record<string, any>;
}

const API_URL = 'https://a79ea509-234e-46d4-b581-c846b919d7ed-00-2cnreamsix55x.pike.replit.dev/api/logs';

export const useLogData = (refreshInterval = 5000) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_URL);
      
      if (!response.ok) {
        throw new Error(`Error fetching logs: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Process and format the data
      const formattedLogs: LogEntry[] = Array.isArray(data) 
        ? data.map((log, index) => ({
            id: log.id || `log-${index}-${Date.now()}`,
            timestamp: log.timestamp || new Date().toISOString(),
            level: log.level || 'info',
            message: log.message || 'No message provided',
            details: log.details || {},
          }))
        : [];
      
      setLogs(formattedLogs);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch logs');
      toast({
        title: "Connection Error",
        description: "Unable to fetch console logs. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const refreshLogs = useCallback(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    fetchLogs();
    
    if (refreshInterval > 0) {
      const intervalId = setInterval(fetchLogs, refreshInterval);
      return () => clearInterval(intervalId);
    }
  }, [fetchLogs, refreshInterval]);

  return { logs, isLoading, error, refreshLogs };
};
