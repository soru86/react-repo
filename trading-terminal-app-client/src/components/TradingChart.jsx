import { useEffect, useRef, useState } from "react";
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

const chartOptions = (chartContainerRef, actualHeight) => {
    return {
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
    }
};

const getApiEndpoint = (symbol, interval) => {
    const apiInterval = intervalMap[interval] || interval;
    return `${BACKEND_BASE_URL}/indian-market/test-real-time-chart?symbol=${symbol}&interval=${apiInterval}`;
};

const cleanupChart = (chartRef, isDestroyedRef, chartId) => {
    if (chartRef.current && !isDestroyedRef.current) {
        console.log(`TradingChart [${chartId}] cleaning up chart`);
        isDestroyedRef.current = true;
        try {
            chartRef.current.remove();
        } catch (e) {
            console.warn(`TradingChart [${chartId}] error during chart cleanup:`, e);
        }
        chartRef.current = null;
    }
};

/*
const initialRecords = [
    {
        "time": 1558963,
        "open": 9539.98,
        "high": 8419.35,
        "low": 660.97,
        "close": 1796.64,
        "volume": 897336.79,
        "stock_symbol": "GOOGL",
        "exchange": "LSE",
        "sector": "Finance",
        "currency": "BRL"
    },
    {
        "time": 11224417,
        "open": 2571.52,
        "high": 6995.02,
        "low": 2823.9,
        "close": 779.12,
        "volume": 956963.34,
        "stock_symbol": "AAPL",
        "exchange": "NASDAQ",
        "sector": "Technology",
        "currency": "EUR"
    },
    {
        "time": 15680886,
        "open": 8927.11,
        "high": 2522.81,
        "low": 853.87,
        "close": 4128.65,
        "volume": 289904.88,
        "stock_symbol": "MSFT",
        "exchange": "LSE",
        "sector": "Finance",
        "currency": "CNY"
    },
    {
        "time": 15704381,
        "open": 6475.14,
        "high": 9010.36,
        "low": 3709.98,
        "close": 3677.88,
        "volume": 544879.07,
        "stock_symbol": "GOOGL",
        "exchange": "NYSE",
        "sector": "Finance",
        "currency": "CNY"
    },
    {
        "time": 17645916,
        "open": 1995.64,
        "high": 6512.51,
        "low": 8174.5,
        "close": 6061.2,
        "volume": 824611.91,
        "stock_symbol": "GOOGL",
        "exchange": "NYSE",
        "sector": "Technology",
        "currency": "COP"
    },
    {
        "time": 20450553,
        "open": 1651.63,
        "high": 3280.93,
        "low": 6090.13,
        "close": 6352.01,
        "volume": 934913.56,
        "stock_symbol": "AMZN",
        "exchange": "NYSE",
        "sector": "Energy",
        "currency": "EUR"
    },
    {
        "time": 22171227,
        "open": 3735.69,
        "high": 6185.69,
        "low": 4739.11,
        "close": 5611.51,
        "volume": 249310.08,
        "stock_symbol": "AMZN",
        "exchange": "NYSE",
        "sector": "Finance",
        "currency": "USD"
    },
    {
        "time": 22671142,
        "open": 799.22,
        "high": 6239.1,
        "low": 1185.12,
        "close": 5168.41,
        "volume": 288987.64,
        "stock_symbol": "MSFT",
        "exchange": "NYSE",
        "sector": "Finance",
        "currency": "CNY"
    },
    {
        "time": 23428481,
        "open": 6065.83,
        "high": 3464.02,
        "low": 8256.29,
        "close": 7330.28,
        "volume": 32425.79,
        "stock_symbol": "AAPL",
        "exchange": "NASDAQ",
        "sector": "Healthcare",
        "currency": "EUR"
    },
    {
        "time": 24303271,
        "open": 1903.97,
        "high": 359.96,
        "low": 8243.34,
        "close": 5313.65,
        "volume": 110302.9,
        "stock_symbol": "AMZN",
        "exchange": "NYSE",
        "sector": "Healthcare",
        "currency": "IDR"
    },
    {
        "time": 27134626,
        "open": 1055.37,
        "high": 4808.8,
        "low": 5296.93,
        "close": 2125.28,
        "volume": 436487.86,
        "stock_symbol": "GOOGL",
        "exchange": "LSE",
        "sector": "Technology",
        "currency": "CNY"
    },
    {
        "time": 27826887,
        "open": 917.02,
        "high": 5040.22,
        "low": 18.04,
        "close": 8953.98,
        "volume": 133452.27,
        "stock_symbol": "AAPL",
        "exchange": "TSX",
        "sector": "Healthcare",
        "currency": "JPY"
    },
    {
        "time": 28666348,
        "open": 4234.62,
        "high": 6480.12,
        "low": 6656.84,
        "close": 6273.76,
        "volume": 67175.24,
        "stock_symbol": "GOOGL",
        "exchange": "LSE",
        "sector": "Energy",
        "currency": "CNY"
    },
    {
        "time": 29422769,
        "open": 763.21,
        "high": 9706.11,
        "low": 7826.73,
        "close": 8085.7,
        "volume": 733827.44,
        "stock_symbol": "AMZN",
        "exchange": "TSX",
        "sector": "Healthcare",
        "currency": "RUB"
    },
    {
        "time": 30671354,
        "open": 9526.05,
        "high": 6853.0,
        "low": 8596.01,
        "close": 4291.26,
        "volume": 416742.92,
        "stock_symbol": "GOOGL",
        "exchange": "LSE",
        "sector": "Finance",
        "currency": "SYP"
    },
    {
        "time": 31961647,
        "open": 4194.97,
        "high": 4300.12,
        "low": 6776.91,
        "close": 2627.17,
        "volume": 983879.37,
        "stock_symbol": "AMZN",
        "exchange": "NASDAQ",
        "sector": "Finance",
        "currency": "EUR"
    },
    {
        "time": 47837697,
        "open": 1863.64,
        "high": 149.23,
        "low": 6050.83,
        "close": 5252.11,
        "volume": 45743.1,
        "stock_symbol": "AMZN",
        "exchange": "LSE",
        "sector": "Finance",
        "currency": "EUR"
    },
    {
        "time": 49967408,
        "open": 7970.13,
        "high": 6614.89,
        "low": 5940.47,
        "close": 5585.0,
        "volume": 631692.13,
        "stock_symbol": "MSFT",
        "exchange": "NASDAQ",
        "sector": "Technology",
        "currency": "SOS"
    },
    {
        "time": 50822444,
        "open": 5122.99,
        "high": 2802.24,
        "low": 8305.73,
        "close": 3919.69,
        "volume": 105906.98,
        "stock_symbol": "MSFT",
        "exchange": "TSX",
        "sector": "Technology",
        "currency": "USD"
    },
    {
        "time": 53508466,
        "open": 7770.38,
        "high": 9533.43,
        "low": 8093.14,
        "close": 3670.65,
        "volume": 53970.33,
        "stock_symbol": "GOOGL",
        "exchange": "NASDAQ",
        "sector": "Energy",
        "currency": "ETB"
    },
    {
        "time": 54527333,
        "open": 7789.17,
        "high": 3695.36,
        "low": 7943.87,
        "close": 6573.94,
        "volume": 745840.6,
        "stock_symbol": "GOOGL",
        "exchange": "NASDAQ",
        "sector": "Finance",
        "currency": "ANG"
    },
    {
        "time": 59194536,
        "open": 1611.41,
        "high": 5490.85,
        "low": 3222.5,
        "close": 2618.97,
        "volume": 307718.17,
        "stock_symbol": "MSFT",
        "exchange": "NYSE",
        "sector": "Healthcare",
        "currency": "CNY"
    },
    {
        "time": 61660941,
        "open": 2459.84,
        "high": 7239.6,
        "low": 6136.67,
        "close": 8333.1,
        "volume": 893220.75,
        "stock_symbol": "AAPL",
        "exchange": "TSX",
        "sector": "Finance",
        "currency": "MXN"
    },
    {
        "time": 63134639,
        "open": 7359.82,
        "high": 4301.69,
        "low": 2999.57,
        "close": 6120.48,
        "volume": 867103.41,
        "stock_symbol": "GOOGL",
        "exchange": "LSE",
        "sector": "Healthcare",
        "currency": "NOK"
    },
    {
        "time": 66487178,
        "open": 7516.82,
        "high": 1463.81,
        "low": 1545.05,
        "close": 7411.28,
        "volume": 379097.72,
        "stock_symbol": "MSFT",
        "exchange": "NYSE",
        "sector": "Energy",
        "currency": "CNY"
    },
    {
        "time": 69315173,
        "open": 3282.53,
        "high": 3399.7,
        "low": 927.29,
        "close": 7782.32,
        "volume": 824508.62,
        "stock_symbol": "AMZN",
        "exchange": "NYSE",
        "sector": "Energy",
        "currency": "MYR"
    },
    {
        "time": 70190557,
        "open": 6619.63,
        "high": 8895.92,
        "low": 2449.23,
        "close": 2850.57,
        "volume": 462787.74,
        "stock_symbol": "AAPL",
        "exchange": "NASDAQ",
        "sector": "Healthcare",
        "currency": "CNY"
    }
]; */

const TradingChart = ({
    height = 400,
    selectedSymbol = null,
    // indicator = 'none',
    selectedInterval = '1h',
    marketContext = null
}) => {
    const [symbol] = useState(selectedSymbol || getDefaultSymbol(marketContext));
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartId] = useState(() => Math.random().toString(36).substr(2, 9));
    const chartContainerRef = useRef();
    const isDestroyedRef = useRef(false);
    const chart = useRef();
    const series = useRef();
    const { socket } = useSocketContext();

    useEffect(() => {
        try {
            const container = chartContainerRef.current;
            const isDestroyed = isDestroyedRef.current;
            const cId = chartId.current

            if (socket) {
                socket.on('new_record', (record) => {
                    // Append each incoming record
                    console.log('new_record received: ', record);
                    setRecords(() => [...records, record]);
                });
            }

            chart.current = createChart(chartContainerRef?.current, chartOptions);
            series.current = chart.current.addCandlestickSeries({
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

            series.current.setData(records);

            // Cleanup on unmount
            return () => {
                socket?.off('new_record');
                cleanupChart(container, isDestroyed, cId);
            };
        } catch (error) {
            setError(error.message || 'Failed to load chart data');
        }
    }, [socket]);

    useEffect(() => {
        const fetchData = async () => {
            await fetch(getApiEndpoint(symbol, selectedInterval), {
                mode: 'cors'
            });
        };
        fetchData();
    }, [symbol, selectedInterval])

    useEffect(() => {
        try {
            if (!symbol) {
                setError('No symbol selected');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            // console.log("chartContainerRef: ", chartContainerRef);
            // console.log("chartContainerRef: ", chartContainerRef.current);

            series.current.update(records[records.length - 1]);

            chart.current.timeScale().fitContent();
            chart.current.timeScale().scrollToPosition(5);
        } catch (error) {
            setError(error.message || 'Failed to load chart data');
            setLoading(false);
        }
    }, [symbol, chartId, records]);

    if (error) {
        return (
            <div style={{
                width: '100%',
                height: '400px',
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
    }

    return (
        <div
            style={{
                width: '100%',
                height: `${height}px`,
                position: 'relative',
                background: '#1e293b',
                borderRadius: '8px',
                minHeight: '200px'
            }}
            ref={chartContainerRef}
        />
    );
};

export default TradingChart