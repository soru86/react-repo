import React, { useState, useEffect } from 'react';
import TradingChart from '../components/TradingChart';
import PaperTrading from '../components/PaperTrading';
import { indicatorsMap, marketTypesMap } from '../data/constants';
import { BACKEND_BASE_URL } from '../shared/config/api';

const IndianMarketTrading = ({
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
  handlePlaceOrder,
  paperTrading,
  setPaperTrading
}) => {
  // Market section states
  const [selectedMarketType, setSelectedMarketType] = useState('stocks');
  const [selectedInterval, setSelectedInterval] = useState('1m');
  const [indicator, setIndicator] = useState('none');
  const [symbolInput, setSymbolInput] = useState(selectedSymbol || '');
  const [priceData, setPriceData] = useState([]);

  // F&O specific states
  const [fnoType, setFnoType] = useState('futures');
  const [optionType, setOptionType] = useState('CE');
  const [strikePrice, setStrikePrice] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  // Risk management states
  const [targetPrice, setTargetPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [strategyMessage, setStrategyMessage] = useState('');

  useEffect(() => {
    if (selectedSymbol) {
      setSymbolInput(selectedSymbol);
    }
  }, [selectedSymbol]);

  const isIndianStock = (symbol) => {
    const indianStocks = [
      'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'ICICIBANK', 'TATAMOTORS',
      'BAJFINANCE', 'ASIANPAINT', 'HDFCLIFE', 'KOTAKBANK', 'WIPRO',
      'TECHM', 'ONGC', 'NTPC', 'POWERGRID', 'HINDUNILVR', 'ITC'
    ];
    return indianStocks.includes(symbol?.toUpperCase());
  };

  const handleSymbolSubmit = () => {
    if (symbolInput.trim()) {
      setSelectedSymbol(symbolInput.trim().toUpperCase());
    }
  };

  const getMarketFeatures = (marketType) => {
    switch (marketType) {
      case 'stocks':
        return {
          orderTypes: ['MARKET', 'LIMIT', 'STOP_LOSS'],
          timeframes: ['1m', '5m', '15m', '30m', '1h', '1D'],
          exchanges: ['NSE', 'BSE'],
          visualizations: ['price', 'volume', 'technical_indicators']
        };
      case 'fno':
        return {
          orderTypes: ['MARKET', 'LIMIT', 'STOP_LOSS', 'STOP_LIMIT'],
          timeframes: ['1m', '5m', '15m', '30m', '1h', '1D'],
          exchanges: ['NFO', 'BFO'],
          fnoTypes: ['futures', 'options'],
          optionTypes: ['CE', 'PE'],
          visualizations: ['price', 'greeks', 'iv_surface', 'profit_loss']
        };
      case 'index':
        return {
          orderTypes: ['MARKET', 'LIMIT'],
          timeframes: ['1m', '5m', '15m', '30m', '1h', '1D'],
          exchanges: ['NSE_INDEX', 'BSE_INDEX'],
          visualizations: ['price', 'volume', 'technical_indicators']
        };
      case 'mcx':
        return {
          orderTypes: ['MARKET', 'LIMIT', 'STOP_LOSS'],
          timeframes: ['1m', '5m', '15m', '30m', '1h', '1D'],
          exchanges: ['MCX'],
          visualizations: ['price', 'volume', 'order_flow']
        };
      default:
        return {
          orderTypes: ['MARKET', 'LIMIT'],
          timeframes: ['1m', '5m', '15m', '30m', '1h', '1D'],
          exchanges: ['NSE'],
          visualizations: ['price', 'volume']
        };
    }
  };

  const marketFeatures = getMarketFeatures(selectedMarketType);

  const renderFnoControls = () => {
    if (selectedMarketType !== 'fno') return null;

    return (
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '16px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
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
        </div>

        {fnoType === 'options' && (
          <>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setOptionType('CE')}
                style={{
                  padding: '8px 16px',
                  background: optionType === 'CE' ? '#10b981' : 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontWeight: optionType === 'CE' ? '600' : 'normal'
                }}
              >
                CE
              </button>
              <button
                onClick={() => setOptionType('PE')}
                style={{
                  padding: '8px 16px',
                  background: optionType === 'PE' ? '#ef4444' : 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontWeight: optionType === 'PE' ? '600' : 'normal'
                }}
              >
                PE
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <label style={{ color: '#94a3b8', fontSize: '12px' }}>Strike:</label>
              <input
                type="number"
                value={strikePrice}
                onChange={(e) => setStrikePrice(e.target.value)}
                placeholder="Strike Price"
                style={{
                  padding: '6px 12px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '12px',
                  width: '100px'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <label style={{ color: '#94a3b8', fontSize: '12px' }}>Expiry:</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                style={{
                  padding: '6px 12px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
            </div>
          </>
        )}
      </div>
    );
  };

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
        stopLoss: stopLoss ? parseFloat(stopLoss) : null
      };

      // In a real implementation, this would be sent to backend
      // For now, we'll store it locally
      localStorage.setItem(`risk_${selectedSymbol}`, JSON.stringify(riskParams));

      setStrategyMessage(
        `Applied: Target ₹${targetPrice || '-'}, Stoploss ₹${stopLoss || '-'}`
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
          if (handlePlaceOrder) {
            await handlePlaceOrder('BUY');
            await handleApplyRisk();
            setStrategyMessage('Buy order placed with Target & Stoploss!');
          }
          break;
        case 'trail_stop':
          // Activate trailing stop (would need backend support)
          setStrategyMessage('Trailing Stop activated! (Feature requires backend support)');
          break;
        case 'book_profit':
          // Book profit for current positions
          if (handlePlaceOrder) {
            await handlePlaceOrder('SELL');
            setStrategyMessage('Profit booked!');
          }
          break;
        case 'exit_all':
          // Exit all positions (would need backend support to get all positions)
          setStrategyMessage('Exit all positions (Feature requires backend support)');
          break;
        case 'reverse_position':
          // Reverse current position
          if (handlePlaceOrder) {
            const currentSide = 'BUY'; // Would need to check actual position
            await handlePlaceOrder(currentSide === 'BUY' ? 'SELL' : 'BUY');
            setStrategyMessage('Position reversed!');
          }
          break;
        default:
          setStrategyMessage('');
      }
    } catch (error) {
      setStrategyMessage(`Strategy execution failed: ${error.message}`);
    }
  };

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

  const lastPrice = priceData.length > 0
    ? priceData[priceData.length - 1].close
    : (watchlist.find(w => w.symbol === selectedSymbol)?.price || '—');

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
                        padding: '6px 48px 6px 12px',
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
              </div>
            </div>

            {/* Market Type Dropdown */}
            <div style={{
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ color: '#94a3b8', fontWeight: 500, fontSize: '14px' }}>Market Type:</label>
                <select
                  value={selectedMarketType}
                  onChange={e => setSelectedMarketType(e.target.value)}
                  style={{
                    padding: '6px 12px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid #334155',
                    borderRadius: '6px',
                    color: '#fff',
                    fontSize: '14px',
                    outline: 'none',
                    minWidth: '120px'
                  }}
                >
                  {
                    Object.entries(marketTypesMap)?.map(([value, label]) => (
                      <option value={value} key={value} style={{
                        color: '#ffffff',
                        background: '#213547',
                      }}>{label}</option>
                    ))
                  }
                </select>
              </div>

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
                    Object.entries(indicatorsMap)?.map(([value, label]) => (
                      <option value={value} key={value} style={{
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
                  {marketFeatures.timeframes.map((tf) => (
                    <option key={tf} value={tf} style={{
                      color: '#ffffff',
                      background: '#213547',
                    }}>{tf}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label style={{ color: '#94a3b8', fontWeight: 500, fontSize: '14px' }}>Exchange:</label>
                <select
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
                  {marketFeatures.exchanges.map((ex) => (
                    <option key={ex} value={ex} style={{
                      color: '#ffffff',
                      background: '#213547',
                    }}>{ex}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* F&O Controls */}
            {renderFnoControls()}

            <div style={{ flex: 1, minHeight: 0, marginTop: '12px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, minHeight: 0 }}>
                  <TradingChart
                    height="100%"
                    selectedSymbol={selectedSymbol}
                    indicator={indicator}
                    selectedInterval={selectedInterval}
                    marketContext="indian"
                  />
                </div>
              </div>
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
              Total Orders: {recentOrders.length}
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
                  {!recentOrders?.length ? (
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
                    recentOrders?.map((order) => (
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
                      onClick={async () => {
                        if (paperTrading) {
                          // Paper trading handled by PaperTrading component
                          return;
                        }
                        if (!quantity || quantity <= 0) {
                          alert('Please enter a valid quantity');
                          return;
                        }
                        const orderPrice = orderType === 'LIMIT' ? parseFloat(price) : null;
                        if (orderType === 'LIMIT' && (!price || price <= 0)) {
                          alert('Please enter a valid price for limit orders');
                          return;
                        }
                        const orderData = {
                          symbol: selectedSymbol,
                          quantity: parseInt(quantity),
                          orderType: orderType,
                          side: 'BUY',
                          price: orderPrice,
                          exchange: marketFeatures.exchanges[0] || 'NSE',
                          segment: 'EQUITY',
                          productType: 'INTRADAY'
                        };
                        try {
                          const response = await fetch(`${BACKEND_BASE_URL}/indian-market/placeorder`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(orderData)
                          });
                          const result = await response.json();
                          if (result.success) {
                            alert(`BUY order placed successfully${result.broker ? ` through ${result.broker}` : ''}!`);
                            setQuantity('');
                            setPrice('');
                            if (handlePlaceOrder) handlePlaceOrder('BUY');
                          } else {
                            alert(`Order placement failed: ${result.error || 'Unknown error'}`);
                          }
                        } catch (error) {
                          alert('Order placement failed. Please try again.');
                        }
                      }}
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
                      onClick={async () => {
                        if (paperTrading) {
                          // Paper trading handled by PaperTrading component
                          return;
                        }
                        if (!quantity || quantity <= 0) {
                          alert('Please enter a valid quantity');
                          return;
                        }
                        const orderPrice = orderType === 'LIMIT' ? parseFloat(price) : null;
                        if (orderType === 'LIMIT' && (!price || price <= 0)) {
                          alert('Please enter a valid price for limit orders');
                          return;
                        }
                        const orderData = {
                          symbol: selectedSymbol,
                          quantity: parseInt(quantity),
                          orderType: orderType,
                          side: 'SELL',
                          price: orderPrice,
                          exchange: marketFeatures.exchanges[0] || 'NSE',
                          segment: 'EQUITY',
                          productType: 'INTRADAY'
                        };
                        try {
                          const response = await fetch(`${BACKEND_BASE_URL}/indian-market/placeorder`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(orderData)
                          });
                          const result = await response.json();
                          if (result.success) {
                            alert(`SELL order placed successfully${result.broker ? ` through ${result.broker}` : ''}!`);
                            setQuantity('');
                            setPrice('');
                            if (handlePlaceOrder) handlePlaceOrder('SELL');
                          } else {
                            alert(`Order placement failed: ${result.error || 'Unknown error'}`);
                          }
                        } catch (error) {
                          alert('Order placement failed. Please try again.');
                        }
                      }}
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

          {/* Risk Management */}
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ color: '#94a3b8', marginBottom: '12px', fontSize: '14px' }}>Risk Management</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px', fontSize: '12px' }}>Target Price</label>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="Target"
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
              <div>
                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px', fontSize: '12px' }}>Stop Loss</label>
                <input
                  type="number"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(e.target.value)}
                  placeholder="Stop Loss"
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
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button onClick={handleApplyRisk} style={strategyBtnStyle}>
                  Apply Risk
                </button>
              </div>
            </div>
          </div>

          {/* Quick Strategies */}
          <div style={{
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ color: '#94a3b8', marginBottom: '12px', fontSize: '14px' }}>Quick Strategies</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button onClick={() => handleStrategy('buy_target_sl')} style={strategyBtnStyle}>
                Buy with Target & SL
              </button>
              <button onClick={() => handleStrategy('trail_stop')} style={strategyBtnStyle}>
                Trailing Stop
              </button>
              <button onClick={() => handleStrategy('book_profit')} style={strategyBtnStyle}>
                Book Profit
              </button>
              <button onClick={() => handleStrategy('exit_all')} style={strategyBtnStyle}>
                Exit All
              </button>
              <button onClick={() => handleStrategy('reverse_position')} style={strategyBtnStyle}>
                Reverse Position
              </button>
            </div>
            {strategyMessage && (
              <div style={{
                marginTop: '8px',
                padding: '8px',
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid #10b981',
                borderRadius: '6px',
                color: '#10b981',
                fontSize: '12px'
              }}>
                {strategyMessage}
              </div>
            )}
          </div>

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

export default IndianMarketTrading; 