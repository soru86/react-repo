# Real-Time Trading Chart

A fully functional real-time trading chart application built with React.js, featuring candlestick visualization for stock market data. The application uses WebSockets for real-time data streaming and includes a dropdown selector for choosing from 6 different stock symbols.

## Features

- 🕯️ **Real-time Candlestick Charts**: Live updating OHLC (Open, High, Low, Close) candlestick charts
- 📊 **6 Stock Symbols**: Support for AAPL, GOOGL, MSFT, AMZN, TSLA, and META
- 🔌 **WebSocket Integration**: Real-time bidirectional communication using WebSockets
- 🎨 **Modern UI**: Beautiful, responsive design with dark theme optimized for trading
- ⚡ **Real-time Updates**: Data updates every second via WebSocket for a realistic trading experience
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🎯 **Price Tracking**: Displays current price, change, and percentage change
- 🔄 **Auto-reconnect**: Automatic reconnection on WebSocket disconnection

## Technology Stack

- **React 18**: Modern React with hooks
- **WebSocket (ws)**: Real-time bidirectional communication protocol
- **Lightweight Charts**: TradingView's lightweight-charts library for high-performance candlestick visualization
- **Webpack**: Module bundler with hot module replacement
- **Babel**: JavaScript compiler for modern ES6+ syntax
- **Node.js**: WebSocket server for data generation and broadcasting

## Installation

1. **Clone or navigate to the project directory**:
   ```bash
   cd trading-chart
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## Running the Application

### Prerequisites

The application requires both a WebSocket server and the React client to be running simultaneously.

### Option 1: Run Both Server and Client Together (Recommended)

Start both the WebSocket server and React development server concurrently:

```bash
npm run dev:all
```

This will:
- Start the WebSocket server on `ws://localhost:8080`
- Start the React development server on `http://localhost:3000`
- Automatically open the browser

### Option 2: Run Separately

**Terminal 1 - Start WebSocket Server:**
```bash
npm run server
```

The WebSocket server will start on `ws://localhost:8080`

**Terminal 2 - Start React Client:**
```bash
npm start
```

or

```bash
npm run dev
```

The application will automatically open in your browser at `http://localhost:3000`

### Production Build

To create a production build:

```bash
npm run build
```

The optimized files will be in the `dist/` directory.

**Note**: You'll still need to run the WebSocket server separately in production:
```bash
npm run server
```

## Usage

1. **Select a Stock**: Use the dropdown menu at the top to select one of the available stock symbols:
   - AAPL (Apple)
   - GOOGL (Google)
   - MSFT (Microsoft)
   - AMZN (Amazon)
   - TSLA (Tesla)
   - META (Meta)

2. **View the Chart**: Once a stock is selected, the candlestick chart will display with:
   - Real-time price updates
   - Current price and change indicators
   - Live data indicator

3. **Switch Stocks**: Change the selected stock from the dropdown to view different charts. Each stock maintains its own independent data stream.

## How It Works

### WebSocket Architecture

The application uses a WebSocket-based architecture for real-time data streaming:

1. **WebSocket Server** (`server/websocketServer.js`):
   - Generates realistic OHLC candlestick data for each stock symbol
   - Simulates price movements with configurable volatility per stock
   - Broadcasts updates every second to all subscribed clients
   - Maintains historical data (last 100 candles) for each symbol
   - Efficiently manages subscriptions and only broadcasts when clients are subscribed

2. **WebSocket Client** (`src/services/websocketClient.js`):
   - Connects to the WebSocket server on application start
   - Manages subscriptions/unsubscriptions for different stock symbols
   - Handles automatic reconnection on disconnection
   - Distributes received data to React components via callbacks

3. **React Components**:
   - Subscribe to stock data via WebSocket client
   - Receive real-time updates and render candlestick charts
   - Display connection status and price information

### Chart Rendering

- Uses TradingView's `lightweight-charts` library for high-performance rendering
- Implements proper cleanup and memory management
- Responsive design that adapts to container size
- Color-coded candles (green for up, red for down)
- Real-time updates via WebSocket messages

## Project Structure

```
trading-chart/
├── public/
│   └── index.html          # HTML template
├── server/
│   └── websocketServer.js  # WebSocket server for real-time data
├── src/
│   ├── components/
│   │   ├── TradingChart.jsx    # Main chart component
│   │   ├── TradingChart.css     # Chart styles
│   │   ├── StockSelector.jsx    # Dropdown selector
│   │   └── StockSelector.css    # Selector styles
│   ├── services/
│   │   ├── websocketClient.js   # WebSocket client service
│   │   └── stockDataGenerator.js  # Legacy data generator (deprecated)
│   ├── App.jsx              # Main app component
│   ├── App.css             # App styles
│   └── index.js            # Entry point
├── package.json            # Dependencies and scripts
├── webpack.config.js       # Webpack configuration
└── README.md               # This file
```

## Customization

### Adding More Stock Symbols

Edit `server/websocketServer.js`:

1. Add the symbol to `STOCK_SYMBOLS` array
2. Add a base price to `BASE_PRICES` object
3. Add volatility factor to `VOLATILITY` object

### Adjusting Update Frequency

In `server/websocketServer.js`, modify the interval in the `startBroadcasting` method:

```javascript
setInterval(() => {
  // ...
}, 1000); // Change 1000 to desired milliseconds
```

### Changing WebSocket Port

To change the WebSocket server port, edit `server/websocketServer.js`:

```javascript
const server = new StockDataServer(8080); // Change port number
```

And update the client URL in `src/services/websocketClient.js`:

```javascript
constructor(url = 'ws://localhost:8080') { // Update port number
```

### Changing Chart Colors

Edit `src/components/TradingChart.jsx`:

```javascript
const candlestickSeries = chart.addCandlestickSeries({
  upColor: '#26a69a',      // Green for up candles
  downColor: '#ef5350',    // Red for down candles
  // ...
});
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## WebSocket Protocol

The WebSocket server uses a simple JSON message protocol:

### Client → Server Messages

**Subscribe to a stock:**
```json
{
  "action": "subscribe",
  "symbol": "AAPL"
}
```

**Unsubscribe from a stock:**
```json
{
  "action": "unsubscribe",
  "symbol": "AAPL"
}
```

### Server → Client Messages

**Initial data:**
```json
{
  "type": "initial",
  "symbol": "AAPL",
  "candles": [...]
}
```

**Update:**
```json
{
  "type": "update",
  "symbol": "AAPL",
  "candle": {...},
  "candles": [...]
}
```

**Available symbols:**
```json
{
  "type": "symbols",
  "symbols": ["AAPL", "GOOGL", ...]
}
```

**Error:**
```json
{
  "type": "error",
  "message": "Error description"
}
```

## Notes

- This application uses **simulated data** for demonstration purposes
- For production use with real market data, integrate with a live stock data API
- The WebSocket server generates realistic price movements but is not connected to actual market data
- The WebSocket server automatically stops broadcasting for symbols with no active subscribers to save resources
- Connection status is displayed in the header - ensure the WebSocket server is running before using the application

## License

MIT

## Contributing

Feel free to submit issues and enhancement requests!

