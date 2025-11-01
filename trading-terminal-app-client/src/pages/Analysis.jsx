import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Brush } from 'recharts';
import { Plus, Trash2, ArrowUp, ArrowDown, TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';
import { BACKEND_BASE_URL } from '../shared/config/api';

const Analysis = (/*{ portfolioData, positions } */) => {
  // const [activeIndex, setActiveIndex] = useState(null);
  const [strategyLegs, setStrategyLegs] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [selectedType, setSelectedType] = useState('CALL');
  const [selectedStrike, setSelectedStrike] = useState('');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('options');
  // const [showGreeksHelp, setShowGreeksHelp] = useState(false);

  // Option chain state
  const [optionChainData, setOptionChainData] = useState(null);
  const [selectedOptionSymbol, setSelectedOptionSymbol] = useState('NIFTY');
  const [selectedExpiry, setSelectedExpiry] = useState('');
  const [includeGreeks, setIncludeGreeks] = useState(true);
  const [optionChainLoading, setOptionChainLoading] = useState(false);
  const [optionChainError, setOptionChainError] = useState(null);

  // Intraday Trading Builder States
  const [intradayStocks, setIntradayStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState('');
  const [stockQuantity, setStockQuantity] = useState(1);
  const [entryPrice, setEntryPrice] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [timeFrame, setTimeFrame] = useState('5min');

  const availableSymbols = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK'];
  const optionTypes = ['CALL', 'PUT'];
  const strikePrices = {
    'RELIANCE': [2500, 2600, 2700, 2800, 2900],
    'TCS': [3500, 3600, 3700, 3800, 3900],
    'HDFCBANK': [1600, 1650, 1700, 1750, 1800],
    'INFY': [1500, 1550, 1600, 1650, 1700],
    'ICICIBANK': [900, 950, 1000, 1050, 1100]
  };

  // Available symbols for options
  const availableOptionSymbols = ['NIFTY', 'BANKNIFTY', 'FINNIFTY', 'SENSEX'];

  const timeFrames = ['1min', '3min', '5min', '15min', '30min', '1hour'];

  // Mock stock data for analysis
  const stockData = {
    'RELIANCE': { volatility: 1.2, avgVolume: 2500000, support: 2700, resistance: 2900 },
    'TCS': { volatility: 0.8, avgVolume: 1800000, support: 3600, resistance: 3800 },
    'HDFCBANK': { volatility: 1.5, avgVolume: 1200000, support: 1650, resistance: 1750 },
    'INFY': { volatility: 1.0, avgVolume: 2000000, support: 1550, resistance: 1650 },
    'ICICIBANK': { volatility: 1.3, avgVolume: 1500000, support: 950, resistance: 1050 }
  };

  const addIntradayStock = () => {
    if (selectedStock && entryPrice && targetPrice && stopLoss) {
      const newStock = {
        id: Date.now(),
        symbol: selectedStock,
        quantity: stockQuantity,
        entryPrice: Number(entryPrice),
        targetPrice: Number(targetPrice),
        stopLoss: Number(stopLoss),
        timeFrame,
        riskReward: calculateRiskReward(Number(entryPrice), Number(targetPrice), Number(stopLoss)),
        potentialProfit: calculatePotentialProfit(Number(entryPrice), Number(targetPrice), stockQuantity),
        potentialLoss: calculatePotentialLoss(Number(entryPrice), Number(stopLoss), stockQuantity)
      };
      setIntradayStocks([...intradayStocks, newStock]);
      // Reset inputs
      setEntryPrice('');
      setTargetPrice('');
      setStopLoss('');
    }
  };

  const removeIntradayStock = (id) => {
    setIntradayStocks(intradayStocks.filter(stock => stock.id !== id));
  };

  const calculateRiskReward = (entry, target, stop) => {
    const reward = Math.abs(target - entry);
    const risk = Math.abs(entry - stop);
    return (reward / risk).toFixed(2);
  };

  const calculatePotentialProfit = (entry, target, quantity) => {
    return Math.abs(target - entry) * quantity;
  };

  const calculatePotentialLoss = (entry, stop, quantity) => {
    return Math.abs(entry - stop) * quantity;
  };

  const calculatePortfolioMetrics = () => {
    if (intradayStocks.length === 0) return null;

    const totalInvestment = intradayStocks.reduce((sum, stock) =>
      sum + (stock.entryPrice * stock.quantity), 0);

    const totalPotentialProfit = intradayStocks.reduce((sum, stock) =>
      sum + stock.potentialProfit, 0);

    const totalPotentialLoss = intradayStocks.reduce((sum, stock) =>
      sum + stock.potentialLoss, 0);

    const avgRiskReward = intradayStocks.reduce((sum, stock) =>
      sum + Number(stock.riskReward), 0) / intradayStocks.length;

    return {
      totalInvestment,
      totalPotentialProfit,
      totalPotentialLoss,
      avgRiskReward,
      profitPercentage: ((totalPotentialProfit / totalInvestment) * 100).toFixed(2)
    };
  };

  const portfolioMetrics = calculatePortfolioMetrics();

  const addStrategyLeg = () => {
    if (selectedSymbol && selectedStrike && selectedQuantity) {
      const newLeg = {
        id: Date.now(),
        symbol: selectedSymbol,
        type: selectedType,
        strike: selectedStrike,
        quantity: selectedQuantity,
        premium: calculatePremium(selectedSymbol, selectedType, selectedStrike)
      };
      setStrategyLegs([...strategyLegs, newLeg]);
      // Reset inputs
      setSelectedStrike('');
      setSelectedQuantity(1);
    }
  };

  const removeStrategyLeg = (id) => {
    setStrategyLegs(strategyLegs.filter(leg => leg.id !== id));
  };

  const calculatePremium = (symbol, type, strike) => {
    // Mock premium calculation
    const basePrice = strikePrices[symbol].indexOf(Number(strike)) * 10;
    return type === 'CALL' ? basePrice + 50 : basePrice + 30;
  };

  const calculateStrategyMetrics = () => {
    if (strategyLegs.length === 0) return null;

    const totalCost = strategyLegs.reduce((sum, leg) => {
      const cost = leg.premium * leg.quantity;
      return sum + (leg.type === 'CALL' ? cost : -cost);
    }, 0);

    const maxProfit = strategyLegs.reduce((sum, leg) => {
      const profit = leg.type === 'CALL' ?
        (leg.strike * 0.1) * leg.quantity :
        (leg.strike * 0.05) * leg.quantity;
      return sum + profit;
    }, 0);

    const maxLoss = Math.abs(totalCost);

    return {
      totalCost,
      maxProfit,
      maxLoss,
      riskRewardRatio: maxProfit / maxLoss
    };
  };

  const strategyMetrics = calculateStrategyMetrics();

  // Fetch option chain data
  const fetchOptionChain = async (symbol = 'NIFTY', expiry = null) => {
    setOptionChainLoading(true);
    setOptionChainError(null);

    try {
      // Use mock option chain data
      const mockOptionChainData = {
        symbol: symbol,
        expiry: expiry || '2024-12-26',
        spotPrice: 19500,
        calls: [
          { strike: 19000, oi: 1500, volume: 800, iv: 0.25, delta: 0.85, gamma: 0.0001, theta: -12.5, vega: 45.2, ltp: 520 },
          { strike: 19200, oi: 2200, volume: 1200, iv: 0.28, delta: 0.72, gamma: 0.0002, theta: -15.8, vega: 52.1, ltp: 320 },
          { strike: 19400, oi: 2800, volume: 1500, iv: 0.32, delta: 0.58, gamma: 0.0003, theta: -18.2, vega: 58.9, ltp: 180 },
          { strike: 19600, oi: 3200, volume: 1800, iv: 0.35, delta: 0.42, gamma: 0.0004, theta: -20.5, vega: 65.7, ltp: 95 },
          { strike: 19800, oi: 3500, volume: 2000, iv: 0.38, delta: 0.28, gamma: 0.0005, theta: -22.8, vega: 72.5, ltp: 45 }
        ],
        puts: [
          { strike: 19000, oi: 1200, volume: 600, iv: 0.24, delta: -0.15, gamma: 0.0001, theta: -10.2, vega: 42.1, ltp: 25 },
          { strike: 19200, oi: 1800, volume: 900, iv: 0.27, delta: -0.28, gamma: 0.0002, theta: -13.5, vega: 48.9, ltp: 45 },
          { strike: 19400, oi: 2400, volume: 1200, iv: 0.31, delta: -0.42, gamma: 0.0003, theta: -16.8, vega: 55.7, ltp: 85 },
          { strike: 19600, oi: 2800, volume: 1500, iv: 0.34, delta: -0.58, gamma: 0.0004, theta: -19.2, vega: 62.5, ltp: 145 },
          { strike: 19800, oi: 3200, volume: 1800, iv: 0.37, delta: -0.72, gamma: 0.0005, theta: -21.5, vega: 69.3, ltp: 225 }
        ]
      };

      setOptionChainData(mockOptionChainData);
    } catch (error) {
      console.error('Error fetching option chain:', error);
      setOptionChainError('Option chain data not available. Please connect to a broker for real-time data.');
    } finally {
      setOptionChainLoading(false);
    }
  };

  // Fetch real-time option chain updates
  const fetchRealtimeOptionChain = async (symbol = 'NIFTY', expiry = null) => {
    try {
      // Use mock data updates
      const mockRealtimeData = {
        symbol: symbol,
        expiry: expiry || '2024-12-26',
        spotPrice: 19500 + (Math.random() - 0.5) * 100, // Random price movement
        calls: [
          { strike: 19000, oi: 1500, volume: 800, iv: 0.25, delta: 0.85, gamma: 0.0001, theta: -12.5, vega: 45.2, ltp: 520 + (Math.random() - 0.5) * 20 },
          { strike: 19200, oi: 2200, volume: 1200, iv: 0.28, delta: 0.72, gamma: 0.0002, theta: -15.8, vega: 52.1, ltp: 320 + (Math.random() - 0.5) * 15 },
          { strike: 19400, oi: 2800, volume: 1500, iv: 0.32, delta: 0.58, gamma: 0.0003, theta: -18.2, vega: 58.9, ltp: 180 + (Math.random() - 0.5) * 10 },
          { strike: 19600, oi: 3200, volume: 1800, iv: 0.35, delta: 0.42, gamma: 0.0004, theta: -20.5, vega: 65.7, ltp: 95 + (Math.random() - 0.5) * 8 },
          { strike: 19800, oi: 3500, volume: 2000, iv: 0.38, delta: 0.28, gamma: 0.0005, theta: -22.8, vega: 72.5, ltp: 45 + (Math.random() - 0.5) * 5 }
        ],
        puts: [
          { strike: 19000, oi: 1200, volume: 600, iv: 0.24, delta: -0.15, gamma: 0.0001, theta: -10.2, vega: 42.1, ltp: 25 + (Math.random() - 0.5) * 3 },
          { strike: 19200, oi: 1800, volume: 900, iv: 0.27, delta: -0.28, gamma: 0.0002, theta: -13.5, vega: 48.9, ltp: 45 + (Math.random() - 0.5) * 5 },
          { strike: 19400, oi: 2400, volume: 1200, iv: 0.31, delta: -0.42, gamma: 0.0003, theta: -16.8, vega: 55.7, ltp: 85 + (Math.random() - 0.5) * 8 },
          { strike: 19600, oi: 2800, volume: 1500, iv: 0.34, delta: -0.58, gamma: 0.0004, theta: -19.2, vega: 62.5, ltp: 145 + (Math.random() - 0.5) * 10 },
          { strike: 19800, oi: 3200, volume: 1800, iv: 0.37, delta: -0.72, gamma: 0.0005, theta: -21.5, vega: 69.3, ltp: 225 + (Math.random() - 0.5) * 15 }
        ]
      };

      setOptionChainData(mockRealtimeData);
    } catch (error) {
      console.error('Error fetching real-time option chain:', error);
    }
  };

  // Fetch option chain when symbol or expiry changes
  useEffect(() => {
    if (activeTab === 'greeks') {
      fetchOptionChain(selectedOptionSymbol, selectedExpiry);
    }
  }, [selectedOptionSymbol, selectedExpiry, includeGreeks, activeTab]);

  // Set up real-time option chain updates
  useEffect(() => {
    if (activeTab === 'greeks') {
      const interval = setInterval(() => {
        fetchRealtimeOptionChain(selectedOptionSymbol, selectedExpiry);
      }, 5000); // Update every 5 seconds

      return () => clearInterval(interval);
    }
  }, [selectedOptionSymbol, selectedExpiry, activeTab]);

  // Handle manual refresh
  const handleRefresh = () => {
    fetchOptionChain(selectedOptionSymbol, selectedExpiry);
  };
  /*
   const monthlyReturns = [
     { month: 'Jan', return: 2.5 },
     { month: 'Feb', return: -1.2 },
     { month: 'Mar', return: 3.8 },
     { month: 'Apr', return: 1.5 },
     { month: 'May', return: 4.2 },
     { month: 'Jun', return: -0.8 }
   ];
 
   const sectorAllocation = [
     { sector: 'Technology', allocation: 35 },
     { sector: 'Finance', allocation: 25 },
     { sector: 'Healthcare', allocation: 20 },
     { sector: 'Energy', allocation: 15 },
     { sector: 'Others', allocation: 5 }
   ];
   */

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: '#1e293b',
          border: 'none',
          borderRadius: '8px',
          padding: '12px',
          color: '#ffffff',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ margin: '0 0 8px 0', color: '#94a3b8' }}>{label}</p>
          <p style={{ margin: 0, color: '#10b981' }}>
            {payload[0].name === 'return' ? 'Return: ' : 'Allocation: '}
            {payload[0].value}%
          </p>
        </div>
      );
    }
    return null;
  };

  const containerStyle = {
    padding: '24px',
    height: '100%',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    marginLeft: '40px',
    marginRight: '40px',
    boxSizing: 'border-box',
  };

  const tabNavStyle = {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    borderBottom: '1px solid #334155',
    paddingBottom: '8px',
  };
  const tabBtnStyle = (active) => ({
    padding: '8px 20px',
    border: 'none',
    borderBottom: active ? '3px solid #10b981' : '3px solid transparent',
    background: '#233c4a',
    color: active ? '#10b981' : '#94a3b8',
    fontWeight: active ? 700 : 500,
    fontSize: '15px',
    cursor: 'pointer',
    outline: 'none',
    transition: 'color 0.2s, border-bottom 0.2s'
  });

  /*
  // Expanded mock data for Greeks table
  const greeksTableData = [
    { strike: 2500, CE: 18.2, Delta_CE: 0.55, Vega_CE: 0.12, Theta_CE: -0.03, Gamma_CE: 0.01, PE: 12.5, Delta_PE: -0.45, Vega_PE: 0.10, Theta_PE: -0.04, Gamma_PE: 0.009 },
    { strike: 2520, CE: 19.0, Delta_CE: 0.57, Vega_CE: 0.13, Theta_CE: -0.032, Gamma_CE: 0.011, PE: 11.8, Delta_PE: -0.43, Vega_PE: 0.11, Theta_PE: -0.041, Gamma_PE: 0.0095 },
    { strike: 2540, CE: 19.8, Delta_CE: 0.59, Vega_CE: 0.14, Theta_CE: -0.034, Gamma_CE: 0.012, PE: 11.1, Delta_PE: -0.41, Vega_PE: 0.12, Theta_PE: -0.042, Gamma_PE: 0.010 },
    { strike: 2560, CE: 20.6, Delta_CE: 0.61, Vega_CE: 0.15, Theta_CE: -0.036, Gamma_CE: 0.013, PE: 10.4, Delta_PE: -0.39, Vega_PE: 0.13, Theta_PE: -0.043, Gamma_PE: 0.0105 },
    { strike: 2580, CE: 21.4, Delta_CE: 0.63, Vega_CE: 0.16, Theta_CE: -0.038, Gamma_CE: 0.014, PE: 9.7, Delta_PE: -0.37, Vega_PE: 0.14, Theta_PE: -0.044, Gamma_PE: 0.011 },
    { strike: 2600, CE: 22.2, Delta_CE: 0.65, Vega_CE: 0.17, Theta_CE: -0.04, Gamma_CE: 0.015, PE: 9.0, Delta_PE: -0.35, Vega_PE: 0.15, Theta_PE: -0.045, Gamma_PE: 0.0115 },
    { strike: 2620, CE: 23.0, Delta_CE: 0.67, Vega_CE: 0.18, Theta_CE: -0.042, Gamma_CE: 0.016, PE: 8.3, Delta_PE: -0.33, Vega_PE: 0.16, Theta_PE: -0.046, Gamma_PE: 0.012 },
    { strike: 2640, CE: 23.8, Delta_CE: 0.69, Vega_CE: 0.19, Theta_CE: -0.044, Gamma_CE: 0.017, PE: 7.6, Delta_PE: -0.31, Vega_PE: 0.17, Theta_PE: -0.047, Gamma_PE: 0.0125 },
    { strike: 2660, CE: 24.6, Delta_CE: 0.71, Vega_CE: 0.20, Theta_CE: -0.046, Gamma_CE: 0.018, PE: 6.9, Delta_PE: -0.29, Vega_PE: 0.18, Theta_PE: -0.048, Gamma_PE: 0.013 },
    { strike: 2680, CE: 25.4, Delta_CE: 0.73, Vega_CE: 0.21, Theta_CE: -0.048, Gamma_CE: 0.019, PE: 6.2, Delta_PE: -0.27, Vega_PE: 0.19, Theta_PE: -0.049, Gamma_PE: 0.0135 },
    { strike: 2700, CE: 26.2, Delta_CE: 0.75, Vega_CE: 0.22, Theta_CE: -0.05, Gamma_CE: 0.02, PE: 5.5, Delta_PE: -0.25, Vega_PE: 0.20, Theta_PE: -0.05, Gamma_PE: 0.014 },
  ];
  */

  return (
    <div style={containerStyle}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', marginBottom: '24px' }}>Analysis</h1>
      {/* Tab Navigation */}
      <div style={tabNavStyle}>
        <button style={tabBtnStyle(activeTab === 'options')} onClick={() => setActiveTab('options')}>Options</button>
        <button style={tabBtnStyle(activeTab === 'stocks')} onClick={() => setActiveTab('stocks')}>Stocks</button>
        <button style={tabBtnStyle(activeTab === 'greeks')} onClick={() => setActiveTab('greeks')}>Option Greeks</button>
      </div>
      {/* Options Tab: Multi-Leg Option Builder and Option Strategy Creation */}
      {activeTab === 'options' && (
        <>
          {/* Multi-Leg Strategy Builder */}
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ color: '#94a3b8', marginBottom: '24px' }}>Multi-Leg Option Builder</h3>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px' }}>Symbol</label>
                <select
                  value={selectedSymbol}
                  onChange={(e) => setSelectedSymbol(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#ffffff'
                  }}
                >
                  <option value="" style={{
                    color: '#ffffff',
                    background: '#213547',
                  }}>Select Symbol</option>
                  {availableSymbols.map(symbol => (
                    <option key={symbol} value={symbol} style={{
                      color: '#ffffff',
                      background: '#213547',
                    }}>{symbol}</option>
                  ))}
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px' }}>Option Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#ffffff'
                  }}
                >
                  {optionTypes.map(type => (
                    <option key={type} value={type} style={{
                      color: '#ffffff',
                      background: '#213547',
                    }}>{type}</option>
                  ))}
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px' }}>Strike Price</label>
                <select
                  value={selectedStrike}
                  onChange={(e) => setSelectedStrike(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#ffffff'
                  }}
                >
                  <option value="">Select Strike</option>
                  {selectedSymbol && strikePrices[selectedSymbol].map(strike => (
                    <option key={strike} value={strike} style={{
                      color: '#ffffff',
                      background: '#213547',
                    }}>{strike}</option>
                  ))}
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px' }}>Quantity</label>
                <input
                  type="number"
                  value={selectedQuantity}
                  onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                  min="1"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#ffffff'
                  }}
                />
              </div>

              <button
                onClick={addStrategyLeg}
                style={{
                  padding: '8px 16px',
                  background: '#10b981',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  alignSelf: 'flex-end'
                }}
              >
                <Plus size={16} />
                Add Leg
              </button>
            </div>

            {strategyLegs.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ color: '#94a3b8', marginBottom: '16px' }}>Strategy Legs</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {strategyLegs.map(leg => (
                    <div
                      key={leg.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ color: '#ffffff', fontWeight: '500' }}>{leg.symbol}</div>
                        <div style={{
                          color: leg.type === 'CALL' ? '#10b981' : '#ef4444',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          {leg.type === 'CALL' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                          {leg.type}
                        </div>
                        <div style={{ color: '#94a3b8' }}>Strike: ₹{leg.strike}</div>
                        <div style={{ color: '#94a3b8' }}>Qty: {leg.quantity}</div>
                        <div style={{ color: '#94a3b8' }}>Premium: ₹{leg.premium}</div>
                      </div>
                      <button
                        onClick={() => removeStrategyLeg(leg.id)}
                        style={{
                          padding: '8px',
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: 'none',
                          borderRadius: '6px',
                          color: '#ef4444',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {strategyMetrics && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '24px',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px'
              }}>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>Total Cost</div>
                  <div style={{ color: '#ffffff', fontSize: '20px', fontWeight: '500' }}>
                    ₹{Math.abs(strategyMetrics.totalCost).toFixed(2)}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>Max Profit</div>
                  <div style={{ color: '#10b981', fontSize: '20px', fontWeight: '500' }}>
                    ₹{strategyMetrics.maxProfit.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>Max Loss</div>
                  <div style={{ color: '#ef4444', fontSize: '20px', fontWeight: '500' }}>
                    ₹{strategyMetrics.maxLoss.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>Risk/Reward</div>
                  <div style={{ color: '#ffffff', fontSize: '20px', fontWeight: '500' }}>
                    {strategyMetrics.riskRewardRatio.toFixed(2)}
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Option Strategy Creation (reuse multi-leg builder for now, or add more UI here) */}
        </>
      )}
      {/* Stocks Tab: Intraday Strategy Builder and Fundamental Strategy Builder */}
      {activeTab === 'stocks' && (
        <>
          {/* Intraday Trading Builder */}
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ color: '#94a3b8', marginBottom: '24px' }}>Intraday Strategy Builder</h3>

            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px' }}>Stock Symbol</label>
                <select
                  value={selectedStock}
                  onChange={(e) => setSelectedStock(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#ffffff'
                  }}
                >
                  <option value="">Select Stock</option>
                  {availableSymbols.map(symbol => (
                    <option key={symbol} value={symbol} style={{
                      color: '#ffffff',
                      background: '#213547',
                    }}>{symbol}</option>
                  ))}
                </select>
              </div>

              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px' }}>Time Frame</label>
                <select
                  value={timeFrame}
                  onChange={(e) => setTimeFrame(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#ffffff'
                  }}
                >
                  {timeFrames.map(tf => (
                    <option key={tf} value={tf} style={{
                      color: '#ffffff',
                      background: '#213547',
                    }}>{tf}</option>
                  ))}
                </select>
              </div>

              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px' }}>Quantity</label>
                <input
                  type="number"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(Number(e.target.value))}
                  min="1"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#ffffff'
                  }}
                />
              </div>

              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px' }}>Entry Price</label>
                <input
                  type="number"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  placeholder="Enter price"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#ffffff'
                  }}
                />
              </div>

              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px' }}>Target Price</label>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="Enter target"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#ffffff'
                  }}
                />
              </div>

              <div style={{ flex: 1, minWidth: '200px' }}>
                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px' }}>Stop Loss</label>
                <input
                  type="number"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  placeholder="Enter stop loss"
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#ffffff'
                  }}
                />
              </div>

              <button
                onClick={addIntradayStock}
                style={{
                  padding: '8px 16px',
                  background: '#10b981',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  alignSelf: 'flex-end'
                }}
              >
                <Plus size={16} />
                Add Stock
              </button>
            </div>

            {selectedStock && stockData[selectedStock] && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                marginBottom: '24px',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px'
              }}>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>Volatility</div>
                  <div style={{ color: '#ffffff', fontSize: '16px', fontWeight: '500' }}>
                    {stockData[selectedStock].volatility}%
                  </div>
                </div>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>Avg Volume</div>
                  <div style={{ color: '#ffffff', fontSize: '16px', fontWeight: '500' }}>
                    {stockData[selectedStock].avgVolume.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>Support</div>
                  <div style={{ color: '#10b981', fontSize: '16px', fontWeight: '500' }}>
                    ₹{stockData[selectedStock].support}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>Resistance</div>
                  <div style={{ color: '#ef4444', fontSize: '16px', fontWeight: '500' }}>
                    ₹{stockData[selectedStock].resistance}
                  </div>
                </div>
              </div>
            )}

            {intradayStocks.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ color: '#94a3b8', marginBottom: '16px' }}>Selected Stocks</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {intradayStocks.map(stock => (
                    <div
                      key={stock.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <div style={{ color: '#ffffff', fontWeight: '500' }}>{stock.symbol}</div>
                        <div style={{ color: '#94a3b8' }}>Qty: {stock.quantity}</div>
                        <div style={{ color: '#94a3b8' }}>Entry: ₹{stock.entryPrice}</div>
                        <div style={{ color: '#10b981' }}>Target: ₹{stock.targetPrice}</div>
                        <div style={{ color: '#ef4444' }}>SL: ₹{stock.stopLoss}</div>
                        <div style={{ color: '#94a3b8' }}>TF: {stock.timeFrame}</div>
                        <div style={{ color: '#10b981' }}>R/R: {stock.riskReward}</div>
                        <div style={{ color: '#10b981' }}>Profit: ₹{stock.potentialProfit}</div>
                        <div style={{ color: '#ef4444' }}>Loss: ₹{stock.potentialLoss}</div>
                      </div>
                      <button
                        onClick={() => removeIntradayStock(stock.id)}
                        style={{
                          padding: '8px',
                          background: 'rgba(239, 68, 68, 0.1)',
                          border: 'none',
                          borderRadius: '6px',
                          color: '#ef4444',
                          cursor: 'pointer'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {portfolioMetrics && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '24px',
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px'
              }}>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>Total Investment</div>
                  <div style={{ color: '#ffffff', fontSize: '20px', fontWeight: '500' }}>
                    ₹{portfolioMetrics.totalInvestment.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>Potential Profit</div>
                  <div style={{ color: '#10b981', fontSize: '20px', fontWeight: '500' }}>
                    ₹{portfolioMetrics.totalPotentialProfit.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>Potential Loss</div>
                  <div style={{ color: '#ef4444', fontSize: '20px', fontWeight: '500' }}>
                    ₹{portfolioMetrics.totalPotentialLoss.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>Avg Risk/Reward</div>
                  <div style={{ color: '#ffffff', fontSize: '20px', fontWeight: '500' }}>
                    {portfolioMetrics.avgRiskReward.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '8px' }}>Profit %</div>
                  <div style={{ color: '#10b981', fontSize: '20px', fontWeight: '500' }}>
                    {portfolioMetrics.profitPercentage}%
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Fundamental Strategy Builder (placeholder for now) */}
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            padding: '24px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            marginTop: '24px'
          }}>
            <h3 style={{ color: '#94a3b8', marginBottom: '24px' }}>Fundamental Strategy Builder</h3>
            <div style={{ color: '#64748b' }}>[Coming Soon: Build strategies based on fundamental analysis]</div>
          </div>
        </>
      )}
      {/* Option Greeks Tab */}
      {activeTab === 'greeks' && (
        <div style={{
          padding: '24px',
          height: '100%',
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ color: '#f1f5f9', marginBottom: '16px', fontSize: '24px', fontWeight: 'bold' }}>
              Option Greeks & Chain Analysis
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '14px' }}>
              Real-time option chain data with Greeks calculation (Mock data - connect to broker for live data)
            </p>
          </div>

          {/* Controls */}
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px', fontSize: '14px' }}>
                  Symbol
                </label>
                <select
                  value={selectedOptionSymbol}
                  onChange={(e) => setSelectedOptionSymbol(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    minWidth: '120px'
                  }}
                >
                  {availableOptionSymbols.map(symbol => (
                    <option key={symbol} value={symbol} style={{
                      color: '#ffffff',
                      background: '#213547',
                    }}>{symbol}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px', fontSize: '14px' }}>
                  Expiry Date
                </label>
                <input
                  type="date"
                  value={selectedExpiry}
                  onChange={(e) => setSelectedExpiry(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ color: '#94a3b8', fontSize: '14px' }}>
                  <input
                    type="checkbox"
                    checked={includeGreeks}
                    onChange={(e) => setIncludeGreeks(e.target.checked)}
                    style={{ marginRight: '8px' }}
                  />
                  Include Greeks
                </label>
              </div>

              <button
                onClick={handleRefresh}
                style={{
                  padding: '8px 16px',
                  background: '#3b82f6',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Refresh
              </button>
            </div>
          </div>

          {/* Option Chain Display */}
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            flex: 1,
            minHeight: 0,
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ color: '#94a3b8', fontSize: '18px', fontWeight: '600' }}>
                Option Chain - {selectedOptionSymbol}
              </h3>
              {optionChainData && (
                <div style={{ color: '#64748b', fontSize: '12px' }}>
                  Last Updated: {new Date().toLocaleTimeString()}
                </div>
              )}
            </div>

            {optionChainLoading && (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '40px' }}>
                <div style={{ fontSize: '16px', marginBottom: '8px' }}>Loading option chain...</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Using mock data - connect to broker for live data</div>
              </div>
            )}

            {optionChainError && (
              <div style={{
                color: '#ef4444',
                padding: '16px',
                background: 'rgba(239, 68, 68, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(239, 68, 68, 0.2)'
              }}>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>Error Loading Option Chain</div>
                <div style={{ fontSize: '14px' }}>{optionChainError}</div>
              </div>
            )}

            {optionChainData && !optionChainLoading && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Calls */}
                <div>
                  <h4 style={{
                    color: '#10b981',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '16px',
                    padding: '8px 12px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    borderRadius: '6px',
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                  }}>
                    CALL OPTIONS
                  </h4>
                  <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{
                          color: '#64748b',
                          borderBottom: '2px solid #334155',
                          backgroundColor: 'rgba(55, 65, 81, 0.3)'
                        }}>
                          <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600' }}>Strike</th>
                          <th style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600' }}>LTP</th>
                          <th style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600' }}>Bid</th>
                          <th style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600' }}>Ask</th>
                          <th style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600' }}>Vol</th>
                          <th style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600' }}>OI</th>
                          {includeGreeks && (
                            <>
                              <th style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600' }}>Delta</th>
                              <th style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600' }}>Gamma</th>
                              <th style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600' }}>Theta</th>
                              <th style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600' }}>Vega</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {optionChainData.calls?.map((call, index) => (
                          <tr key={index} style={{
                            borderBottom: '1px solid rgba(55, 65, 81, 0.3)',
                            backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
                          }}>
                            <td style={{ padding: '10px 8px', color: '#ffffff', fontWeight: '500' }}>{call.strike}</td>
                            <td style={{ padding: '10px 8px', color: '#10b981', textAlign: 'right', fontWeight: '600' }}>
                              {call.ltp?.toFixed(2) || '-'}
                            </td>
                            <td style={{ padding: '10px 8px', color: '#94a3b8', textAlign: 'right' }}>
                              {call.bid?.toFixed(2) || '-'}
                            </td>
                            <td style={{ padding: '10px 8px', color: '#94a3b8', textAlign: 'right' }}>
                              {call.ask?.toFixed(2) || '-'}
                            </td>
                            <td style={{ padding: '10px 8px', color: '#94a3b8', textAlign: 'right' }}>
                              {call.volume?.toLocaleString() || '-'}
                            </td>
                            <td style={{ padding: '10px 8px', color: '#94a3b8', textAlign: 'right' }}>
                              {call.oi?.toLocaleString() || '-'}
                            </td>
                            {includeGreeks && (
                              <>
                                <td style={{ padding: '10px 8px', color: '#94a3b8', textAlign: 'right' }}>
                                  {call.delta?.toFixed(3) || '-'}
                                </td>
                                <td style={{ padding: '10px 8px', color: '#94a3b8', textAlign: 'right' }}>
                                  {call.gamma?.toFixed(4) || '-'}
                                </td>
                                <td style={{ padding: '10px 8px', color: '#94a3b8', textAlign: 'right' }}>
                                  {call.theta?.toFixed(3) || '-'}
                                </td>
                                <td style={{ padding: '10px 8px', color: '#94a3b8', textAlign: 'right' }}>
                                  {call.vega?.toFixed(2) || '-'}
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Puts */}
                <div>
                  <h4 style={{
                    color: '#ef4444',
                    fontSize: '16px',
                    fontWeight: '600',
                    marginBottom: '16px',
                    padding: '8px 12px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    borderRadius: '6px',
                    border: '1px solid rgba(239, 68, 68, 0.2)'
                  }}>
                    PUT OPTIONS
                  </h4>
                  <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                    <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{
                          color: '#64748b',
                          borderBottom: '2px solid #334155',
                          backgroundColor: 'rgba(55, 65, 81, 0.3)'
                        }}>
                          <th style={{ padding: '12px 8px', textAlign: 'left', fontWeight: '600' }}>Strike</th>
                          <th style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600' }}>LTP</th>
                          <th style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600' }}>Bid</th>
                          <th style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600' }}>Ask</th>
                          <th style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600' }}>Vol</th>
                          <th style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600' }}>OI</th>
                          {includeGreeks && (
                            <>
                              <th style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600' }}>Delta</th>
                              <th style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600' }}>Gamma</th>
                              <th style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600' }}>Theta</th>
                              <th style={{ padding: '12px 8px', textAlign: 'right', fontWeight: '600' }}>Vega</th>
                            </>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {optionChainData.puts?.map((put, index) => (
                          <tr key={index} style={{
                            borderBottom: '1px solid rgba(55, 65, 81, 0.3)',
                            backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
                          }}>
                            <td style={{ padding: '10px 8px', color: '#ffffff', fontWeight: '500' }}>{put.strike}</td>
                            <td style={{ padding: '10px 8px', color: '#ef4444', textAlign: 'right', fontWeight: '600' }}>
                              {put.ltp?.toFixed(2) || '-'}
                            </td>
                            <td style={{ padding: '10px 8px', color: '#94a3b8', textAlign: 'right' }}>
                              {put.bid?.toFixed(2) || '-'}
                            </td>
                            <td style={{ padding: '10px 8px', color: '#94a3b8', textAlign: 'right' }}>
                              {put.ask?.toFixed(2) || '-'}
                            </td>
                            <td style={{ padding: '10px 8px', color: '#94a3b8', textAlign: 'right' }}>
                              {put.volume?.toLocaleString() || '-'}
                            </td>
                            <td style={{ padding: '10px 8px', color: '#94a3b8', textAlign: 'right' }}>
                              {put.oi?.toLocaleString() || '-'}
                            </td>
                            {includeGreeks && (
                              <>
                                <td style={{ padding: '10px 8px', color: '#94a3b8', textAlign: 'right' }}>
                                  {put.delta?.toFixed(3) || '-'}
                                </td>
                                <td style={{ padding: '10px 8px', color: '#94a3b8', textAlign: 'right' }}>
                                  {put.gamma?.toFixed(4) || '-'}
                                </td>
                                <td style={{ padding: '10px 8px', color: '#94a3b8', textAlign: 'right' }}>
                                  {put.theta?.toFixed(3) || '-'}
                                </td>
                                <td style={{ padding: '10px 8px', color: '#94a3b8', textAlign: 'right' }}>
                                  {put.vega?.toFixed(2) || '-'}
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Analysis; 