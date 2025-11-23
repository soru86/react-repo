/**
 * WebSocket Client Service
 * Connects to WebSocket server and manages real-time stock data subscriptions
 */

class WebSocketClient {
  constructor(url = 'ws://localhost:8080') {
    this.url = url;
    this.ws = null;
    this.subscribers = new Map(); // Map of symbol -> Set of callbacks
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.isConnecting = false;
    this.availableSymbols = [];
  }

  /**
   * Connect to WebSocket server
   */
  connect() {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return Promise.resolve();
    }

    this.isConnecting = true;

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            this.handleMessage(data);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.isConnecting = false;
          this.ws = null;
          
          // Attempt to reconnect if there are active subscriptions
          if (this.subscribers.size > 0 && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
            setTimeout(() => {
              this.connect().then(() => {
                // Resubscribe to all symbols
                this.subscribers.forEach((callbacks, symbol) => {
                  if (callbacks.size > 0) {
                    this.subscribe(symbol, Array.from(callbacks)[0]);
                  }
                });
              });
            }, this.reconnectDelay);
          }
        };
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  /**
   * Handle incoming WebSocket messages
   */
  handleMessage(data) {
    switch (data.type) {
      case 'symbols':
        this.availableSymbols = data.symbols || [];
        break;

      case 'initial':
      case 'update':
        const callbacks = this.subscribers.get(data.symbol);
        if (callbacks) {
          callbacks.forEach(callback => {
            callback(data);
          });
        }
        break;

      case 'error':
        console.error('WebSocket server error:', data.message);
        break;

      default:
        console.warn('Unknown message type:', data.type);
    }
  }

  /**
   * Subscribe to real-time updates for a stock
   * @param {string} symbol - Stock symbol
   * @param {Function} callback - Callback function to receive updates
   * @returns {Function} Unsubscribe function
   */
  async subscribe(symbol, callback) {
    // Ensure connection
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      await this.connect();
    }

    // Initialize subscribers map for symbol if needed
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, new Set());
    }

    // Add callback
    this.subscribers.get(symbol).add(callback);

    // Subscribe on server if this is the first subscriber for this symbol
    if (this.subscribers.get(symbol).size === 1 && this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        action: 'subscribe',
        symbol
      }));
    }

    // Return unsubscribe function
    return () => {
      this.unsubscribe(symbol, callback);
    };
  }

  /**
   * Unsubscribe from updates for a stock
   */
  unsubscribe(symbol, callback) {
    const callbacks = this.subscribers.get(symbol);
    if (callbacks) {
      callbacks.delete(callback);

      // Unsubscribe on server if no more callbacks
      if (callbacks.size === 0) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({
            action: 'unsubscribe',
            symbol
          }));
        }
        this.subscribers.delete(symbol);
      }
    }
  }

  /**
   * Get available stock symbols
   */
  getAvailableSymbols() {
    return this.availableSymbols.length > 0 
      ? this.availableSymbols 
      : ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META']; // Fallback
  }

  /**
   * Disconnect from WebSocket server
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.subscribers.clear();
  }

  /**
   * Check if connected
   */
  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }
}

// Export singleton instance
export default new WebSocketClient();


