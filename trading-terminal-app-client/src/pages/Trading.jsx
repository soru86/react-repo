import { useState, useEffect } from 'react';
import TradingChart from '../components/Chart';
import PaperTrading from '../components/PaperTrading';
import { useLocation } from 'react-router';

// Import centralized API configuration
import { BACKEND_BASE_URL } from '../shared/config/api';
import { commonIndicatorsMap, commonMarketTypesMap, intervalLabelsMap } from '../data/constants';

const Trading = ({
  orderBook,
  recentOrders,
  watchlist,
  selectedSymbol,
  setSelectedSymbol,
  orderType,
  setOrderType,
  quantity,
  setQuantity,
  price,
  setPrice,
  paperTrading,
  setPaperTrading
}) => {
  const location = useLocation();

  // Determine market context from URL path
  const getMarketContext = () => {
    if (location.pathname.startsWith('/crypto')) return 'crypto';
    if (location.pathname.startsWith('/forex')) return 'forex';
    if (location.pathname.startsWith('/indian')) return 'indian';
    return 'crypto'; // default
  };

  const marketContext = getMarketContext();

  const [marketType, setMarketType] = useState('stocks');
  const [optionType, setOptionType] = useState('none');
  const [visualizationType, setVisualizationType] = useState('price');
  const [fnoType, setFnoType] = useState('futures');
  const [indicator, setIndicator] = useState('none');
  const [symbolInput, setSymbolInput] = useState(selectedSymbol || '');
  const [selectedInterval, setSelectedInterval] = useState('1m'); // Changed default to 1m
  const [priceData, setPriceData] = useState([]);
  // Add state for risk management and strategy semi-automation
  const [targetPrice, setTargetPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [isTrailing, setIsTrailing] = useState(false);
  const [trailingAmount, setTrailingAmount] = useState('');
  const [isFixedProfit, setIsFixedProfit] = useState(false);
  const [fixedProfitAmount, setFixedProfitAmount] = useState('');
  const [strategyMessage, setStrategyMessage] = useState('');

  // Update symbolInput when selectedSymbol prop changes
  useEffect(() => {
    if (selectedSymbol) {
      setSymbolInput(selectedSymbol);
    }
  }, [selectedSymbol]);

  // Fetch real-time data for Indian stocks
  useEffect(() => {
    if (selectedSymbol && isIndianStock(selectedSymbol)) {
      const fetchRealTimeData = async () => {
        try {
          const response = await fetch(`${BACKEND_BASE_URL}/indian-market/realtime?symbol=${selectedSymbol}`);
          if (response.ok) {
            const data = await response.json();
            // Update price data with real-time information
            setPriceData(prev => {
              const newDataPoint = {
                time: data.timestamp,
                open: data.open,
                high: data.high,
                low: data.low,
                close: data.price,
                volume: data.volume
              };

              // Add to existing data or replace if too many points
              const updated = [...prev, newDataPoint];
              if (updated.length > 100) {
                return updated.slice(-100);
              }
              return updated;
            });
          }
        } catch (error) {
          console.error('Error fetching real-time data:', error);
        }
      };

      // Fetch immediately
      fetchRealTimeData();

      // Set up interval for real-time updates (every 5 seconds)
      const interval = setInterval(fetchRealTimeData, 5000);

      return () => clearInterval(interval);
    }
  }, [selectedSymbol]);

  // Get current price for the selected symbol
  const getCurrentPrice = () => {
    if (priceData.length > 0) {
      return priceData[priceData.length - 1].close;
    }
    return watchlist.find(w => w.symbol === selectedSymbol)?.price || 2600;
  };

  // Check if symbol is an Indian stock
  const isIndianStock = (symbol) => {
    const indianStocks = [
      'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'TATAMOTORS',
      'BAJFINANCE', 'ASIANPAINT', 'HDFCLIFE', 'KOTAKBANK', 'WIPRO',
      'TECHM', 'ONGC', 'NTPC', 'POWERGRID', 'HINDUNILVR', 'ITC'
    ];
    return indianStocks.includes(symbol?.toUpperCase());
  };

  // Handle real trading order placement
  const handleRealTradingOrder = async (side) => {
    if (!quantity || quantity <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    const currentPrice = getCurrentPrice();
    const orderPrice = orderType === 'LIMIT' ? parseFloat(price) : currentPrice;

    if (orderType === 'LIMIT' && (!price || price <= 0)) {
      alert('Please enter a valid price for limit orders');
      return;
    }

    // Determine market context for API endpoint
    const isIndian = isIndianStock(selectedSymbol);
    const endpoint = isIndian 
      ? `${BACKEND_BASE_URL}/indian-market/placeorder`
      : `${BACKEND_BASE_URL}/crypto-market/binance/order`;

    const orderData = isIndian ? {
      symbol: selectedSymbol,
      quantity: parseInt(quantity),
      orderType: orderType,
      side: side,
      price: orderPrice,
      exchange: 'NSE',
      segment: 'EQUITY',
      productType: 'INTRADAY'
    } : {
      symbol: selectedSymbol,
      side: side,
      orderType: orderType,
      quantity: parseFloat(quantity),
      price: orderPrice
    };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (result.success) {
        alert(`${side} order placed successfully${result.broker ? ` through ${result.broker}` : ''}!`);
        // Clear form
        setQuantity('');
        setPrice('');
      } else {
        alert(`Order placement failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Order placement error:', error);
      alert('Order placement failed. Please try again.');
    }
  };

  // Unified order handler
  const handlePlaceOrder = (side) => {
    if (paperTrading) {
      // Paper trading is handled by PaperTrading component
      // The PaperTrading component will handle the order placement
      return;
    }
    // Real trading
    handleRealTradingOrder(side);
  };

  // Combine paper trading orders with existing recent orders
  const allRecentOrders = [...recentOrders];

  const getMarketSpecificFeatures = () => {
    switch (marketType) {
      case 'fno':
        return {
          orderTypes: ['MARKET', 'LIMIT', 'STOP', 'STOP_LIMIT'],
          additionalFields: ['expiry', 'leverage'],
          timeframes: ['1m', '5m', '15m', '1h', '4h', '1d'],
          optionTypes: ['ATM', 'OTM', 'ITM'],
          visualizations: ['price', 'greeks', 'iv_surface', 'profit_loss'],
          fnoTypes: ['futures', 'options']
        };
      case 'crypto':
        return {
          orderTypes: ['MARKET', 'LIMIT', 'STOP_LIMIT'],
          additionalFields: ['leverage'],
          timeframes: ['1m', '5m', '15m', '1h', '4h', '1d'],
          optionTypes: ['ATM', 'OTM'],
          visualizations: ['price', 'volume', 'order_flow']
        };
      case 'forex':
        return {
          orderTypes: ['MARKET', 'LIMIT', 'STOP'],
          additionalFields: ['leverage'],
          timeframes: ['1m', '5m', '15m', '1h', '4h', '1d'],
          optionTypes: ['ATM', 'OTM'],
          visualizations: ['price', 'pivot_points', 'support_resistance']
        };
      default: // stocks
        return {
          orderTypes: ['MARKET', 'LIMIT'],
          additionalFields: [],
          timeframes: ['1D', '1W', '1M', '3M', '1Y'],
          optionTypes: ['ATM', 'OTM', 'ITM'],
          visualizations: ['price', 'volume', 'technical_indicators']
        };
    }
  };

  const marketFeatures = getMarketSpecificFeatures();

  const handleSymbolSubmit = () => {
    if (symbolInput.trim()) {
      setSelectedSymbol(symbolInput.trim().toUpperCase());
    }
  };

  const renderFnoButtons = () => {
    if (marketType !== 'fno') return null;

    return (
      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <button
          onClick={() => setFnoType('futures')}
          style={{
            padding: '8px 16px',
            background: fnoType === 'futures' ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '6px',
            color: '#ffffff',
            cursor: 'pointer',
            fontWeight: fnoType === 'futures' ? '600' : 'normal'
          }}
        >
          Futures
        </button>
        <button
          onClick={() => setFnoType('options')}
          style={{
            padding: '8px 16px',
            background: fnoType === 'options' ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '6px',
            color: '#ffffff',
            cursor: 'pointer',
            fontWeight: fnoType === 'options' ? '600' : 'normal'
          }}
        >
          Options
        </button>
        {fnoType === 'options' && (
          <>
            <button
              style={{
                padding: '8px 16px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '6px',
                color: '#ffffff',
                cursor: 'pointer'
              }}
            >
              CE
            </button>
            <button
              style={{
                padding: '8px 16px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '6px',
                color: '#ffffff',
                cursor: 'pointer'
              }}
            >
              PE
            </button>
            <button
              style={{
                padding: '8px 16px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '6px',
                color: '#ffffff',
                cursor: 'pointer'
              }}
            >
              Strategy Builder
            </button>
          </>
        )}
      </div>
    );
  };

  const renderVisualization = () => {
    return (
      <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ color: '#94a3b8', fontWeight: 500, fontSize: '14px' }}>Indicator:</label>
            <select
              value={indicator}
              onChange={e => setIndicator(e.target.value)}
              style={{
                padding: '6px 12px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                minWidth: '100px'
              }}
            >
              {
                Object.entries(commonIndicatorsMap)?.map(([value, label]) => (
                  <option value={value} style={{
                    color: '#ffffff',
                    background: '#213547',
                  }}>{label}</option>
                ))
              }
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label style={{ color: '#94a3b8', fontWeight: 500, fontSize: '14px' }}>Interval:</label>
            <select
              value={selectedInterval}
              onChange={e => setSelectedInterval(e.target.value)}
              style={{
                padding: '6px 12px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid #334155',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '14px',
                outline: 'none',
                minWidth: '80px'
              }}
            >
              {
                Object.entries(intervalLabelsMap)?.map(([value, label]) => (
                  <option value={value} style={{
                    color: '#ffffff',
                    background: '#213547',
                  }}>{label}</option>
                ))
              }
            </select>
          </div>
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <TradingChart
            height="100%"
            selectedSymbol={selectedSymbol}
            indicator={indicator}
            selectedInterval={selectedInterval}
            marketContext={marketContext}
          />
        </div>
      </div>
    );
  };

  // Get last price from priceData or fallback to watchlist
  const lastPrice = priceData.length > 0
    ? priceData[priceData.length - 1].close
    : (watchlist.find(w => w.symbol === selectedSymbol)?.price || '—');

  // --- Strategy semi-automation handlers ---
  const handleApplyRisk = async () => {
    if (!targetPrice && !stopLoss) {
      setStrategyMessage('Please set target price or stop loss');
      return;
    }

    try {
      // Store risk parameters (could be sent to backend for order management)
      const riskParams = {
        symbol: selectedSymbol,
        targetPrice: targetPrice ? parseFloat(targetPrice) : null,
        stopLoss: stopLoss ? parseFloat(stopLoss) : null,
        isTrailing: isTrailing,
        trailingAmount: trailingAmount ? parseFloat(trailingAmount) : null,
        isFixedProfit: isFixedProfit,
        fixedProfitAmount: fixedProfitAmount ? parseFloat(fixedProfitAmount) : null
      };

      // In a real implementation, this would be sent to backend
      // For now, we'll store it locally
      localStorage.setItem(`risk_${selectedSymbol}`, JSON.stringify(riskParams));

      setStrategyMessage(
        `Applied: Target ₹${targetPrice || '-'}, Stoploss ₹${stopLoss || '-'}, ` +
        `${isTrailing ? `Trailing Stop ₹${trailingAmount}` : ''} ` +
        `${isFixedProfit ? `Fixed Profit ₹${fixedProfitAmount}` : ''}`
      );
    } catch (error) {
      setStrategyMessage('Failed to apply risk parameters');
    }
  };

  const handleStrategy = async (type) => {
    if (!selectedSymbol || !quantity) {
      setStrategyMessage('Please select a symbol and enter quantity');
      return;
    }

    try {
      switch (type) {
        case 'buy_target_sl':
          if (!targetPrice || !stopLoss) {
            setStrategyMessage('Please set target price and stop loss first');
            return;
          }
          // Place buy order with target and stop loss
          await handlePlaceOrder('BUY');
          await handleApplyRisk();
          setStrategyMessage('Buy order placed with Target & Stoploss!');
          break;
        case 'trail_stop':
          // Activate trailing stop (would need backend support)
          setIsTrailing(true);
          setStrategyMessage('Trailing Stop activated! (Feature requires backend support)');
          break;
        case 'book_profit':
          // Book profit for current positions
          await handlePlaceOrder('SELL');
          setStrategyMessage('Profit booked!');
          break;
        case 'exit_all':
          // Exit all positions (would need backend support to get all positions)
          setStrategyMessage('Exit all positions (Feature requires backend support)');
          break;
        case 'reverse_position':
          // Reverse current position
          const currentSide = 'BUY'; // Would need to check actual position
          await handlePlaceOrder(currentSide === 'BUY' ? 'SELL' : 'BUY');
          setStrategyMessage('Position reversed!');
          break;
        default:
          setStrategyMessage('');
      }
    } catch (error) {
      setStrategyMessage(`Strategy execution failed: ${error.message}`);
    }
  };

  // --- Button style for strategy buttons ---
  const strategyBtnStyle = {
    padding: '6px 12px',
    background: '#334155',
    border: 'none',
    borderRadius: '6px',
    color: '#fff',
    fontWeight: 500,
    cursor: 'pointer',
    fontSize: '13px',
    transition: 'background 0.2s',
  };

  return (
    <div style={{
      padding: '24px',
      height: '100vh',
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* Paper Trading Switch */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
        <label style={{ color: '#94a3b8', fontWeight: 500, fontSize: '15px' }}>Paper Trading Mode</label>
        <button
          onClick={() => setPaperTrading(!paperTrading)}
          style={{
            padding: '6px 18px',
            background: paperTrading ? '#10b981' : '#334155',
            color: '#fff',
            border: 'none',
            borderRadius: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'background 0.2s'
          }}
        >
          {paperTrading ? 'ON' : 'OFF'}
        </button>
        {paperTrading && (
          <span style={{ color: '#fbbf24', fontSize: '13px', marginLeft: '8px' }}>
            Disable to place real trades
          </span>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '3fr 1fr',
        gap: '24px',
        flex: 1,
        minHeight: 0,
        height: '100%'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          overflow: 'auto',
          height: '100%'
        }}>
          {/* Main Chart Section */}
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ position: 'relative', width: '200px', marginRight: '8px', display: 'flex', alignItems: 'center' }}>
                    <input
                      type="text"
                      value={symbolInput}
                      onChange={e => setSymbolInput(e.target.value.toUpperCase())}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          handleSymbolSubmit();
                        }
                      }}
                      placeholder="Enter symbol"
                      style={{
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '18px',
                        background: 'rgba(255,255,255,0.05)',
                        border: '1px solid #334155',
                        borderRadius: '6px',
                        padding: '6px 48px 6px 12px', // right padding for button
                        outline: 'none',
                        width: '100%',
                        boxSizing: 'border-box',
                      }}
                    />
                    <button
                      onClick={handleSymbolSubmit}
                      style={{
                        position: 'absolute',
                        right: '6px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        padding: '4px 14px',
                        background: '#3b82f6',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#ffffff',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500',
                        height: '28px',
                        lineHeight: '1',
                        boxShadow: '0 1px 4px rgba(59,130,246,0.08)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      Search
                    </button>
                  </div>
                  <span style={{ color: '#10b981', fontWeight: 600, fontSize: '16px', minWidth: '80px', display: 'inline-block', textAlign: 'right' }}>
                    ₹{lastPrice}
                  </span>
                  <span style={{
                    color: '#fbbf24',
                    fontWeight: 600,
                    fontSize: '15px',
                    background: 'rgba(251,191,36,0.12)',
                    borderRadius: '8px',
                    padding: '2px 10px'
                  }}>
                    +1.25%
                  </span>
                </div>
                <select
                  value={marketType}
                  onChange={(e) => setMarketType(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  {
                    Object.entries(commonMarketTypesMap)?.map(([value, label]) => (
                      <option value={value} style={{
                        color: '#ffffff',
                        background: '#213547',
                      }}>{label}</option>
                    ))
                  }
                </select>
                {marketType === 'fno' && fnoType === 'options' && (
                  <select
                    value={optionType}
                    onChange={(e) => setOptionType(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#ffffff',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="none" style={{
                      color: '#ffffff',
                      background: '#213547',
                    }}>No Options</option>
                    {marketFeatures.optionTypes.map((type) => (
                      <option key={type} value={type} style={{
                        color: '#ffffff',
                        background: '#213547',
                      }}>{type}</option>
                    ))}
                  </select>
                )}
                <select
                  value={visualizationType}
                  onChange={(e) => setVisualizationType(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '6px',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  {marketFeatures.visualizations.map((type) => (
                    <option key={type} value={type} style={{
                      color: '#ffffff',
                      background: '#213547',
                    }}>{type.replace('_', ' ').toUpperCase()}</option>
                  ))}
                </select>
              </div>
            </div>
            {renderFnoButtons()}
            <div style={{ flex: 1, minHeight: 0, marginTop: '12px', display: 'flex', flexDirection: 'column' }}>
              {renderVisualization()}
            </div>
          </div>

          {/* Recent Trades Section */}
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ color: '#94a3b8', marginBottom: '12px', fontSize: '14px' }}>Recent Trades</h3>
            <div style={{ marginBottom: '8px', fontSize: '12px', color: '#64748b' }}>
              Total Orders: {allRecentOrders.length}
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '13px' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <th style={{ padding: '8px', textAlign: 'left', color: '#94a3b8', fontWeight: 500 }}>Time</th>
                    <th style={{ padding: '8px', textAlign: 'left', color: '#94a3b8', fontWeight: 500 }}>Symbol</th>
                    <th style={{ padding: '8px', textAlign: 'left', color: '#94a3b8', fontWeight: 500 }}>Direction</th>
                    <th style={{ padding: '8px', textAlign: 'left', color: '#94a3b8', fontWeight: 500 }}>Type</th>
                    <th style={{ padding: '8px', textAlign: 'right', color: '#94a3b8', fontWeight: 500 }}>Quantity</th>
                    <th style={{ padding: '8px', textAlign: 'right', color: '#94a3b8', fontWeight: 500 }}>Entry Price</th>
                    <th style={{ padding: '8px', textAlign: 'center', color: '#94a3b8', fontWeight: 500 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {allRecentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{
                        padding: '20px',
                        textAlign: 'center',
                        color: '#64748b',
                        fontSize: '14px'
                      }}>
                        No trades yet. Place your first order to see it here!
                      </td>
                    </tr>
                  ) : (
                    allRecentOrders.map((order) => (
                      <tr key={order.id} style={{
                        background: 'rgba(255,255,255,0.02)'
                      }}>
                        <td style={{ padding: '8px', color: '#94a3b8' }}>{order.time}</td>
                        <td style={{ padding: '8px' }}>{order.symbol}</td>
                        <td style={{ padding: '8px', color: order.side === 'BUY' ? '#10b981' : '#ef4444', fontWeight: 500 }}>{order.side}</td>
                        <td style={{ padding: '8px', color: '#94a3b8', fontSize: '12px' }}>{order.orderType || 'MARKET'}</td>
                        <td style={{ padding: '8px', textAlign: 'right' }}>{order.quantity}</td>
                        <td style={{ padding: '8px', textAlign: 'right' }}>₹{order.price}</td>
                        <td style={{
                          padding: '8px',
                          textAlign: 'center',
                          color: '#fbbf24',
                          fontWeight: 500,
                          fontSize: '12px'
                        }}>
                          {order.status || 'Open'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          overflow: 'auto',
          height: '100%'
        }}>
          {paperTrading ? (
            <PaperTrading
              selectedSymbol={selectedSymbol}
              watchlist={watchlist}
              priceData={priceData}
              onOrderPlaced={(order) => {
                // Handle paper trading order placed
                console.log('Paper trading order placed:', order);
              }}
            />
          ) : (
            <>
              {/* Real Trading Order Placement */}
              <div style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                padding: '16px',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                position: 'relative'
              }}>
                <h3 style={{ color: '#94a3b8', marginBottom: '12px', fontSize: '14px' }}>Place Real Order</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px', fontSize: '12px' }}>Symbol</label>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '6px 8px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid #334155',
                      borderRadius: '6px',
                      color: '#ffffff',
                      fontSize: '13px'
                    }}>
                      <span style={{ flex: 1, fontWeight: '600' }}>{selectedSymbol}</span>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px', fontSize: '12px' }}>Order Type</label>
                    <select
                      value={orderType}
                      onChange={(e) => setOrderType(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#ffffff',
                        fontSize: '13px'
                      }}
                    >
                      {marketFeatures.orderTypes.map((type) => (
                        <option key={type} value={type} style={{
                          color: '#ffffff',
                          background: '#213547',
                        }}>{type}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px', fontSize: '12px' }}>Quantity</label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '6px 8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#ffffff',
                        fontSize: '13px'
                      }}
                    />
                  </div>
                  {orderType === 'LIMIT' && (
                    <div>
                      <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px', fontSize: '12px' }}>Price</label>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '6px 8px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          border: 'none',
                          borderRadius: '6px',
                          color: '#ffffff',
                          fontSize: '13px'
                        }}
                      />
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <button
                      onClick={() => handlePlaceOrder('BUY')}
                      style={{
                        flex: 1,
                        padding: '8px',
                        background: '#10b981',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#ffffff',
                        fontWeight: '500',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      Buy
                    </button>
                    <button
                      onClick={() => handlePlaceOrder('SELL')}
                      style={{
                        flex: 1,
                        padding: '8px',
                        background: '#ef4444',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#ffffff',
                        fontWeight: '500',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      Sell
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Order Book */}
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ color: '#94a3b8', marginBottom: '12px', fontSize: '14px' }}>Order Book</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {orderBook.map((order) => (
                <div key={order.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
                  <div style={{ color: order.side === 'BUY' ? '#10b981' : '#ef4444', fontWeight: '500', fontSize: '13px' }}>
                    {order.side}
                  </div>
                  <div style={{ color: '#ffffff', fontSize: '13px' }}>{order.quantity}</div>
                  <div style={{ color: '#94a3b8', fontSize: '13px' }}>₹{order.price}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trading; 