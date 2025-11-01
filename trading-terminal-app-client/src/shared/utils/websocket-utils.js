/**
 * Wait for WebSocket data to be received
 * @param {number} timeout - Timeout in seconds (default: 30)
 * @returns {Promise<Object>} - Result object with status and data
 */
export const waitForWebSocketData = async (timeout = 30) => {
  try {
    // WebSocket data not available
    console.log('WebSocket data not available');
    return {
      status: 'disabled',
      message: 'WebSocket data not available.',
      data_received: false,
    };
  } catch (error) {
    console.error('Error waiting for WebSocket data:', error);
    return {
      status: 'error',
      message: error.message,
      data_received: false,
    };
  }
};

/**
 * Get WebSocket data status
 * @returns {Promise<Object>} - Data status object
 */
export const getWebSocketDataStatus = async () => {
  try {
    // WebSocket status not available
    console.log('WebSocket status not available');
    return {
      data_received: false,
      last_data_timestamp: null,
      has_recent_data: false,
      connected: false,
      active_symbols: [],
      message: 'WebSocket integration is disabled'
    };
  } catch (error) {
    console.error('Error getting WebSocket data status:', error);
    return {
      data_received: false,
      last_data_timestamp: null,
      has_recent_data: false,
      connected: false,
      active_symbols: [],
    };
  }
};

/**
 * Check if WebSocket has received data recently
 * @param {number} withinSeconds - Time window in seconds (default: 60)
 * @returns {Promise<boolean>} - True if data received recently
 */
export const hasRecentWebSocketData = async (withinSeconds = 60) => {
  try {
    const status = await getWebSocketDataStatus();
    return status.has_recent_data;
  } catch (error) {
    console.error('Error checking recent WebSocket data:', error);
    return false;
  }
};

/**
 * Wait for WebSocket data with polling
 * @param {number} timeout - Total timeout in seconds (default: 60)
 * @param {number} pollInterval - Polling interval in seconds (default: 2)
 * @returns {Promise<Object>} - Result object
 */
export const waitForWebSocketDataWithPolling = async (timeout = 60, pollInterval = 2) => {
  // WebSocket polling not available
  console.log('WebSocket polling not available');
  return {
    status: 'disabled',
    message: 'WebSocket polling not available.',
    data_received: false,
    timestamp: new Date().toISOString(),
  };
};
