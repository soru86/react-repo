import { useEffect, useRef, useState, useCallback } from "react";
import { createChart } from "lightweight-charts";
import { BACKEND_BASE_URL } from '../shared/config/api';
import { intervalMap } from '../data/constants';
import { useSocketContext } from "../shared/context/WebsocketProvider";

const getDefaultSymbol = (context) => {
    if (context?.includes('indian')) {
        return 'RELIANCE';
    }
    if (context?.includes('crypto')) {
        return 'BTCUSDT';
    }
    if (context?.includes('forex')) {
        return 'EURUSD';
    }
    return 'BTCUSDT';
};

// Convert API data to lightweight-charts format
const transformData = (data) => {
    if (!Array.isArray(data)) return [];
    
    return data.map(item => ({
        time: typeof item.time === 'string' 
            ? (new Date(item.time).getTime() / 1000) 
            : (typeof item.time === 'number' && item.time > 10000000000 
                ? Math.floor(item.time / 1000) 
                : item.time),
        open: parseFloat(item.open) || 0,
        high: parseFloat(item.high) || 0,
        low: parseFloat(item.low) || 0,
        close: parseFloat(item.close) || 0,
        volume: parseFloat(item.volume) || 0,
    })).filter(item => item.time && item.open && item.high && item.low && item.close);
};

// Convert volume data for histogram
const transformVolumeData = (data) => {
    if (!Array.isArray(data)) return [];
    
    return data.map(item => ({
        time: typeof item.time === 'string' 
            ? (new Date(item.time).getTime() / 1000) 
            : (typeof item.time === 'number' && item.time > 10000000000 
                ? Math.floor(item.time / 1000) 
                : item.time),
        value: parseFloat(item.volume) || 0,
        color: parseFloat(item.close) >= parseFloat(item.open) ? '#10b981' : '#ef4444',
    })).filter(item => item.time && item.value);
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
};

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
};

const getApiEndpoint = (symbol, interval, marketContext) => {
    const apiInterval = intervalMap[interval] || interval;
    
    if (marketContext === 'indian' || marketContext?.includes('indian')) {
        return `${BACKEND_BASE_URL}/indian-market?symbol=${symbol}&interval=${apiInterval}`;
    } else if (marketContext === 'crypto' || marketContext?.includes('crypto')) {
        return `${BACKEND_BASE_URL}/crypto-market/binance/data?symbol=${symbol}&interval=${apiInterval}&start=30 days ago UTC`;
    } else if (marketContext === 'forex' || marketContext?.includes('forex')) {
        return `${BACKEND_BASE_URL}/forex-market/data?symbol=${symbol}&interval=${apiInterval}`;
    }
    return `${BACKEND_BASE_URL}/indian-market?symbol=${symbol}&interval=${apiInterval}`;
};

const cleanupChart = (chartRef, isDestroyedRef) => {
    if (chartRef.current && !isDestroyedRef.current) {
        isDestroyedRef.current = true;
        try {
            chartRef.current.remove();
        } catch (e) {
            console.warn('Error during chart cleanup:', e);
        }
        chartRef.current = null;
    }
};

const TradingChart = ({
    height = 400,
    selectedSymbol = null,
    indicator = 'none',
    selectedInterval = '1h',
    marketContext = null
}) => {
    const symbol = selectedSymbol || getDefaultSymbol(marketContext);
    const [records, setRecords] = useState([]);
    const [volumeData, setVolumeData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartId] = useState(() => Math.random().toString(36).substr(2, 9));
    const chartContainerRef = useRef();
    const isDestroyedRef = useRef(false);
    const chart = useRef();
    const candlestickSeries = useRef();
    const volumeSeries = useRef();
    const indicatorSeriesRef = useRef(null);
    const { socket } = useSocketContext();

    // Fetch chart data
    const fetchChartData = useCallback(async () => {
        if (!symbol) {
            setError('No symbol selected');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const endpoint = getApiEndpoint(symbol, selectedInterval, marketContext);
            const response = await fetch(endpoint, {
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch data: ${response.status}`);
            }

            const data = await response.json();
            
            // Handle different response formats
            const chartData = Array.isArray(data) ? data : (data.data || data.candles || []);
            
            const transformed = transformData(chartData);
            const transformedVolume = transformVolumeData(chartData);

            if (transformed.length === 0) {
                throw new Error('No data available for this symbol');
            }

            // Sort by time
            transformed.sort((a, b) => a.time - b.time);
            transformedVolume.sort((a, b) => a.time - b.time);

            setRecords(transformed);
            setVolumeData(transformedVolume);

            // Update chart if it exists
            if (candlestickSeries.current && transformed.length > 0) {
                candlestickSeries.current.setData(transformed);
            }
            if (volumeSeries.current && transformedVolume.length > 0) {
                volumeSeries.current.setData(transformedVolume);
            }
            if (chart.current) {
                chart.current.timeScale().fitContent();
            }

            setLoading(false);
        } catch (err) {
            console.error('Error fetching chart data:', err);
            setError(err.message || 'Failed to load chart data');
            setLoading(false);
        }
    }, [symbol, selectedInterval, marketContext]);

    // Handle resize
    const handleResize = useCallback(() => {
        if (chartContainerRef?.current && chart?.current && !isDestroyedRef?.current) {
            const newHeight = typeof height === 'string' && height.includes('%')
                ? chartContainerRef?.current?.clientHeight
                : (typeof height === 'number' ? height : 400);

            chart.current.applyOptions({
                width: chartContainerRef?.current?.clientWidth,
                height: newHeight,
            });
        }
    }, [height]);

    // Initialize chart
    useEffect(() => {
        if (!symbol || !chartContainerRef?.current) {
            return;
        }

        setLoading(true);
        setError(null);
        isDestroyedRef.current = false;

        // Calculate actual height
        const actualHeight = typeof height === 'string' && height.includes('%')
            ? chartContainerRef?.current?.clientHeight
            : (typeof height === 'number' ? height : 400);

        // Create chart
        chart.current = createChart(chartContainerRef.current, {
            layout: {
                background: { color: '#1e293b' },
                textColor: '#94a3b8',
            },
            grid: {
                vertLines: { color: '#334155' },
                horzLines: { color: '#334155' },
            },
            width: chartContainerRef.current.clientWidth,
            height: actualHeight,
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
                borderColor: '#334155',
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
        candlestickSeries.current = chart.current.addCandlestickSeries({
            upColor: '#10b981',
            downColor: '#ef4444',
            borderVisible: false,
            wickUpColor: '#10b981',
            wickDownColor: '#ef4444',
            priceFormat: {
                type: 'price',
                precision: 2,
                minMove: 0.01,
            },
        });

        candlestickSeries.current.priceScale().applyOptions({
            scaleMargins: {
                top: 0.1,
                bottom: 0.15,
            },
        });

        // Add volume series
        volumeSeries.current = chart.current.addHistogramSeries({
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

        volumeSeries.current.priceScale().applyOptions({
            scaleMargins: {
                top: 0.9,
                bottom: 0,
            },
        });

        // Handle resize
        window.addEventListener('resize', handleResize);
        const resizeObserver = new ResizeObserver(() => {
            handleResize();
        });

        if (chartContainerRef.current) {
            resizeObserver.observe(chartContainerRef.current);
        }

        // Fetch initial data
        fetchChartData();

        return () => {
            window.removeEventListener('resize', handleResize);
            resizeObserver.disconnect();
            cleanupChart(chart, isDestroyedRef);
        };
    }, [symbol, height, handleResize, fetchChartData]);

    // Handle WebSocket real-time updates
    useEffect(() => {
        if (!socket || !candlestickSeries.current) return;

        const handleNewRecord = (record) => {
            try {
                const transformed = transformData([record]);
                if (transformed.length > 0) {
                    const newCandle = transformed[0];
                    
                    // Update candlestick
                    candlestickSeries.current.update(newCandle);
                    
                    // Update volume
                    const volumeItem = {
                        time: newCandle.time,
                        value: newCandle.volume,
                        color: newCandle.close >= newCandle.open ? '#10b981' : '#ef4444',
                    };
                    volumeSeries.current?.update(volumeItem);
                    
                    // Update records state
                    setRecords(prev => {
                        const updated = [...prev];
                        const lastIndex = updated.length - 1;
                        if (lastIndex >= 0 && updated[lastIndex].time === newCandle.time) {
                            updated[lastIndex] = newCandle;
                        } else {
                            updated.push(newCandle);
                        }
                        return updated;
                    });
                }
            } catch (err) {
                console.error('Error processing new record:', err);
            }
        };

        socket.on('new_record', handleNewRecord);

        return () => {
            socket.off('new_record', handleNewRecord);
        };
    }, [socket, candlestickSeries, volumeSeries]);

    // Update chart data when records change
    useEffect(() => {
        if (candlestickSeries.current && records.length > 0) {
            candlestickSeries.current.setData(records);
        }
        if (volumeSeries.current && volumeData.length > 0) {
            volumeSeries.current.setData(volumeData);
        }
        if (chart.current && records.length > 0) {
            chart.current.timeScale().fitContent();
        }
    }, [records, volumeData]);

    // Handle indicators
    useEffect(() => {
        if (!chart.current || !candlestickSeries.current || records.length === 0) return;

        // Remove previous indicator
        if (indicatorSeriesRef.current) {
            try {
                chart.current.removeSeries(indicatorSeriesRef.current);
            } catch (e) {
                console.warn('Error removing indicator series:', e);
            }
            indicatorSeriesRef.current = null;
        }

        // Add new indicator
        if (indicator === 'sma' && records.length >= 14) {
            const sma = calculateSMA(records, 14).filter(d => d.value !== null);
            if (sma.length > 0) {
                indicatorSeriesRef.current = chart.current.addLineSeries({
                    color: '#fbbf24',
                    lineWidth: 2,
                    priceLineVisible: false,
                    title: 'SMA (14)',
                    priceScaleId: 'right',
                });
                indicatorSeriesRef.current.setData(sma);
            }
        } else if (indicator === 'ema' && records.length >= 14) {
            const ema = calculateEMA(records, 14).filter(d => d.value !== null);
            if (ema.length > 0) {
                indicatorSeriesRef.current = chart.current.addLineSeries({
                    color: '#3b82f6',
                    lineWidth: 2,
                    priceLineVisible: false,
                    title: 'EMA (14)',
                    priceScaleId: 'right',
                });
                indicatorSeriesRef.current.setData(ema);
            }
        }
    }, [indicator, records]);

    // Refetch data when symbol or interval changes
    useEffect(() => {
        if (chart.current && candlestickSeries.current) {
            fetchChartData();
        }
    }, [symbol, selectedInterval, fetchChartData]);

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
                minHeight: '300px',
                flexDirection: 'column',
                gap: '8px',
            }}>
                <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Chart Error</div>
                <div style={{ fontSize: '14px', opacity: 0.8 }}>{error}</div>
                <button
                    onClick={fetchChartData}
                    style={{
                        marginTop: '12px',
                        padding: '8px 16px',
                        background: '#3b82f6',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '14px',
                    }}
                >
                    Retry
                </button>
            </div>
        );
    }

    if (loading && records.length === 0) {
        return (
            <div style={{
                width: '100%',
                height: typeof height === 'string' && height.includes('%') ? height : `${height}px`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#94a3b8',
                background: '#1e293b',
                borderRadius: '8px',
                minHeight: '300px',
            }}>
                <div style={{ fontSize: '16px', fontWeight: '500' }}>Loading chart...</div>
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
                minHeight: '200px',
            }}
            ref={chartContainerRef}
        />
    );
};

export default TradingChart;
