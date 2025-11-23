/**
 * Stock Data Generator Service
 * Generates realistic real-time OHLC (Open, High, Low, Close) candlestick data
 * for 6 different stock symbols
 */

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

class StockDataGenerator {
  constructor() {
    this.subscribers = new Map();
    this.intervals = new Map();
    this.currentPrices = { ...BASE_PRICES };
    this.candleData = new Map();
    
    // Initialize candle data for each stock
    STOCK_SYMBOLS.forEach(symbol => {
      this.candleData.set(symbol, []);
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
    const lastCandle = this.candleData.get(symbol)[this.candleData.get(symbol).length - 1];
    
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

    return newCandle;
  }

  /**
   * Subscribe to real-time updates for a stock
   * @param {string} symbol - Stock symbol
   * @param {Function} callback - Callback function to receive updates
   * @returns {Function} Unsubscribe function
   */
  subscribe(symbol, callback) {
    if (!STOCK_SYMBOLS.includes(symbol)) {
      console.warn(`Unknown stock symbol: ${symbol}`);
      return () => {};
    }

    const key = `${symbol}_${Date.now()}_${Math.random()}`;
    
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, new Map());
    }

    this.subscribers.get(symbol).set(key, callback);

    // Send initial data
    const initialData = {
      type: 'initial',
      symbol,
      candles: [...this.candleData.get(symbol)]
    };
    callback(initialData);

    // Start interval if not already running
    if (!this.intervals.has(symbol)) {
      const interval = setInterval(() => {
        const newCandle = this.generateNewCandle(symbol);
        const candles = this.candleData.get(symbol);
        
        // Add new candle
        candles.push(newCandle);
        
        // Keep only last 100 candles
        if (candles.length > 100) {
          candles.shift();
        }

        // Notify all subscribers
        const subscribers = this.subscribers.get(symbol);
        if (subscribers) {
          subscribers.forEach(cb => {
            cb({
              type: 'update',
              symbol,
              candle: newCandle,
              candles: [...candles]
            });
          });
        }
      }, 1000); // Update every second for real-time feel

      this.intervals.set(symbol, interval);
    }

    // Return unsubscribe function
    return () => {
      const subscribers = this.subscribers.get(symbol);
      if (subscribers) {
        subscribers.delete(key);
        
        // Clean up interval if no more subscribers
        if (subscribers.size === 0) {
          clearInterval(this.intervals.get(symbol));
          this.intervals.delete(symbol);
        }
      }
    };
  }

  /**
   * Get available stock symbols
   */
  getAvailableSymbols() {
    return [...STOCK_SYMBOLS];
  }

  /**
   * Get current price for a symbol
   */
  getCurrentPrice(symbol) {
    return this.currentPrices[symbol] || null;
  }
}

// Export singleton instance
export default new StockDataGenerator();


