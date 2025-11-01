import { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { BACKEND_BASE_URL } from '../shared/config/api';
import { intervalMap } from '../data/constants';
import { useSocketContext } from '../shared/context/WebsocketProvider';

// Function to get default symbol based on context
const getDefaultSymbol = (context) => {
  // If we're in Indian market context, use RELIANCE
  if (context?.includes('indian')) {
    return 'RELIANCE';
  }
  // For crypto context, use BTCUSDT
  if (context?.includes('crypto')) {
    return 'BTCUSDT';
  }
  // For forex context, use EURUSD
  if (context?.includes('forex')) {
    return 'EURUSD';
  }
  // Default to BTCUSDT for backward compatibility
  return 'BTCUSDT';
};

// Simple moving average
const calculateSMA = (data, period = 14) => {
  if (!data || data.length < period) return [];
  let sma = [];
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      sma.push({ time: data[i].time, value: null });
    } else {
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j].close;
      }
      sma.push({ time: data[i].time, value: sum / period });
    }
  }
  return sma;
}

// Exponential moving average
const calculateEMA = (data, period = 14) => {
  if (!data || data.length < period) return [];
  let ema = [];
  let k = 2 / (period + 1);
  let prev;
  for (let i = 0; i < data.length; i++) {
    if (i < period - 1) {
      ema.push({ time: data[i].time, value: null });
    } else if (i === period - 1) {
      // SMA for first EMA value
      let sum = 0;
      for (let j = 0; j < period; j++) {
        sum += data[i - j].close;
      }
      prev = sum / period;
      ema.push({ time: data[i].time, value: prev });
    } else {
      prev = data[i].close * k + prev * (1 - k);
      ema.push({ time: data[i].time, value: prev });
    }
  }
  return ema;
}

const TradingChart = ({
  height = 400,
  selectedSymbol = null,
  indicator = 'none',
  selectedInterval = '1h',
  marketContext = null
}) => {
  // Use market-specific default if no symbol is provided
  const symbol = selectedSymbol || getDefaultSymbol(marketContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartId] = useState(() => Math.random().toString(36).substr(2, 9));
  const [records, setRecords] = useState([]);

  const isDestroyedRef = useRef(false);
  const chartContainerRef = useRef();
  const chart = useRef();
  const candlestickSeries = useRef();
  const volumeSeries = useRef();
  const { socket } = useSocketContext();

  const getApiEndpoint = (symbol, interval) => {
    const apiInterval = intervalMap[interval] || interval;
    return `${BACKEND_BASE_URL}/indian-market?symbol=${symbol}&interval=${apiInterval}`;
  };

  // Cleanup function
  const cleanupChart = () => {
    if (chart.current && !isDestroyedRef.current) {
      console.log(`TradingChart [${chartId}] cleaning up chart`);
      isDestroyedRef.current = true;
      try {
        chart.current.remove();
      } catch (e) {
        console.warn(`TradingChart [${chartId}] error during chart cleanup:`, e);
      }
      chart.current = null;
    }
  };

  const handleResize = () => {
    if (chartContainerRef?.current && chart?.current && !isDestroyedRef?.current) {
      const newHeight = typeof height === 'string' && height.includes('%')
        ? chartContainerRef?.current?.clientHeight
        : (typeof height === 'number' ? height : 400);

      chart.current.applyOptions({
        width: chartContainerRef?.current?.clientWidth,
        height: newHeight,
      });
    }
  };

  //////////////////////////////////////////////////////

  useEffect(() => {
    console.log(`TradingChart [${chartId}] mounted...`);

    if (!symbol) {
      setError('No symbol selected');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    // Clean up previous chart if any
    cleanupChart();

    socket?.on('new_record', (record) => {
      // Append each incoming record
      console.log('new_record received: ', record);
      setRecords(() => [...records, record]);
    });

    // Create chart only if container exists
    if (!chartContainerRef?.current) {
      console.error(`TradingChart [${chartId}] chart container not found`);
    }

    // Double-check if component was destroyed
    if (isDestroyedRef?.current) {
      console.log(`TradingChart [${chartId}] component destroyed before chart creation, aborting`);
    }

    console.log(`TradingChart [${chartId}] creating new chart instance`);

    // Calculate actual height - handle percentage or pixel values
    const actualHeight = typeof height === 'string' && height.includes('%')
      ? chartContainerRef?.current?.clientHeight
      : (typeof height === 'number' ? height : 400);

    chart.current = createChart(chartContainerRef?.current, {
      layout: {
        background: { color: '#1e293b' },
        textColor: '#94a3b8',
      },
      grid: {
        vertLines: { color: '#334155' },
        horzLines: { color: '#334155' },
      },
      width: chartContainerRef?.current?.clientWidth,
      height: actualHeight,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        visible: true,
        borderVisible: false,
        scaleMargins: {
          top: 0.1,
          bottom: 0.2,
        },
      },
    });

    // Add candlestick series
    candlestickSeries.current = chart?.current?.addCandlestickSeries({
      upColor: '#10b981',
      downColor: '#ef4444',
      borderVisible: false,
      wickUpColor: '#10b981',
      wickDownColor: '#ef4444',
      priceFormat: {
        type: 'price',
        precision: 5,
        minMove: 0.00001,
      },
    });

    candlestickSeries?.current?.priceScale()?.applyOptions({
      scaleMargins: {
        top: 0.1,
        bottom: 0.15,
      },
    });

    candlestickSeries?.current?.setData(records);

    // Add volume series
    volumeSeries.current = chart?.current?.addHistogramSeries({
      color: '#3b82f6',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
      scaleMargins: {
        top: 0.9,
        bottom: 0,
      },
      baseLineVisible: false,
    });

    volumeSeries?.current?.priceScale()?.applyOptions({
      scaleMargins: {
        top: 0.9,
        bottom: 0,
      },
    });

    volumeSeries?.current?.setData([]);

    // Fit content and handle resize
    chart?.current?.timeScale()?.fitContent();
    window.addEventListener('resize', handleResize);

    // Add ResizeObserver for container size changes
    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    if (chartContainerRef?.current) {
      resizeObserver?.observe(chartContainerRef.current);
    }

    setLoading(false);
    setError(null);

    console.log(`TradingChart [${chartId}] chart created successfully`);

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver?.disconnect();

      if (chart?.current && !isDestroyedRef?.current) {
        console.log(`TradingChart [${chartId}] cleaning up chart in useEffect return`);
        try {
          chart.current.remove();
        } catch (e) {
          console.warn(`TradingChart [${chartId}] error during chart cleanup in return:`, e);
        }
      }
      cleanupChart();
    };
  }, [socket, chartContainerRef]);

  useEffect(() => {
    // Add indicator overlay
    let indicatorSeries = null;
    if (indicator === 'sma') {
      const sma = calculateSMA(records, 14).filter(d => !!d.value);
      indicatorSeries = chart.current.addLineSeries({
        color: '#fbbf24',
        lineWidth: 2,
        priceLineVisible: false,
        title: 'SMA (14)',
      });
      indicatorSeries.setData(sma);
    } else if (indicator === 'ema') {
      const ema = calculateEMA(records, 14).filter(d => !!d.value);
      indicatorSeries = chart.current.addLineSeries({
        color: '#3b82f6',
        lineWidth: 2,
        priceLineVisible: false,
        title: 'EMA (14)',
      });
      indicatorSeries.setData(ema);
    }
  }, [indicator, records]);

  useEffect(() => {
    try {
      if (!symbol) {
        setError('No symbol selected');
        setLoading(false);
        return;
      }

      candlestickSeries.current.update(records[records.length - 1]);

      chart.current.timeScale().fitContent();
      chart.current.timeScale().scrollToPosition(5);
    } catch (error) {
      setError(error.message || 'Failed to load chart data');
      setLoading(false);
    }
  }, [symbol, chartId, records]);

  useEffect(() => {
    const fetchData = async () => {
      await fetch(getApiEndpoint(symbol, selectedInterval), {
        mode: 'cors'
      });
    };
    fetchData();
  }, [symbol, selectedInterval])

  //////////////////////////////////////////////////////

  if (error) {
    return (
      <div style={{
        width: '100%',
        height: typeof height === 'string' && height.includes('%') ? height : `${height}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ef4444',
        background: 'rgba(239, 68, 68, 0.1)',
        borderRadius: '8px',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        minHeight: '300px'
      }}>
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Chart Error</div>
          <div style={{ fontSize: '14px', opacity: 0.8 }}>{error}</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        color: '#94a3b8',
        fontSize: '16px',
        fontWeight: '500'
      }}>
        Loading chart...
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: typeof height === 'string' && height.includes('%') ? height : `${height}px`,
        position: 'relative',
        background: '#1e293b',
        borderRadius: '8px',
        minHeight: '200px'
      }}
      ref={chartContainerRef}
    />

  );
};

export default TradingChart;