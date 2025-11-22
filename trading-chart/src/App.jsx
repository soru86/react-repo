import React, { useState, useEffect } from 'react';
import TradingChart from './components/TradingChart';
import StockSelector from './components/StockSelector';
import websocketClient from './services/websocketClient';
import './App.css';

function App() {
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize WebSocket connection
    websocketClient.connect()
      .then(() => {
        setIsConnected(true);
      })
      .catch((error) => {
        console.error('Failed to connect to WebSocket server:', error);
        setIsConnected(false);
      });

    // Monitor connection status
    const checkConnection = setInterval(() => {
      setIsConnected(websocketClient.isConnected());
    }, 1000);

    // Cleanup
    return () => {
      clearInterval(checkConnection);
      websocketClient.disconnect();
    };
  }, []);

  const handleSymbolChange = (symbol) => {
    setSelectedSymbol(symbol);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Real-Time Trading Chart</h1>
        <p className="subtitle">Live candlestick charts for stock market data</p>
        <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
          <span className="status-dot"></span>
          {isConnected ? 'WebSocket Connected' : 'WebSocket Disconnected'}
        </div>
      </header>
      
      <main className="app-main">
        <StockSelector 
          selectedSymbol={selectedSymbol} 
          onSymbolChange={handleSymbolChange} 
        />
        <TradingChart selectedSymbol={selectedSymbol} />
      </main>
      
      <footer className="app-footer">
        <p>Data is generated in real-time for demonstration purposes</p>
      </footer>
    </div>
  );
}

export default App;

