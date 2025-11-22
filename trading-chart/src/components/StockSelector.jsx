import React from 'react';
import websocketClient from '../services/websocketClient';
import './StockSelector.css';

const StockSelector = ({ selectedSymbol, onSymbolChange }) => {
  const availableSymbols = websocketClient.getAvailableSymbols();

  const handleChange = (e) => {
    onSymbolChange(e.target.value);
  };

  return (
    <div className="stock-selector">
      <label htmlFor="stock-select" className="selector-label">
        Select Stock Symbol:
      </label>
      <select
        id="stock-select"
        value={selectedSymbol || ''}
        onChange={handleChange}
        className="stock-select"
      >
        <option value="">-- Select a stock --</option>
        {availableSymbols.map((symbol) => (
          <option key={symbol} value={symbol}>
            {symbol}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StockSelector;

