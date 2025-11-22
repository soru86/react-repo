import React, { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import websocketClient from '../services/websocketClient';
import './TradingChart.css';

const TradingChart = ({ selectedSymbol }) => {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candlestickSeriesRef = useRef(null);
  const previousPriceRef = useRef(null);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceChange, setPriceChange] = useState({ value: 0, percent: 0, isPositive: true });

  useEffect(() => {
    if (!chartContainerRef.current || !selectedSymbol) {
      setCurrentPrice(null);
      setPriceChange({ value: 0, percent: 0, isPositive: true });
      return;
    }

    // Reset previous price when symbol changes
    previousPriceRef.current = null;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#1a1a1a' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: '#2a2a2a' },
        horzLines: { color: '#2a2a2a' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 600,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: '#485056',
      },
      rightPriceScale: {
        borderColor: '#485056',
      },
    });

    chartRef.current = chart;

    // Create candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    candlestickSeriesRef.current = candlestickSeries;

    // Subscribe to stock data via WebSocket
    let unsubscribe = null;
    
    const subscribeToStock = async () => {
      unsubscribe = await websocketClient.subscribe(selectedSymbol, (data) => {
        if (data.type === 'initial') {
          // Set initial data
          candlestickSeries.setData(data.candles);
          if (data.candles.length > 0) {
            const lastCandle = data.candles[data.candles.length - 1];
            const price = lastCandle.close;
            setCurrentPrice(price);
            previousPriceRef.current = price;
            setPriceChange({ value: 0, percent: 0, isPositive: true });
          }
        } else if (data.type === 'update') {
          // Update with new candle
          candlestickSeries.update(data.candle);
          
          // Update price info
          const newPrice = data.candle.close;
          const previousPrice = previousPriceRef.current || data.candle.open;
          const change = newPrice - previousPrice;
          const changePercent = (change / previousPrice) * 100;
          
          setCurrentPrice(newPrice);
          setPriceChange({
            value: change,
            percent: changePercent,
            isPositive: change >= 0,
          });
          previousPriceRef.current = newPrice;
        }
      });
    };

    subscribeToStock();

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      window.removeEventListener('resize', handleResize);
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [selectedSymbol]);

  if (!selectedSymbol) {
    return (
      <div className="chart-container">
        <div className="chart-placeholder">
          <p>Please select a stock symbol from the dropdown</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart-container">
      <div className="chart-header">
        <div className="stock-info">
          <h2 className="stock-symbol">{selectedSymbol}</h2>
          <div className="price-info">
            <span className={`current-price ${priceChange.isPositive ? 'positive' : 'negative'}`}>
              ${currentPrice?.toFixed(2) || '--'}
            </span>
            <span className={`price-change ${priceChange.isPositive ? 'positive' : 'negative'}`}>
              {priceChange.isPositive ? '+' : ''}{priceChange.value.toFixed(2)} 
              ({priceChange.isPositive ? '+' : ''}{priceChange.percent.toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="chart-controls">
          <span className="live-indicator">
            <span className="live-dot"></span>
            LIVE
          </span>
        </div>
      </div>
      <div ref={chartContainerRef} className="chart-wrapper"></div>
    </div>
  );
};

export default TradingChart;

