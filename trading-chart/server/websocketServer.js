/**
 * WebSocket Server for Real-Time Stock Data
 * Generates and broadcasts candlestick data for 6 stock symbols
 */

const WebSocket = require('ws');

const STOCK_SYMBOLS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META'];

// Base prices for each stock (starting prices)
const BASE_PRICES = {
  AAPL: 175.50,
  GOOGL: 142.30,
  MSFT: 378.90,
  AMZN: 145.20,
  TSLA: 248.50,
  META: 320.75
};

// Volatility factors for each stock (higher = more volatile)
const VOLATILITY = {
  AAPL: 0.02,
  GOOGL: 0.025,
  MSFT: 0.018,
  AMZN: 0.03,
  TSLA: 0.05,
  META: 0.035
};

class StockDataServer {
  constructor(port = 8080) {
    this.port = port;
    this.wss = null;
    this.currentPrices = { ...BASE_PRICES };
    this.candleData = new Map();
    this.intervals = new Map();
    this.subscribedClients = new Map(); // Map of symbol -> Set of WebSocket clients
    
    // Initialize candle data for each stock
    STOCK_SYMBOLS.forEach(symbol => {
      this.candleData.set(symbol, []);
      this.subscribedClients.set(symbol, new Set());
      this.generateInitialCandles(symbol);
    });
  }

  /**
   * Generate initial set of candles for a stock
   */
  generateInitialCandles(symbol, count = 50) {
    const candles = [];
    const basePrice = BASE_PRICES[symbol];
    const volatility = VOLATILITY[symbol];
    let currentPrice = basePrice;
    const now = new Date();

    for (let i = count - 1; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60000); // 1 minute intervals
      
      // Generate realistic OHLC data
      const change = (Math.random() - 0.5) * 2 * volatility * currentPrice;
      const open = currentPrice;
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * volatility * currentPrice * 0.5;
      const low = Math.min(open, close) - Math.random() * volatility * currentPrice * 0.5;
      
      const candle = {
        time: Math.floor(timestamp.getTime() / 1000), // Unix timestamp in seconds
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume: Math.floor(Math.random() * 1000000) + 100000
      };

      candles.push(candle);
      currentPrice = close;
    }

    this.candleData.set(symbol, candles);
    this.currentPrices[symbol] = currentPrice;
  }

  /**
   * Generate a new candle for a stock
   */
  generateNewCandle(symbol) {
    const currentPrice = this.currentPrices[symbol];
    const volatility = VOLATILITY[symbol];
    const candles = this.candleData.get(symbol);
    const lastCandle = candles[candles.length - 1];
    
    // Use last close as new open
    const open = lastCandle ? lastCandle.close : currentPrice;
    
    // Generate price change
    const change = (Math.random() - 0.5) * 2 * volatility * open;
    const close = open + change;
    const high = Math.max(open, close) + Math.random() * volatility * open * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * open * 0.5;
    
    const newCandle = {
      time: Math.floor(Date.now() / 1000),
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      volume: Math.floor(Math.random() * 1000000) + 100000
    };

    // Update current price
    this.currentPrices[symbol] = close;

    // Add new candle
    candles.push(newCandle);
    
    // Keep only last 100 candles
    if (candles.length > 100) {
      candles.shift();
    }

    return newCandle;
  }

  /**
   * Start broadcasting updates for a symbol
   */
  startBroadcasting(symbol) {
    if (this.intervals.has(symbol)) {
      return; // Already broadcasting
    }

    const interval = setInterval(() => {
      const newCandle = this.generateNewCandle(symbol);
      const candles = this.candleData.get(symbol);
      
      // Broadcast to all subscribed clients
      const clients = this.subscribedClients.get(symbol);
      const message = JSON.stringify({
        type: 'update',
        symbol,
        candle: newCandle,
        candles: [...candles]
      });

      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    }, 1000); // Update every second

    this.intervals.set(symbol, interval);
  }

  /**
   * Stop broadcasting updates for a symbol if no clients are subscribed
   */
  stopBroadcasting(symbol) {
    const clients = this.subscribedClients.get(symbol);
    if (clients && clients.size === 0 && this.intervals.has(symbol)) {
      clearInterval(this.intervals.get(symbol));
      this.intervals.delete(symbol);
    }
  }

  /**
   * Handle client subscription
   */
  subscribeClient(client, symbol) {
    if (!STOCK_SYMBOLS.includes(symbol)) {
      client.send(JSON.stringify({
        type: 'error',
        message: `Unknown stock symbol: ${symbol}`
      }));
      return;
    }

    // Add client to subscription list
    this.subscribedClients.get(symbol).add(client);

    // Send initial data
    const candles = this.candleData.get(symbol);
    client.send(JSON.stringify({
      type: 'initial',
      symbol,
      candles: [...candles]
    }));

    // Start broadcasting if not already started
    this.startBroadcasting(symbol);
  }

  /**
   * Handle client unsubscription
   */
  unsubscribeClient(client, symbol) {
    const clients = this.subscribedClients.get(symbol);
    if (clients) {
      clients.delete(client);
      this.stopBroadcasting(symbol);
    }
  }

  /**
   * Handle client disconnect
   */
  handleDisconnect(client) {
    // Remove client from all subscriptions
    STOCK_SYMBOLS.forEach(symbol => {
      this.unsubscribeClient(client, symbol);
    });
  }

  /**
   * Start the WebSocket server
   */
  start() {
    this.wss = new WebSocket.Server({ port: this.port });

    this.wss.on('connection', (ws, req) => {
      console.log(`New client connected from ${req.socket.remoteAddress}`);
      
      // Send available symbols
      ws.send(JSON.stringify({
        type: 'symbols',
        symbols: STOCK_SYMBOLS
      }));

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message.toString());
          
          switch (data.action) {
            case 'subscribe':
              this.subscribeClient(ws, data.symbol);
              console.log(`Client subscribed to ${data.symbol}`);
              break;
              
            case 'unsubscribe':
              this.unsubscribeClient(ws, data.symbol);
              console.log(`Client unsubscribed from ${data.symbol}`);
              break;
              
            default:
              ws.send(JSON.stringify({
                type: 'error',
                message: 'Unknown action'
              }));
          }
        } catch (error) {
          console.error('Error parsing message:', error);
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Invalid message format'
          }));
        }
      });

      ws.on('close', () => {
        console.log('Client disconnected');
        this.handleDisconnect(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.handleDisconnect(ws);
      });
    });

    console.log(`WebSocket server started on ws://localhost:${this.port}`);
  }

  /**
   * Stop the WebSocket server
   */
  stop() {
    // Clear all intervals
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();

    // Close all connections
    if (this.wss) {
      this.wss.close();
    }
  }
}

// Start server if run directly
if (require.main === module) {
  const server = new StockDataServer(8080);
  server.start();

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\nShutting down WebSocket server...');
    server.stop();
    process.exit(0);
  });
}

module.exports = StockDataServer;

