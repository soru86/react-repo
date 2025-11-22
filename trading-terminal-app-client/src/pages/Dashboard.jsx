import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown, DollarSign, Clock, Edit2, User, LogIn, LogOut, Shield, BarChart3, X } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PropTypes from 'prop-types';
import { useTheme } from '../shared/context/ThemeContext';
import { useLocation } from 'react-router';
import config from '../shared/config/api';
import MultiLineChart from '../components/MultiLineChart';

const { endpoints } = config;

const Dashboard = ({ portfolioData, recentOrders, positions }) => {
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const [marketData, setMarketData] = useState({
    gainers: [],
    losers: [],
    loading: false,
    error: null,
    lastUpdated: null
  });
  const [watchlist, setWatchlist] = useState([
    { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2850.75, change: 2.5 },
    { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3750.25, change: 1.8 },
    { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1650.50, change: 1.2 },
    { symbol: 'INFY', name: 'Infosys', price: 1550.00, change: 0.9 },
    { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 950.75, change: 0.7 }
  ]);
  const [isEditingWatchlist, setIsEditingWatchlist] = useState(false);
  const [newSymbol, setNewSymbol] = useState('');

  // Determine if we're on Indian market page
  const isIndianMarketPage = location.pathname.startsWith('/indian');
  const isIndianTradingPage = location.pathname.startsWith('/indian/trading');

  // Memoize fetchMarketData to avoid infinite loops
  const fetchMarketData = useCallback(async () => {
    // Only fetch data if we're on Indian market page
    if (!isIndianMarketPage) {
      return;
    }

    try {
      setMarketData(prev => ({ ...prev, loading: true, error: null }));

      // Try to fetch from broker APIs first
      const response = await fetch(`${endpoints['indianMarketData']}?symbol=RELIANCE&interval=1d`);

      if (!response.ok) {
        // If broker data is not available, use mock data
        setMarketData({
          gainers: [
            { symbol: 'RELIANCE', close: 2850.75, change_percent: 2.5, totvol: 1500000 },
            { symbol: 'TCS', close: 3450.25, change_percent: 1.8, totvol: 1200000 },
            { symbol: 'HDFC', close: 1650.50, change_percent: 1.2, totvol: 800000 },
            { symbol: 'INFY', close: 1450.75, change_percent: 0.9, totvol: 950000 },
            { symbol: 'ICICIBANK', close: 950.25, change_percent: 0.7, totvol: 1100000 }
          ],
          losers: [
            { symbol: 'WIPRO', close: 450.75, change_percent: -2.1, totvol: 650000 },
            { symbol: 'TECHM', close: 1250.50, change_percent: -1.8, totvol: 450000 },
            { symbol: 'HCLTECH', close: 1150.25, change_percent: -1.5, totvol: 550000 },
            { symbol: 'LT', close: 2850.75, change_percent: -1.2, totvol: 350000 },
            { symbol: 'AXISBANK', close: 950.50, change_percent: -0.9, totvol: 750000 }
          ],
          loading: false,
          error: null,
          lastUpdated: new Date()
        });
        return;
      }

      const data = await response.json();

      if (data && Array.isArray(data) && data.length > 0) {
        // Process broker data if available
        setMarketData({
          gainers: data.slice(0, 5), // Use first 5 as gainers
          losers: data.slice(5, 10), // Use next 5 as losers
          loading: false,
          error: null,
          lastUpdated: new Date()
        });
      } else {
        throw new Error('No data available from brokers');
      }
    } catch (error) {
      // Use mock data as fallback
      setMarketData({
        gainers: [
          { symbol: 'RELIANCE', close: 2850.75, change_percent: 2.5, totvol: 1500000 },
          { symbol: 'TCS', close: 3450.25, change_percent: 1.8, totvol: 1200000 },
          { symbol: 'HDFC', close: 1650.50, change_percent: 1.2, totvol: 800000 },
          { symbol: 'INFY', close: 1450.75, change_percent: 0.9, totvol: 950000 },
          { symbol: 'ICICIBANK', close: 950.25, change_percent: 0.7, totvol: 1100000 }
        ],
        losers: [
          { symbol: 'WIPRO', close: 450.75, change_percent: -2.1, totvol: 650000 },
          { symbol: 'TECHM', close: 1250.50, change_percent: -1.8, totvol: 450000 },
          { symbol: 'HCLTECH', close: 1150.25, change_percent: -1.5, totvol: 550000 },
          { symbol: 'LT', close: 2850.75, change_percent: -1.2, totvol: 350000 },
          { symbol: 'AXISBANK', close: 950.50, change_percent: -0.9, totvol: 750000 }
        ],
        loading: false,
        error: null,
        lastUpdated: new Date()
      });
    }
  }, [isIndianMarketPage, endpoints]);

  // Call fetchMarketData on mount only if on Indian market page
  useEffect(() => {
    if (isIndianMarketPage) {
      fetchMarketData();
    }
  }, [isIndianMarketPage, fetchMarketData]);

  // Add market data refresh interval and retry only if on Indian market page
  useEffect(() => {
    if (!isIndianMarketPage) return;

    const fetchWithRetry = async (retries = 3) => {
      try {
        await fetchMarketData();
      } catch (err) {
        if (retries > 0) {
          setTimeout(() => fetchWithRetry(retries - 1), 2000);
        }
      }
    };

    fetchWithRetry();

    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchWithRetry();
    }, 30000);

    return () => clearInterval(interval);
  }, [isIndianMarketPage, fetchMarketData]);


  // Manual refresh function
  const handleRefreshMarketData = () => {
    if (isIndianTradingPage) {
      fetchMarketData();
    }
  };

  // Format market data for display
  const formatMarketData = (data) => {
    if (!data || !Array.isArray(data)) return [];

    return data.map(item => ({
      symbol: item.symbol || item.name || 'N/A',
      price: item.close || item.price || item.ltp || 0,
      change: item.change_percent || item.changePercent || item.change || 0,
      volume: item.totvol ? formatVolume(item.totvol) : (item.volume ? formatVolume(item.volume) : 'N/A'),
      ...item // Keep all original data
    }));
  };

  // Format volume numbers
  const formatVolume = (volume) => {
    if (volume >= 1000000) {
      return (volume / 1000000).toFixed(1) + 'M';
    } else if (volume >= 1000) {
      return (volume / 1000).toFixed(1) + 'K';
    }
    return volume.toString();
  };

  // Format price with Indian rupee symbol
  const formatPrice = (price) => {
    return `₹${Number(price).toFixed(2)}`;
  };

  // Format change percentage with color
  /* const formatChange = (change) => {
    const changeNum = Number(change);
    const color = changeNum >= 0 ? 'text-green-600' : 'text-red-600';
    const sign = changeNum >= 0 ? '+' : '';
    return (
      <span className={color}>
        {sign}{changeNum.toFixed(2)}%
      </span>
    );
  }; */

  // Get formatted data
  const formattedGainers = formatMarketData(marketData.gainers);
  const formattedLosers = formatMarketData(marketData.losers);

  // Trending shares (you can modify this to fetch from another endpoint or derive from gainers)
  const trendingShares = formattedGainers.slice(0, 5);


  // Mock recent orders if none provided
  const defaultRecentOrders = [
    { id: 1, symbol: 'RELIANCE', type: 'BUY', quantity: 10, price: 2850.75, time: '10:30 AM' },
    { id: 2, symbol: 'TCS', type: 'SELL', quantity: 5, price: 3750.25, time: '11:15 AM' },
    { id: 3, symbol: 'HDFCBANK', type: 'BUY', quantity: 20, price: 1650.50, time: '12:00 PM' }
  ];

  // Use provided data or defaults
  const displayRecentOrders = recentOrders.length > 0 ? recentOrders : defaultRecentOrders;

  // Mock data for index charts with more variation
  const niftyData = [
    { value: 19800 }, { value: 19850 }, { value: 19820 }, { value: 19880 },
    { value: 19900 }, { value: 19850 }, { value: 19870 }, { value: 19850 },
    { value: 19830 }, { value: 19860 }, { value: 19840 }, { value: 19890 }
  ];

  const bankNiftyData = [
    { value: 44200 }, { value: 44250 }, { value: 44300 }, { value: 44280 },
    { value: 44350 }, { value: 44300 }, { value: 44250 }, { value: 44250 },
    { value: 44270 }, { value: 44320 }, { value: 44290 }, { value: 44330 }
  ];

  const vixData = [
    { value: 12.5 }, { value: 12.3 }, { value: 12.4 }, { value: 12.2 },
    { value: 12.3 }, { value: 12.4 }, { value: 12.3 }, { value: 12.25 },
    { value: 12.35 }, { value: 12.15 }, { value: 12.45 }, { value: 12.25 }
  ];

  // Calculate domains for each chart
  const getDomain = (data) => {
    const values = data.map(item => item.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.1; // 10% padding
    return [min - padding, max + padding];
  };

  const niftyDomain = getDomain(niftyData);
  const bankNiftyDomain = getDomain(bankNiftyData);
  const vixDomain = getDomain(vixData);

  const getTileBackground = () => {
    return isDarkMode
      ? 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)'
      : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)';
  };

  const getTileBorder = () => {
    return isDarkMode
      ? '1px solid rgba(55, 65, 81, 0.3)'
      : '1px solid rgba(226, 232, 240, 0.5)';
  };

  const getTileShadow = () => {
    return isDarkMode
      ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      : '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
  };

  const getTextColor = (type = 'primary') => {
    if (type === 'primary') {
      return isDarkMode ? '#ffffff' : '#1e293b';
    }
    if (type === 'secondary') {
      return isDarkMode ? '#94a3b8' : '#64748b';
    }
    return isDarkMode ? '#d1d5db' : '#475569';
  };

  const tileStyle = {
    background: getTileBackground(),
    padding: '12px',
    borderRadius: '8px',
    boxShadow: getTileShadow(),
    border: getTileBorder(),
    transition: 'all 0.3s ease'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px'
  };

  const headerTextStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: getTextColor('secondary')
  };

  const titleStyle = {
    margin: 0,
    fontSize: '13px',
    color: getTextColor('secondary')
  };

  const handleEditWatchlist = () => {
    setIsEditingWatchlist(!isEditingWatchlist);
  };

  const handleAddToWatchlist = () => {
    if (newSymbol.trim() && !watchlist.find(w => w.symbol === newSymbol.toUpperCase())) {
      setWatchlist([...watchlist, {
        symbol: newSymbol.toUpperCase(),
        name: newSymbol.toUpperCase(),
        price: 0,
        change: 0
      }]);
      setNewSymbol('');
    }
  };

  const handleRemoveFromWatchlist = (symbol) => {
    setWatchlist(watchlist.filter(w => w.symbol !== symbol));
  };

  return (
    <div style={{
      padding: '24px',
      height: '100%',
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px',
      position: 'relative'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '[first] 632px [second] auto', // Decreased width for each tile
        gap: '12px',
        justifyContent: 'start', // Align tiles to the left
        marginBottom: '8px'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          padding: '20px 8px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ color: '#f1f5f9', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>Market Overview</h2>
          {/* Market Overview */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 200px)', // Decreased width for each tile
            gap: '8px',
            justifyContent: 'start', // Align tiles to the left
            marginBottom: '8px'
          }}>
            {/* NIFTY 50 */}
            <div style={{
              background: isDarkMode ? '#0f172a' : '#f8fafc',
              padding: '12px',
              borderRadius: '8px',
              boxShadow: getTileShadow(),
              border: 'none',
              transition: 'all 0.3s ease'
            }}>
              <div style={headerStyle}>
                <div style={headerTextStyle}>
                  <TrendingUp size={14} />
                  <h3 style={titleStyle}>NIFTY 50</h3>
                </div>
              </div>
              <div style={{ color: getTextColor() }}>19,850.25</div>
              <div style={{ color: '#22c55e', fontSize: '12px' }}>+0.75%</div>
              <div style={{ height: '35px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={niftyData}>
                    <defs>
                      <linearGradient id="niftyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <YAxis domain={niftyDomain} hide={true} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#10b981"
                      fill="url(#niftyGradient)"
                      strokeWidth={1.5}
                      dot={false}
                      isAnimationActive={true}
                      animationDuration={1000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* BANK NIFTY */}
            <div style={{
              background: isDarkMode ? '#0f172a' : '#f8fafc',
              padding: '12px',
              borderRadius: '8px',
              boxShadow: getTileShadow(),
              border: 'none',
              transition: 'all 0.3s ease'
            }}>
              <div style={headerStyle}>
                <div style={headerTextStyle}>
                  <TrendingUp size={14} />
                  <h3 style={titleStyle}>BANK NIFTY</h3>
                </div>
              </div>
              <div style={{ color: getTextColor() }}>44,325.50</div>
              <div style={{ color: '#22c55e', fontSize: '12px' }}>+0.85%</div>
              <div style={{ height: '35px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={bankNiftyData}>
                    <defs>
                      <linearGradient id="bankNiftyGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <YAxis domain={bankNiftyDomain} hide={true} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#10b981"
                      fill="url(#bankNiftyGradient)"
                      strokeWidth={1.5}
                      dot={false}
                      isAnimationActive={true}
                      animationDuration={1000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* INDIA VIX */}
            <div style={{
              background: isDarkMode ? '#0f172a' : '#f8fafc',
              padding: '12px',
              borderRadius: '8px',
              boxShadow: getTileShadow(),
              border: 'none',
              transition: 'all 0.3s ease'
            }}>
              <div style={headerStyle}>
                <div style={headerTextStyle}>
                  <TrendingDown size={14} />
                  <h3 style={titleStyle}>INDIA VIX</h3>
                </div>
              </div>
              <div style={{ color: getTextColor() }}>12.35</div>
              <div style={{ color: '#ef4444', fontSize: '12px' }}>-0.25%</div>
              <div style={{ height: '35px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={vixData}>
                    <defs>
                      <linearGradient id="vixGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <YAxis domain={vixDomain} hide={true} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#ef4444"
                      fill="url(#vixGradient)"
                      strokeWidth={1.5}
                      dot={false}
                      isAnimationActive={true}
                      animationDuration={1000}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        {/* Portfolio Overview */}
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ color: '#f1f5f9', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>Portfolio Overview</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 220px)', gap: '12px', justifyContent: 'start' }}>
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #10b981'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <TrendingUp size={20} color="#10b981" />
                <span style={{ color: '#10b981', fontWeight: '600' }}>Total Value</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f1f5f9' }}>₹1,25,000</div>
              <div style={{ fontSize: '14px', color: '#10b981' }}>+₹5,000 (+4.2%)</div>
            </div>
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #ef4444'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <TrendingDown size={20} color="#ef4444" />
                <span style={{ color: '#ef4444', fontWeight: '600' }}>Day P&L</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f1f5f9' }}>₹2,500</div>
              <div style={{ fontSize: '14px', color: '#ef4444' }}>+₹500 (+25%)</div>
            </div>
            <div style={{
              background: 'rgba(59, 130, 246, 0.1)',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #3b82f6'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <DollarSign size={20} color="#3b82f6" />
                <span style={{ color: '#3b82f6', fontWeight: '600' }}>Available Cash</span>
              </div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f1f5f9' }}>₹45,000</div>
              <div style={{ fontSize: '14px', color: '#94a3b8' }}>Ready to trade</div>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Line Chart for Indian Market */}
      {isIndianMarketPage && (
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          marginBottom: '24px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px'
          }}>
            <h2 style={{ color: '#f1f5f9', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>
              Market Overview (NIFTY, BankNifty, Reliance, HDFC)
            </h2>
            <div style={{ color: '#94a3b8', fontSize: '14px' }}>
              Real-time Performance
            </div>
          </div>
          <div style={{ height: '400px', width: '100%' }}>
            <MultiLineChart height={400} />
          </div>
        </div>
      )}

      {/* Market Data Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '12px'
      }}>
        {/* Trending Shares */}
        <div style={tileStyle}>
          <div style={headerStyle}>
            <div style={headerTextStyle}>
              <BarChart3 size={14} />
              <h3 style={titleStyle}>Trending Shares</h3>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {trendingShares.map((stock, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '6px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '6px',
                fontSize: '12px'
              }}>
                <div>
                  <div style={{ color: '#ffffff', fontWeight: '500' }}>{stock.symbol}</div>
                  <div style={{ color: '#94a3b8', fontSize: '11px' }}>Vol: {stock.volume}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#ffffff' }}>₹{stock.price.toLocaleString()}</div>
                  <div style={{
                    color: stock.change >= 0 ? '#10b981' : '#ef4444',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    justifyContent: 'flex-end',
                    fontSize: '11px'
                  }}>
                    {stock.change >= 0 ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                    {Math.abs(stock.change)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Gainers */}
        <div style={tileStyle}>
          <div style={headerStyle}>
            <div style={headerTextStyle}>
              <TrendingUp size={14} />
              <h3 style={titleStyle}>Top Gainers</h3>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {marketData.loading ? (
              <div className="loading-spinner">Loading market data...</div>
            ) : marketData.error ? (
              <div className="error-message">
                {marketData.error}
                <button onClick={handleRefreshMarketData}>Retry</button>
              </div>
            ) : (
              formattedGainers.map((stock, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '6px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}>
                  <div>
                    <div style={{ color: '#ffffff', fontWeight: '500' }}>{stock.symbol}</div>
                    <div style={{ color: '#94a3b8', fontSize: '11px' }}>Vol: {stock.volume}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#ffffff' }}>{formatPrice(stock.price)}</div>
                    <div style={{
                      color: stock.change >= 0 ? '#10b981' : '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                      justifyContent: 'flex-end',
                      fontSize: '11px'
                    }}>
                      {stock.change >= 0 ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                      {Math.abs(stock.change)}%
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Losers */}
        <div style={tileStyle}>
          <div style={headerStyle}>
            <div style={headerTextStyle}>
              <TrendingDown size={14} />
              <h3 style={titleStyle}>Top Losers</h3>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {marketData.loading ? (
              <div className="loading-spinner">Loading market data...</div>
            ) : marketData.error ? (
              <div className="error-message">
                {marketData.error}
                <button onClick={handleRefreshMarketData}>Retry</button>
              </div>
            ) : (
              formattedLosers.map((stock, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '6px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}>
                  <div>
                    <div style={{ color: '#ffffff', fontWeight: '500' }}>{stock.symbol}</div>
                    <div style={{ color: '#94a3b8', fontSize: '11px' }}>Vol: {stock.volume}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#ffffff' }}>{formatPrice(stock.price)}</div>
                    <div style={{
                      color: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '2px',
                      justifyContent: 'flex-end',
                      fontSize: '11px'
                    }}>
                      <ArrowDown size={10} />
                      {Math.abs(stock.change)}%
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Watchlist */}
        <div style={tileStyle}>
          <div style={headerStyle}>
            <div style={headerTextStyle}>
              <BarChart3 size={14} />
              <h3 style={titleStyle}>Watchlist</h3>
            </div>
            <button
              onClick={handleEditWatchlist}
              style={{
                background: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                border: 'none',
                borderRadius: '4px',
                padding: '4px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}
            >
              <Edit2 size={12} color={getTextColor('secondary')} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {isEditingWatchlist && (
              <div style={{
                display: 'flex',
                gap: '4px',
                marginBottom: '8px',
                padding: '6px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '6px'
              }}>
                <input
                  type="text"
                  value={newSymbol}
                  onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddToWatchlist();
                    }
                  }}
                  placeholder="Add symbol"
                  style={{
                    flex: 1,
                    padding: '4px 8px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid #334155',
                    borderRadius: '4px',
                    color: '#ffffff',
                    fontSize: '12px',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={handleAddToWatchlist}
                  style={{
                    padding: '4px 12px',
                    background: '#3b82f6',
                    border: 'none',
                    borderRadius: '4px',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Add
                </button>
              </div>
            )}
            {watchlist.length === 0 ? (
              <div style={{ color: '#64748b', fontSize: '12px', textAlign: 'center', padding: '12px' }}>
                No symbols in watchlist. {isEditingWatchlist && 'Add symbols above.'}
              </div>
            ) : (
              watchlist.map((stock) => (
                <div key={stock.symbol} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '6px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '6px',
                  fontSize: '12px'
                }}>
                  <div>
                    <div style={{ color: '#ffffff', fontWeight: '500' }}>{stock.symbol}</div>
                    <div style={{ color: '#94a3b8', fontSize: '11px' }}>{stock.name}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#ffffff' }}>₹{stock.price.toLocaleString()}</div>
                      <div style={{
                        color: stock.change >= 0 ? '#10b981' : '#ef4444',
                        fontSize: '11px'
                      }}>
                        {stock.change >= 0 ? '+' : ''}{stock.change}%
                      </div>
                    </div>
                    {isEditingWatchlist && (
                      <button
                        onClick={() => handleRemoveFromWatchlist(stock.symbol)}
                        style={{
                          padding: '2px 6px',
                          background: 'rgba(239, 68, 68, 0.2)',
                          border: 'none',
                          borderRadius: '4px',
                          color: '#ef4444',
                          cursor: 'pointer',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div style={tileStyle}>
        <div style={headerStyle}>
          <div style={headerTextStyle}>
            <Clock size={14} />
            <h3 style={titleStyle}>Recent Orders</h3>
          </div>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px'
        }}>
          {displayRecentOrders.map((order) => (
            <div key={order.id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '6px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '6px',
              fontSize: '12px'
            }}>
              <div>
                <div style={{ color: '#ffffff', fontWeight: '500' }}>{order.symbol}</div>
                <div style={{ color: '#94a3b8', fontSize: '11px' }}>{order.type} • {order.quantity} shares</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#ffffff' }}>₹{order.price.toLocaleString()}</div>
                <div style={{ color: '#94a3b8', fontSize: '11px' }}>{order.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Chart */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        flex: 1,
        minHeight: '400px'
      }}>
        <h2 style={{ color: '#f1f5f9', marginBottom: '20px', fontSize: '20px', fontWeight: 'bold' }}>Portfolio Performance</h2>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={portfolioData}>
            <defs>
              <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="time"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                background: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f1f5f9'
              }}
              labelStyle={{ color: '#94a3b8' }}
              formatter={(value) => [`₹${value.toLocaleString()}`, 'Portfolio Value']}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#portfolioGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Orders and Positions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Recent Orders */}
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ color: '#f1f5f9', marginBottom: '16px', fontSize: '16px', fontWeight: 'bold' }}>Recent Orders</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recentOrders.slice(0, 5).map((order, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '6px'
              }}>
                <div>
                  <div style={{ color: '#f1f5f9', fontWeight: '500' }}>{order.symbol}</div>
                  <div style={{ color: '#94a3b8', fontSize: '12px' }}>{order.time}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    color: order.side === 'BUY' ? '#10b981' : '#ef4444',
                    fontWeight: '600'
                  }}>
                    {order.side}
                  </div>
                  <div style={{ color: '#94a3b8', fontSize: '12px' }}>
                    {order.quantity} @ ₹{order.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Positions */}
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          padding: '20px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ color: '#f1f5f9', marginBottom: '16px', fontSize: '16px', fontWeight: 'bold' }}>Current Positions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {positions.map((position, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '6px'
              }}>
                <div>
                  <div style={{ color: '#f1f5f9', fontWeight: '500' }}>{position.symbol}</div>
                  <div style={{ color: '#94a3b8', fontSize: '12px' }}>
                    {position.shares} shares
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    color: position.pnl >= 0 ? '#10b981' : '#ef4444',
                    fontWeight: '600'
                  }}>
                    ₹{position.pnl.toLocaleString()}
                  </div>
                  <div style={{
                    color: position.pnl >= 0 ? '#10b981' : '#ef4444',
                    fontSize: '12px'
                  }}>
                    {position.pnlPercent >= 0 ? '+' : ''}{position.pnlPercent}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

Dashboard.propTypes = {
  portfolioData: PropTypes.array,
  recentOrders: PropTypes.array,
  positions: PropTypes.array,
  watchlist: PropTypes.array
};

export default Dashboard;