import React, { useState, useEffect, useCallback } from 'react';
import { orderTypesMap } from '../data/constants';

const PaperTrading = ({ selectedSymbol, watchlist, priceData, onOrderPlaced }) => {
  // Paper Trading State
  const [paperTradingOrders, setPaperTradingOrders] = useState([]);
  const [paperPositions, setPaperPositions] = useState([]);
  const [paperBalance, setPaperBalance] = useState(500000); // ₹5,00,000 initial
  const [paperMarginUsed, setPaperMarginUsed] = useState(0);
  const [paperPnL, setPaperPnL] = useState(0);
  const [paperTotalPnL, setPaperTotalPnL] = useState(0);

  // Order Form State
  const [orderType, setOrderType] = useState('MARKET');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [side, setSide] = useState('BUY');

  // Risk Management State
  const [targetPrice, setTargetPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [isTrailing, setIsTrailing] = useState(false);
  const [trailingAmount, setTrailingAmount] = useState('');
  const [isFixedProfit, setIsFixedProfit] = useState(false);
  const [fixedProfitAmount, setFixedProfitAmount] = useState('');
  const [strategyMessage, setStrategyMessage] = useState('');

  // Pending Orders (Limit/Stop Orders)
  const [pendingOrders, setPendingOrders] = useState([]);

  // Real-time price tracking
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [priceChangePercent, setPriceChangePercent] = useState(0);

  // Get current price from priceData or watchlist
  const getCurrentPrice = useCallback(() => {
    if (priceData && priceData.length > 0) {
      return priceData[priceData.length - 1].close;
    }
    return watchlist.find(w => w.symbol === selectedSymbol)?.price || 0;
  }, [priceData, watchlist, selectedSymbol]);

  // Update current price and calculate changes
  useEffect(() => {
    const price = getCurrentPrice();
    setCurrentPrice(price);

    // Calculate price change (simplified - in real app you'd track previous price)
    if (price > 0) {
      const change = price - (price * 0.9875); // Simulate some change
      setPriceChange(change);
      setPriceChangePercent((change / price) * 100);
    }
  }, [getCurrentPrice]);

  // Execute paper trading order
  const executePaperOrder = useCallback((order) => {
    const executionPrice = order.orderType === 'MARKET' ? currentPrice : order.price;
    const orderValue = executionPrice * order.quantity;
    const marginRequired = orderValue * 0.2; // 20% margin

    // Check if enough balance
    if (paperBalance < orderValue) {
      alert('Insufficient paper balance for this order');
      return;
    }

    const executedOrder = {
      id: Date.now() + Math.random(),
      symbol: selectedSymbol,
      side: order.side,
      quantity: parseInt(order.quantity),
      price: executionPrice,
      orderType: order.orderType,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'FILLED',
      paperTrading: true,
      targetPrice: order.targetPrice,
      stopLoss: order.stopLoss,
      trailingStop: order.trailingStop,
      fixedProfit: order.fixedProfit
    };

    // Update orders
    setPaperTradingOrders(prev => [executedOrder, ...prev]);

    // Update positions
    setPaperPositions(prev => {
      const existingPosition = prev.find(p => p.symbol === selectedSymbol && p.side === order.side);

      if (existingPosition) {
        // Update existing position
        const newQuantity = existingPosition.quantity + order.quantity;
        const newEntryPrice = ((existingPosition.entryPrice * existingPosition.quantity) + (executionPrice * order.quantity)) / newQuantity;

        return prev.map(p =>
          p.symbol === selectedSymbol && p.side === order.side
            ? { ...p, quantity: newQuantity, entryPrice: newEntryPrice }
            : p
        );
      } else {
        // Create new position
        return [...prev, {
          id: Date.now() + Math.random(),
          symbol: selectedSymbol,
          side: order.side,
          quantity: order.quantity,
          entryPrice: executionPrice,
          unrealizedPnL: 0,
          marginUsed: marginRequired,
          targetPrice: order.targetPrice,
          stopLoss: order.stopLoss,
          trailingStop: order.trailingStop,
          fixedProfit: order.fixedProfit
        }];
      }
    });

    // Update balance
    setPaperBalance(prev => prev - orderValue);

    // Notify parent component
    if (onOrderPlaced) {
      onOrderPlaced(executedOrder);
    }
  }, [currentPrice, selectedSymbol, paperBalance, onOrderPlaced]);

  // Process pending orders based on current price
  useEffect(() => {
    if (currentPrice <= 0) return;

    const processPendingOrders = () => {
      setPendingOrders(prev => {
        const newOrders = [...prev];
        const executedOrders = [];

        for (let i = newOrders.length - 1; i >= 0; i--) {
          const order = newOrders[i];
          let shouldExecute = false;

          switch (order.orderType) {
            case 'LIMIT':
              if (order.side === 'BUY' && currentPrice <= order.price) {
                shouldExecute = true;
              } else if (order.side === 'SELL' && currentPrice >= order.price) {
                shouldExecute = true;
              }
              break;
            case 'STOP':
              if (order.side === 'BUY' && currentPrice >= order.price) {
                shouldExecute = true;
              } else if (order.side === 'SELL' && currentPrice <= order.price) {
                shouldExecute = true;
              }
              break;
            case 'STOP_LIMIT':
              if (order.side === 'BUY' && currentPrice >= order.stopPrice && currentPrice <= order.limitPrice) {
                shouldExecute = true;
              } else if (order.side === 'SELL' && currentPrice <= order.stopPrice && currentPrice >= order.limitPrice) {
                shouldExecute = true;
              }
              break;
          }

          if (shouldExecute) {
            executedOrders.push(order);
            newOrders.splice(i, 1);
          }
        }

        // Execute the orders
        executedOrders.forEach(order => {
          executePaperOrder(order);
        });

        return newOrders;
      });
    };

    processPendingOrders();
  }, [currentPrice, executePaperOrder]);

  // Calculate PnL for all positions
  useEffect(() => {
    if (currentPrice <= 0) return;

    const calculatePnL = () => {
      let totalPnL = 0;
      let totalMarginUsed = 0;

      const updatedPositions = paperPositions.map(position => {
        const unrealizedPnL = position.side === 'BUY'
          ? (currentPrice - position.entryPrice) * position.quantity
          : (position.entryPrice - currentPrice) * position.quantity;

        const marginUsed = position.entryPrice * position.quantity * 0.2; // 20% margin
        totalMarginUsed += marginUsed;

        return {
          ...position,
          unrealizedPnL,
          marginUsed
        };
      });

      totalPnL = updatedPositions.reduce((sum, pos) => sum + pos.unrealizedPnL, 0);

      setPaperPositions(updatedPositions);
      setPaperPnL(totalPnL);
      setPaperMarginUsed(totalMarginUsed);
      setPaperTotalPnL(prev => prev + totalPnL);
    };

    calculatePnL();
  }, [currentPrice]);

  // Handle order placement
  const handlePlaceOrder = () => {
    if (!quantity || quantity <= 0) {
      alert('Please enter a valid quantity');
      return;
    }

    if (orderType === 'LIMIT' && (!price || price <= 0)) {
      alert('Please enter a valid price for limit orders');
      return;
    }

    const order = {
      id: Date.now(),
      symbol: selectedSymbol,
      side,
      quantity: parseInt(quantity),
      price: orderType === 'LIMIT' ? parseFloat(price) : currentPrice,
      orderType,
      targetPrice: targetPrice ? parseFloat(targetPrice) : null,
      stopLoss: stopLoss ? parseFloat(stopLoss) : null,
      trailingStop: isTrailing ? parseFloat(trailingAmount) : null,
      fixedProfit: isFixedProfit ? parseFloat(fixedProfitAmount) : null
    };

    if (orderType === 'MARKET') {
      executePaperOrder(order);
    } else {
      // Add to pending orders
      setPendingOrders(prev => [...prev, order]);
      alert(`${orderType} order placed and will be executed when conditions are met`);
    }

    // Clear form
    setQuantity('');
    setPrice('');
  };

  // Handle risk management
  const handleApplyRisk = () => {
    setStrategyMessage(
      `Applied: Target ₹${targetPrice || '-'}, Stoploss ₹${stopLoss || '-'}, ` +
      `${isTrailing ? `Trailing Stop ₹${trailingAmount}` : ''} ` +
      `${isFixedProfit ? `Fixed Profit ₹${fixedProfitAmount}` : ''}`
    );
  };

  // Handle strategy actions
  const handleStrategy = (type) => {
    switch (type) {
      case 'buy_target_sl':
        if (!targetPrice || !stopLoss) {
          alert('Please set both target price and stop loss');
          return;
        }
        setSide('BUY');
        setStrategyMessage('Buy with Target & Stoploss set!');
        break;
      case 'trail_stop':
        if (!trailingAmount) {
          alert('Please set trailing amount');
          return;
        }
        setStrategyMessage('Trailing Stop activated!');
        break;
      case 'book_profit':
        // Close all profitable positions
        const profitablePositions = paperPositions.filter(pos => pos.unrealizedPnL > 0);
        if (profitablePositions.length === 0) {
          alert('No profitable positions to close');
          return;
        }
        setStrategyMessage(`Booked profit for ${profitablePositions.length} positions!`);
        break;
      case 'exit_all':
        if (paperPositions.length === 0) {
          alert('No positions to exit');
          return;
        }
        setStrategyMessage('All positions exited!');
        break;
      case 'reverse_position':
        if (paperPositions.length === 0) {
          alert('No positions to reverse');
          return;
        }
        setStrategyMessage('Position reversed!');
        break;
      default:
        setStrategyMessage('');
    }
  };

  // Close position
  const closePosition = (position) => {
    const closeValue = currentPrice * position.quantity;
    const realizedPnL = position.side === 'BUY'
      ? (currentPrice - position.entryPrice) * position.quantity
      : (position.entryPrice - currentPrice) * position.quantity;

    // Update balance
    setPaperBalance(prev => prev + closeValue);

    // Remove position
    setPaperPositions(prev => prev.filter(p => p.id !== position.id));

    // Add to orders
    const closeOrder = {
      id: Date.now() + Math.random(),
      symbol: selectedSymbol,
      side: position.side === 'BUY' ? 'SELL' : 'BUY',
      quantity: position.quantity,
      price: currentPrice,
      orderType: 'MARKET',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'FILLED',
      paperTrading: true,
      realizedPnL
    };

    setPaperTradingOrders(prev => [closeOrder, ...prev]);
  };

  // Strategy button style
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Paper Trading Status */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ color: '#94a3b8', fontSize: '14px' }}>Paper Trading Status</h3>
          <div style={{
            background: '#10b981',
            color: '#1e293b',
            fontWeight: 700,
            fontSize: '12px',
            padding: '6px 18px',
            borderRadius: '999px'
          }}>
            ACTIVE
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>Paper Balance</div>
            <div style={{ color: '#10b981', fontSize: '18px', fontWeight: '600' }}>₹{paperBalance.toLocaleString()}</div>
          </div>
          <div>
            <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>Margin Used</div>
            <div style={{ color: '#fbbf24', fontSize: '18px', fontWeight: '600' }}>₹{paperMarginUsed.toLocaleString()}</div>
          </div>
          <div>
            <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>Total P&L</div>
            <div style={{
              color: paperTotalPnL >= 0 ? '#10b981' : '#ef4444',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              ₹{paperTotalPnL.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Current Price Display */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '4px' }}>Current Price</div>
            <div style={{ color: '#10b981', fontSize: '24px', fontWeight: '700' }}>₹{currentPrice.toFixed(2)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              color: priceChange >= 0 ? '#10b981' : '#ef4444',
              fontSize: '16px',
              fontWeight: '600'
            }}>
              {priceChange >= 0 ? '+' : ''}₹{priceChange.toFixed(2)}
            </div>
            <div style={{
              color: priceChangePercent >= 0 ? '#10b981' : '#ef4444',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      {/* Order Placement */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ color: '#94a3b8', marginBottom: '12px', fontSize: '14px' }}>Place Paper Order</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setSide('BUY')}
              style={{
                flex: 1,
                padding: '8px',
                background: side === 'BUY' ? '#10b981' : '#334155',
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
              onClick={() => setSide('SELL')}
              style={{
                flex: 1,
                padding: '8px',
                background: side === 'SELL' ? '#ef4444' : '#334155',
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
              {
                Object.entries(orderTypesMap)?.map(([value, label]) => (
                  <option value={value} style={{
                    color: '#ffffff',
                    background: '#213547',
                  }}>{label}</option>
                ))
              }
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

          {orderType !== 'MARKET' && (
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

          <button
            onClick={handlePlaceOrder}
            style={{
              width: '100%',
              padding: '10px',
              background: '#3b82f6',
              border: 'none',
              borderRadius: '6px',
              color: '#ffffff',
              fontWeight: '500',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Place {side} Order
          </button>
        </div>
      </div>

      {/* Risk Management */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ color: '#94a3b8', marginBottom: '12px', fontSize: '14px' }}>Risk Management</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <label style={{ color: '#94a3b8', fontSize: '12px' }}>Target Price</label>
            <input
              type="number"
              value={targetPrice}
              onChange={e => setTargetPrice(e.target.value)}
              placeholder="Enter target price"
              style={{ width: '100%', padding: '6px 8px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ color: '#94a3b8', fontSize: '12px' }}>Stop Loss</label>
            <input
              type="number"
              value={stopLoss}
              onChange={e => setStopLoss(e.target.value)}
              placeholder="Enter stop loss"
              style={{ width: '100%', padding: '6px 8px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={isTrailing}
              onChange={e => setIsTrailing(e.target.checked)}
            />
            <label style={{ color: '#94a3b8', fontSize: '12px' }}>Trailing Stop</label>
            {isTrailing && (
              <input
                type="number"
                value={trailingAmount}
                onChange={e => setTrailingAmount(e.target.value)}
                placeholder="Trail amount"
                style={{ width: '100px', marginLeft: '8px', padding: '6px 8px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
              />
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={isFixedProfit}
              onChange={e => setIsFixedProfit(e.target.checked)}
            />
            <label style={{ color: '#94a3b8', fontSize: '12px' }}>Fixed Profit</label>
            {isFixedProfit && (
              <input
                type="number"
                value={fixedProfitAmount}
                onChange={e => setFixedProfitAmount(e.target.value)}
                placeholder="Profit amount"
                style={{ width: '100px', marginLeft: '8px', padding: '6px 8px', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '6px', color: '#fff', fontSize: '13px' }}
              />
            )}
          </div>

          <button
            onClick={handleApplyRisk}
            style={{ marginTop: '8px', padding: '8px', background: '#3b82f6', border: 'none', borderRadius: '6px', color: '#fff', fontWeight: '500', cursor: 'pointer', fontSize: '13px' }}
          >
            Apply Risk Settings
          </button>
        </div>

        {/* Strategy Buttons */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
          <button onClick={() => handleStrategy('buy_target_sl')} style={strategyBtnStyle}>Buy+Target+SL</button>
          <button onClick={() => handleStrategy('trail_stop')} style={strategyBtnStyle}>Trail Stop</button>
          <button onClick={() => handleStrategy('book_profit')} style={strategyBtnStyle}>Book Profit</button>
          <button onClick={() => handleStrategy('exit_all')} style={strategyBtnStyle}>Exit All</button>
          <button onClick={() => handleStrategy('reverse_position')} style={strategyBtnStyle}>Reverse</button>
        </div>

        {strategyMessage && (
          <div style={{ color: '#10b981', fontSize: '13px', marginTop: '8px' }}>{strategyMessage}</div>
        )}
      </div>

      {/* Active Positions */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ color: '#94a3b8', marginBottom: '12px', fontSize: '14px' }}>Active Positions</h3>

        {paperPositions.length === 0 ? (
          <div style={{ color: '#64748b', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
            No active positions
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {paperPositions.map((position, index) => (
              <div key={position.id || `position-${index}`} style={{
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{
                    color: position.side === 'BUY' ? '#10b981' : '#ef4444',
                    fontWeight: '600',
                    fontSize: '14px'
                  }}>
                    {position.side} {position.symbol}
                  </div>
                  <button
                    onClick={() => closePosition(position)}
                    style={{
                      padding: '4px 8px',
                      background: '#ef4444',
                      border: 'none',
                      borderRadius: '4px',
                      color: '#ffffff',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: '500'
                    }}
                  >
                    Close
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Qty: </span>
                    <span style={{ color: '#ffffff' }}>{position.quantity}</span>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Entry: </span>
                    <span style={{ color: '#ffffff' }}>₹{position.entryPrice.toFixed(2)}</span>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Current: </span>
                    <span style={{ color: '#ffffff' }}>₹{currentPrice.toFixed(2)}</span>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>P&L: </span>
                    <span style={{
                      color: position.unrealizedPnL >= 0 ? '#10b981' : '#ef4444',
                      fontWeight: '500'
                    }}>
                      ₹{position.unrealizedPnL.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Orders */}
      {pendingOrders.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{ color: '#94a3b8', marginBottom: '12px', fontSize: '14px' }}>Pending Orders</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {pendingOrders.map((order, index) => (
              <div key={order.id || `pending-${index}`} style={{
                padding: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '6px',
                fontSize: '12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{
                    color: order.side === 'BUY' ? '#10b981' : '#ef4444',
                    fontWeight: '500'
                  }}>
                    {order.side} {order.quantity} @ ₹{order.price}
                  </div>
                  <div style={{ color: '#fbbf24', fontSize: '11px' }}>
                    {order.orderType}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ color: '#94a3b8', marginBottom: '12px', fontSize: '14px' }}>Recent Orders</h3>

        {paperTradingOrders.length === 0 ? (
          <div style={{ color: '#64748b', fontSize: '14px', textAlign: 'center', padding: '20px' }}>
            No orders yet
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', color: '#fff', fontSize: '12px' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <th style={{ padding: '6px', textAlign: 'left', color: '#94a3b8', fontWeight: 500 }}>Time</th>
                  <th style={{ padding: '6px', textAlign: 'left', color: '#94a3b8', fontWeight: 500 }}>Symbol</th>
                  <th style={{ padding: '6px', textAlign: 'left', color: '#94a3b8', fontWeight: 500 }}>Side</th>
                  <th style={{ padding: '6px', textAlign: 'right', color: '#94a3b8', fontWeight: 500 }}>Qty</th>
                  <th style={{ padding: '6px', textAlign: 'right', color: '#94a3b8', fontWeight: 500 }}>Price</th>
                  <th style={{ padding: '6px', textAlign: 'center', color: '#94a3b8', fontWeight: 500 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {paperTradingOrders.slice(0, 10).map((order, index) => (
                  <tr key={order.id || `order-${index}`} style={{
                    background: 'rgba(16, 185, 129, 0.05)',
                    borderLeft: '3px solid #10b981'
                  }}>
                    <td style={{ padding: '6px', color: '#94a3b8' }}>{order.time}</td>
                    <td style={{ padding: '6px' }}>{order.symbol}</td>
                    <td style={{ padding: '6px', color: order.side === 'BUY' ? '#10b981' : '#ef4444', fontWeight: 500 }}>{order.side}</td>
                    <td style={{ padding: '6px', textAlign: 'right' }}>{order.quantity}</td>
                    <td style={{ padding: '6px', textAlign: 'right' }}>₹{order.price}</td>
                    <td style={{
                      padding: '6px',
                      textAlign: 'center',
                      color: '#10b981',
                      fontWeight: 500,
                      fontSize: '11px'
                    }}>
                      PAPER
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaperTrading; 