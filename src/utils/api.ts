
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
  details?: Record<string, any>;
}

const API_URL = 'https://a79ea509-234e-46d4-b581-c846b919d7ed-00-2cnreamsix55x.pike.replit.dev/api/logs';

// Mock data to use when API is unavailable
const MOCK_LOGS: LogEntry[] = [
  {
    id: 'mock-1',
    timestamp: new Date().toISOString(),
    level: 'info',
    message: 'Application started successfully',
    details: { version: '1.0.0', environment: 'development' }
  },
  {
    id: 'mock-2',
    timestamp: new Date(Date.now() - 60000).toISOString(),
    level: 'warning',
    message: 'API connection issues detected',
    details: { retries: 3, status: 'degraded' }
  },
  {
    id: 'mock-3',
    timestamp: new Date(Date.now() - 120000).toISOString(),
    level: 'error',
    message: 'Failed to fetch external resources',
    details: { resource: 'external-api', reason: 'connection timeout' }
  },
  {
    id: 'mock-4',
    timestamp: new Date(Date.now() - 180000).toISOString(),
    level: 'debug',
    message: 'User authentication attempt',
    details: { userId: 'user-123', success: true, method: 'oauth' }
  }
];

// Flag to control whether to use mock data instead of real API
const USE_MOCK_DATA = true;

export const useLogData = (refreshInterval = 5000) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchLogs = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // If we're using mock data, simulate API delay and return mock data
      if (USE_MOCK_DATA) {
        console.log('Using mock data instead of API call');
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setLogs(MOCK_LOGS);
        setError(null);
        return;
      }
      
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
      
      // Only show toast for real API failures, not when using mock data
      if (!USE_MOCK_DATA) {
        toast({
          title: "Connection Error",
          description: "Unable to fetch console logs. Please try again later.",
          variant: "destructive",
        });
      }
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
