# Algorithmic Trading Components

This directory contains React components for the algorithmic trading interface, providing a comprehensive UI for deploying, monitoring, and managing automated trading strategies.

## Components Overview

### 1. StrategyCard.jsx
A reusable card component for displaying individual trading strategies with:
- **Status Indicators**: Visual status (running, stopped, starting) with color-coded badges
- **Performance Metrics**: PnL, win rate, total trades, and drawdown information
- **Resource Usage**: Memory and CPU usage display
- **Action Buttons**: Start, stop, and restart functionality
- **Uptime Display**: Strategy uptime information

**Props:**
- `strategy`: Strategy object with performance and status data
- `onRestart`: Function to restart the strategy
- `onStop`: Function to stop the strategy

### 2. DeployStrategyModal.jsx
A comprehensive modal for deploying new trading strategies with:
- **Strategy Selection**: Dropdown with available strategy types (Moving Average, RSI, MACD, Bollinger Bands)
- **Parameter Configuration**: Dynamic form fields based on selected strategy type
- **Risk Management**: Stop loss, take profit, position size, and daily loss limits
- **Exchange Selection**: Support for multiple exchanges (Binance, Coinbase, Kraken, KuCoin)
- **Symbol Configuration**: Multi-symbol trading support
- **Real-time Validation**: Form validation and error handling

**Props:**
- `isOpen`: Boolean to control modal visibility
- `onClose`: Function to close the modal
- `onDeploy`: Function to deploy the strategy
- `loading`: Boolean for loading state
- `error`: Error message string

### 3. PerformanceMetrics.jsx
A dashboard component for displaying system-wide performance metrics:
- **System Overview**: Total strategies, running containers, memory/CPU usage
- **Strategy Performance**: Individual strategy PnL, win rates, and trade counts
- **System Health**: Healthy, warning, and failed container counts
- **Resource Monitoring**: Memory and CPU usage with progress bars
- **Performance Visualization**: Color-coded performance indicators

**Props:**
- `metrics`: Performance metrics object
- `isDarkMode`: Boolean for theme support

## Strategy Types Supported

### 1. Moving Average Crossover
- **Parameters**: Fast period, slow period, trend strength, volume threshold
- **Description**: Generates signals based on moving average crossovers
- **Ideal For**: Trend-following strategies

### 2. RSI Strategy
- **Parameters**: RSI period, oversold/overbought levels, momentum threshold
- **Description**: Uses Relative Strength Index for entry/exit signals
- **Ideal For**: Mean reversion strategies

### 3. MACD Strategy
- **Parameters**: Fast/slow periods, signal period, histogram threshold
- **Description**: Moving Average Convergence Divergence based signals
- **Ideal For**: Momentum and trend analysis

### 4. Bollinger Bands Strategy
- **Parameters**: Period, standard deviation, squeeze/volatility thresholds
- **Description**: Bollinger Bands with squeeze detection
- **Ideal For**: Volatility-based trading

## Features

### 🎯 **Strategy Deployment**
- One-click strategy deployment
- Parameter validation and range checking
- Risk management configuration
- Multi-exchange support

### 📊 **Real-time Monitoring**
- Live performance metrics
- Resource usage tracking
- Strategy status monitoring
- Health check indicators

### 🔧 **Management Controls**
- Start/stop/restart strategies
- Individual strategy monitoring
- Performance analytics
- Error handling and recovery

### 🎨 **User Experience**
- Dark/light theme support
- Responsive design
- Intuitive interface
- Loading states and feedback

## Usage Example

```jsx
import AlgoTrading from '../pages/AlgoTrading';

// In your app routing
<Route path="/algo-trading" element={<AlgoTrading />} />
```

## API Integration

The components integrate with the backend algorithmic trading API:

- `GET /api/algo/strategies` - Fetch all strategies
- `POST /api/algo/strategies` - Deploy new strategy
- `POST /api/algo/strategies/{name}/restart` - Restart strategy
- `POST /api/algo/strategies/{name}/stop` - Stop strategy
- `GET /api/algo/performance` - Get performance metrics

## Styling

Components use Tailwind CSS with:
- Responsive grid layouts
- Dark mode support
- Smooth transitions
- Consistent spacing
- Color-coded status indicators

## Error Handling

- Network error handling
- Form validation
- Loading states
- User feedback
- Graceful degradation

## Future Enhancements

- Strategy backtesting interface
- Advanced parameter optimization
- Strategy performance charts
- Real-time signal notifications
- Strategy templates marketplace
- Multi-timeframe support
- Advanced risk management tools 