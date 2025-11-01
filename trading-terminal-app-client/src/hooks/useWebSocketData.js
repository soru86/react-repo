import { useState, useEffect, useCallback } from 'react';
import { 
  waitForWebSocketData, 
  getWebSocketDataStatus, 
  hasRecentWebSocketData,
  waitForWebSocketDataWithPolling 
} from '../utils/websocket-utils';

/**
 * Hook for WebSocket data waiting functionality
 * @param {Object} options - Configuration options
 * @param {number} options.timeout - Default timeout in seconds (default: 30)
 * @param {number} options.pollInterval - Polling interval in seconds (default: 2)
 * @param {boolean} options.autoCheck - Whether to automatically check data status (default: false)
 * @returns {Object} - WebSocket data state and functions
 */
export const useWebSocketData = (options = {}) => {
  const {
    timeout = 30,
    pollInterval = 2,
    autoCheck = false
  } = options;

  const [dataStatus, setDataStatus] = useState({
    data_received: false,
    last_data_timestamp: null,
    has_recent_data: false,
    connected: false,
    active_symbols: [],
  });

  const [isWaiting, setIsWaiting] = useState(false);
  const [error, setError] = useState(null);

  // Check data status
  const checkDataStatus = useCallback(async () => {
    try {
      setError(null);
      const status = await getWebSocketDataStatus();
      setDataStatus(status);
      return status;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, []);

  // Wait for data
  const waitForData = useCallback(async (customTimeout = timeout) => {
    try {
      setIsWaiting(true);
      setError(null);
      
      const result = await waitForWebSocketData(customTimeout);
      
      if (result.status === 'success') {
        await checkDataStatus(); // Refresh status after successful wait
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      return { status: 'error', message: err.message, data_received: false };
    } finally {
      setIsWaiting(false);
    }
  }, [timeout, checkDataStatus]);

  // Wait for data with polling
  const waitForDataWithPolling = useCallback(async (customTimeout = timeout, customPollInterval = pollInterval) => {
    try {
      setIsWaiting(true);
      setError(null);
      
      const result = await waitForWebSocketDataWithPolling(customTimeout, customPollInterval);
      
      if (result.status === 'success') {
        await checkDataStatus(); // Refresh status after successful wait
      } else {
        setError(result.message);
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      return { status: 'error', message: err.message, data_received: false };
    } finally {
      setIsWaiting(false);
    }
  }, [timeout, pollInterval, checkDataStatus]);

  // Check if has recent data
  const checkRecentData = useCallback(async (withinSeconds = 60) => {
    try {
      const hasRecent = await hasRecentWebSocketData(withinSeconds);
      return hasRecent;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, []);

  // Auto-check data status if enabled
  useEffect(() => {
    if (autoCheck) {
      const interval = setInterval(checkDataStatus, 5000); // Check every 5 seconds
      return () => clearInterval(interval);
    }
  }, [autoCheck, checkDataStatus]);

  // Initial status check
  useEffect(() => {
    checkDataStatus();
  }, [checkDataStatus]);

  return {
    // State
    dataStatus,
    isWaiting,
    error,
    
    // Functions
    checkDataStatus,
    waitForData,
    waitForDataWithPolling,
    checkRecentData,
    
    // Convenience getters
    hasData: dataStatus.data_received,
    hasRecentData: dataStatus.has_recent_data,
    isConnected: dataStatus.connected,
    activeSymbols: dataStatus.active_symbols,
    lastDataTime: dataStatus.last_data_timestamp,
  };
}; 