import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, RefreshCw, TrendingUp, TrendingDown } from 'lucide-react';
import { BACKEND_BASE_URL } from '../config/api';

const SignalTable = ({ 
  symbol = 'NIFTY', 
  expiry = null, 
  includeGreeks = true,
  onRefresh = null 
}) => {
  const [signalData, setSignalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchSignalTable = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Use mock signal table data
      const mockSignalData = {
        symbol: symbol,
        expiry: expiry || '2024-12-26',
        signals: [
          {
            strike: 19000,
            callSignal: 'BUY',
            putSignal: 'SELL',
            callStrength: 0.8,
            putStrength: 0.6,
            callVolume: 1200,
            putVolume: 800,
            callOI: 2500,
            putOI: 1800,
            callIV: 0.28,
            putIV: 0.25,
            callDelta: 0.85,
            putDelta: -0.15,
            callGamma: 0.0001,
            putGamma: 0.0001,
            callTheta: -12.5,
            putTheta: -10.2,
            callVega: 45.2,
            putVega: 42.1
          },
          {
            strike: 19200,
            callSignal: 'HOLD',
            putSignal: 'BUY',
            callStrength: 0.5,
            putStrength: 0.7,
            callVolume: 1500,
            putVolume: 1100,
            callOI: 2800,
            putOI: 2200,
            callIV: 0.31,
            putIV: 0.29,
            callDelta: 0.72,
            putDelta: -0.28,
            callGamma: 0.0002,
            putGamma: 0.0002,
            callTheta: -15.8,
            putTheta: -13.5,
            callVega: 52.1,
            putVega: 48.9
          },
          {
            strike: 19400,
            callSignal: 'SELL',
            putSignal: 'HOLD',
            callStrength: 0.3,
            putStrength: 0.4,
            callVolume: 1800,
            putVolume: 1400,
            callOI: 3200,
            putOI: 2600,
            callIV: 0.34,
            putIV: 0.32,
            callDelta: 0.58,
            putDelta: -0.42,
            callGamma: 0.0003,
            putGamma: 0.0003,
            callTheta: -18.2,
            putTheta: -16.8,
            callVega: 58.9,
            putVega: 55.7
          },
          {
            strike: 19600,
            callSignal: 'SELL',
            putSignal: 'BUY',
            callStrength: 0.2,
            putStrength: 0.8,
            callVolume: 2000,
            putVolume: 1700,
            callOI: 3500,
            putOI: 3000,
            callIV: 0.37,
            putIV: 0.35,
            callDelta: 0.42,
            putDelta: -0.58,
            callGamma: 0.0004,
            putGamma: 0.0004,
            callTheta: -20.5,
            putTheta: -19.2,
            callVega: 65.7,
            putVega: 62.5
          },
          {
            strike: 19800,
            callSignal: 'SELL',
            putSignal: 'BUY',
            callStrength: 0.1,
            putStrength: 0.9,
            callVolume: 2200,
            putVolume: 2000,
            callOI: 3800,
            putOI: 3400,
            callIV: 0.40,
            putIV: 0.38,
            callDelta: 0.28,
            putDelta: -0.72,
            callGamma: 0.0005,
            putGamma: 0.0005,
            callTheta: -22.8,
            putTheta: -21.5,
            callVega: 72.5,
            putVega: 69.3
          }
        ]
      };
      
      setSignalData(mockSignalData);
    } catch (error) {
      console.error('Error fetching signal table:', error);
      setError('Signal table data not available. Please connect to a broker for real-time data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRealtimeSignalTable = async () => {
    try {
      // Use mock data updates
      const mockRealtimeData = {
        symbol: symbol,
        expiry: expiry || '2024-12-26',
        signals: [
          {
            strike: 19000,
            callSignal: 'BUY',
            putSignal: 'SELL',
            callStrength: 0.8 + (Math.random() - 0.5) * 0.1,
            putStrength: 0.6 + (Math.random() - 0.5) * 0.1,
            callVolume: 1200 + Math.floor(Math.random() * 100),
            putVolume: 800 + Math.floor(Math.random() * 100),
            callOI: 2500 + Math.floor(Math.random() * 200),
            putOI: 1800 + Math.floor(Math.random() * 200),
            callIV: 0.28 + (Math.random() - 0.5) * 0.02,
            putIV: 0.25 + (Math.random() - 0.5) * 0.02,
            callDelta: 0.85 + (Math.random() - 0.5) * 0.05,
            putDelta: -0.15 + (Math.random() - 0.5) * 0.05,
            callGamma: 0.0001 + (Math.random() - 0.5) * 0.00001,
            putGamma: 0.0001 + (Math.random() - 0.5) * 0.00001,
            callTheta: -12.5 + (Math.random() - 0.5) * 2,
            putTheta: -10.2 + (Math.random() - 0.5) * 2,
            callVega: 45.2 + (Math.random() - 0.5) * 5,
            putVega: 42.1 + (Math.random() - 0.5) * 5
          },
          {
            strike: 19200,
            callSignal: 'HOLD',
            putSignal: 'BUY',
            callStrength: 0.5 + (Math.random() - 0.5) * 0.1,
            putStrength: 0.7 + (Math.random() - 0.5) * 0.1,
            callVolume: 1500 + Math.floor(Math.random() * 100),
            putVolume: 1100 + Math.floor(Math.random() * 100),
            callOI: 2800 + Math.floor(Math.random() * 200),
            putOI: 2200 + Math.floor(Math.random() * 200),
            callIV: 0.31 + (Math.random() - 0.5) * 0.02,
            putIV: 0.29 + (Math.random() - 0.5) * 0.02,
            callDelta: 0.72 + (Math.random() - 0.5) * 0.05,
            putDelta: -0.28 + (Math.random() - 0.5) * 0.05,
            callGamma: 0.0002 + (Math.random() - 0.5) * 0.00001,
            putGamma: 0.0002 + (Math.random() - 0.5) * 0.00001,
            callTheta: -15.8 + (Math.random() - 0.5) * 2,
            putTheta: -13.5 + (Math.random() - 0.5) * 2,
            callVega: 52.1 + (Math.random() - 0.5) * 5,
            putVega: 48.9 + (Math.random() - 0.5) * 5
          },
          {
            strike: 19400,
            callSignal: 'SELL',
            putSignal: 'HOLD',
            callStrength: 0.3 + (Math.random() - 0.5) * 0.1,
            putStrength: 0.4 + (Math.random() - 0.5) * 0.1,
            callVolume: 1800 + Math.floor(Math.random() * 100),
            putVolume: 1400 + Math.floor(Math.random() * 100),
            callOI: 3200 + Math.floor(Math.random() * 200),
            putOI: 2600 + Math.floor(Math.random() * 200),
            callIV: 0.34 + (Math.random() - 0.5) * 0.02,
            putIV: 0.32 + (Math.random() - 0.5) * 0.02,
            callDelta: 0.58 + (Math.random() - 0.5) * 0.05,
            putDelta: -0.42 + (Math.random() - 0.5) * 0.05,
            callGamma: 0.0003 + (Math.random() - 0.5) * 0.00001,
            putGamma: 0.0003 + (Math.random() - 0.5) * 0.00001,
            callTheta: -18.2 + (Math.random() - 0.5) * 2,
            putTheta: -16.8 + (Math.random() - 0.5) * 2,
            callVega: 58.9 + (Math.random() - 0.5) * 5,
            putVega: 55.7 + (Math.random() - 0.5) * 5
          },
          {
            strike: 19600,
            callSignal: 'SELL',
            putSignal: 'BUY',
            callStrength: 0.2 + (Math.random() - 0.5) * 0.1,
            putStrength: 0.8 + (Math.random() - 0.5) * 0.1,
            callVolume: 2000 + Math.floor(Math.random() * 100),
            putVolume: 1700 + Math.floor(Math.random() * 100),
            callOI: 3500 + Math.floor(Math.random() * 200),
            putOI: 3000 + Math.floor(Math.random() * 200),
            callIV: 0.37 + (Math.random() - 0.5) * 0.02,
            putIV: 0.35 + (Math.random() - 0.5) * 0.02,
            callDelta: 0.42 + (Math.random() - 0.5) * 0.05,
            putDelta: -0.58 + (Math.random() - 0.5) * 0.05,
            callGamma: 0.0004 + (Math.random() - 0.5) * 0.00001,
            putGamma: 0.0004 + (Math.random() - 0.5) * 0.00001,
            callTheta: -20.5 + (Math.random() - 0.5) * 2,
            putTheta: -19.2 + (Math.random() - 0.5) * 2,
            callVega: 65.7 + (Math.random() - 0.5) * 5,
            putVega: 62.5 + (Math.random() - 0.5) * 5
          },
          {
            strike: 19800,
            callSignal: 'SELL',
            putSignal: 'BUY',
            callStrength: 0.1 + (Math.random() - 0.5) * 0.1,
            putStrength: 0.9 + (Math.random() - 0.5) * 0.1,
            callVolume: 2200 + Math.floor(Math.random() * 100),
            putVolume: 2000 + Math.floor(Math.random() * 100),
            callOI: 3800 + Math.floor(Math.random() * 200),
            putOI: 3400 + Math.floor(Math.random() * 200),
            callIV: 0.40 + (Math.random() - 0.5) * 0.02,
            putIV: 0.38 + (Math.random() - 0.5) * 0.02,
            callDelta: 0.28 + (Math.random() - 0.5) * 0.05,
            putDelta: -0.72 + (Math.random() - 0.5) * 0.05,
            callGamma: 0.0005 + (Math.random() - 0.5) * 0.00001,
            putGamma: 0.0005 + (Math.random() - 0.5) * 0.00001,
            callTheta: -22.8 + (Math.random() - 0.5) * 2,
            putTheta: -21.5 + (Math.random() - 0.5) * 2,
            callVega: 72.5 + (Math.random() - 0.5) * 5,
            putVega: 69.3 + (Math.random() - 0.5) * 5
          }
        ]
      };
      
      setSignalData(mockRealtimeData);
    } catch (error) {
      console.error('Error fetching real-time signal table:', error);
    }
  };

  useEffect(() => {
    fetchSignalTable();
  }, [symbol, expiry, includeGreeks]);

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        fetchRealtimeSignalTable();
      }, 5000); // Update every 5 seconds

      return () => clearInterval(interval);
    }
  }, [autoRefresh, symbol, expiry]);

  const handleRefresh = () => {
    fetchSignalTable();
    if (onRefresh) onRefresh();
  };

  const getChangeColor = (change) => {
    if (!change) return '#94a3b8';
    return change > 0 ? '#10b981' : '#ef4444';
  };

  const getChangeIcon = (change) => {
    if (!change) return null;
    return change > 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />;
  };

  const formatNumber = (value, decimals = 2) => {
    if (value === null || value === undefined) return '-';
    return typeof value === 'number' ? value.toFixed(decimals) : value;
  };

  const formatVolume = (value) => {
    if (value === null || value === undefined) return '-';
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toLocaleString();
  };

  if (loading && !signalData) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px',
        color: '#94a3b8'
      }}>
        Loading signal table...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px',
        color: '#ef4444'
      }}>
        Error: {error}
      </div>
    );
  }

  if (!signalData || !signalData.signals || signalData.signals.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '200px',
        color: '#94a3b8'
      }}>
        No signal table data available
      </div>
    );
  }

  return (
    <div style={{ 
      background: 'rgba(15, 23, 42, 0.8)', 
      borderRadius: '12px', 
      padding: '20px',
      border: '1px solid rgba(55, 65, 81, 0.3)'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px' 
      }}>
        <div>
          <h3 style={{ 
            color: '#ffffff', 
            margin: '0 0 4px 0',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            {signalData.symbol} Signal Table
          </h3>
          <p style={{ 
            color: '#94a3b8', 
            margin: '0',
            fontSize: '14px'
          }}>
            Expiry: {signalData.expiry} | {signalData.timestamp}
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            style={{
              padding: '8px 12px',
              background: autoRefresh ? 'rgba(16, 185, 129, 0.2)' : 'rgba(55, 65, 81, 0.3)',
              border: '1px solid',
              borderColor: autoRefresh ? 'rgba(16, 185, 129, 0.4)' : 'rgba(55, 65, 81, 0.5)',
              borderRadius: '6px',
              color: autoRefresh ? '#10b981' : '#94a3b8',
              cursor: 'pointer',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <TrendingUp size={14} />
            Auto
          </button>
          
          <button
            onClick={handleRefresh}
            disabled={loading}
            style={{
              padding: '8px 12px',
              background: 'rgba(55, 65, 81, 0.3)',
              border: '1px solid rgba(55, 65, 81, 0.5)',
              borderRadius: '6px',
              color: '#94a3b8',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              opacity: loading ? 0.5 : 1
            }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Signal Table */}
      <div style={{ 
        maxHeight: '600px', 
        overflowY: 'auto',
        border: '1px solid rgba(55, 65, 81, 0.3)',
        borderRadius: '8px'
      }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          fontSize: '12px'
        }}>
          <thead>
            <tr style={{ 
              background: 'rgba(55, 65, 81, 0.4)',
              borderBottom: '2px solid rgba(55, 65, 81, 0.5)'
            }}>
              {/* PUTS Header */}
              <th colSpan="6" style={{ 
                padding: '12px 8px', 
                color: '#ef4444', 
                fontWeight: '600',
                textAlign: 'center',
                borderRight: '2px solid rgba(55, 65, 81, 0.5)',
                background: 'rgba(239, 68, 68, 0.1)'
              }}>
                PUT OPTIONS
              </th>
              
              {/* STRIKE Header */}
              <th style={{ 
                padding: '12px 8px', 
                color: '#ffffff', 
                fontWeight: '600',
                textAlign: 'center',
                background: 'rgba(15, 23, 42, 0.8)',
                borderLeft: '2px solid rgba(55, 65, 81, 0.5)',
                borderRight: '2px solid rgba(55, 65, 81, 0.5)'
              }}>
                STRIKE
              </th>
              
              {/* CALLS Header */}
              <th colSpan="6" style={{ 
                padding: '12px 8px', 
                color: '#10b981', 
                fontWeight: '600',
                textAlign: 'center',
                borderLeft: '2px solid rgba(55, 65, 81, 0.5)',
                background: 'rgba(16, 185, 129, 0.1)'
              }}>
                CALL OPTIONS
              </th>
            </tr>
            
            <tr style={{ 
              background: 'rgba(55, 65, 81, 0.3)',
              borderBottom: '1px solid rgba(55, 65, 81, 0.5)'
            }}>
              {/* PUTS Column Headers */}
              <th style={{ padding: '8px 4px', color: '#64748b', fontSize: '10px', textAlign: 'center' }}>LTP</th>
              <th style={{ padding: '8px 4px', color: '#64748b', fontSize: '10px', textAlign: 'center' }}>CHG</th>
              <th style={{ padding: '8px 4px', color: '#64748b', fontSize: '10px', textAlign: 'center' }}>BID</th>
              <th style={{ padding: '8px 4px', color: '#64748b', fontSize: '10px', textAlign: 'center' }}>ASK</th>
              <th style={{ padding: '8px 4px', color: '#64748b', fontSize: '10px', textAlign: 'center' }}>VOL</th>
              <th style={{ padding: '8px 4px', color: '#64748b', fontSize: '10px', textAlign: 'center' }}>OI</th>
              
              {/* STRIKE Header */}
              <th style={{ 
                padding: '8px 4px', 
                color: '#ffffff', 
                fontWeight: '600',
                textAlign: 'center',
                background: 'rgba(15, 23, 42, 0.9)',
                borderLeft: '1px solid rgba(55, 65, 81, 0.5)',
                borderRight: '1px solid rgba(55, 65, 81, 0.5)'
              }}>
                STRIKE
              </th>
              
              {/* CALLS Column Headers */}
              <th style={{ padding: '8px 4px', color: '#64748b', fontSize: '10px', textAlign: 'center' }}>LTP</th>
              <th style={{ padding: '8px 4px', color: '#64748b', fontSize: '10px', textAlign: 'center' }}>CHG</th>
              <th style={{ padding: '8px 4px', color: '#64748b', fontSize: '10px', textAlign: 'center' }}>BID</th>
              <th style={{ padding: '8px 4px', color: '#64748b', fontSize: '10px', textAlign: 'center' }}>ASK</th>
              <th style={{ padding: '8px 4px', color: '#64748b', fontSize: '10px', textAlign: 'center' }}>VOL</th>
              <th style={{ padding: '8px 4px', color: '#64748b', fontSize: '10px', textAlign: 'center' }}>OI</th>
            </tr>
          </thead>
          
          <tbody>
            {signalData.signals.map((row, index) => (
              <tr key={index} style={{ 
                borderBottom: '1px solid rgba(55, 65, 81, 0.3)',
                backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
              }}>
                {/* PUTS Data */}
                <td style={{ 
                  padding: '8px 4px', 
                  color: '#ef4444', 
                  textAlign: 'right', 
                  fontWeight: '600',
                  fontSize: '11px'
                }}>
                  {formatNumber(row.put.ltp)}
                </td>
                <td style={{ 
                  padding: '8px 4px', 
                  color: getChangeColor(row.put.change), 
                  textAlign: 'right',
                  fontSize: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '2px'
                }}>
                  {getChangeIcon(row.put.change)}
                  {formatNumber(row.put.change, 2)}
                </td>
                <td style={{ 
                  padding: '8px 4px', 
                  color: '#94a3b8', 
                  textAlign: 'right',
                  fontSize: '10px'
                }}>
                  {formatNumber(row.put.bid)}
                </td>
                <td style={{ 
                  padding: '8px 4px', 
                  color: '#94a3b8', 
                  textAlign: 'right',
                  fontSize: '10px'
                }}>
                  {formatNumber(row.put.ask)}
                </td>
                <td style={{ 
                  padding: '8px 4px', 
                  color: '#94a3b8', 
                  textAlign: 'right',
                  fontSize: '10px'
                }}>
                  {formatVolume(row.put.volume)}
                </td>
                <td style={{ 
                  padding: '8px 4px', 
                  color: '#94a3b8', 
                  textAlign: 'right',
                  fontSize: '10px'
                }}>
                  {formatVolume(row.put.oi)}
                </td>
                
                {/* STRIKE */}
                <td style={{ 
                  padding: '8px 4px', 
                  color: '#ffffff', 
                  fontWeight: '600',
                  textAlign: 'center',
                  background: 'rgba(15, 23, 42, 0.9)',
                  borderLeft: '1px solid rgba(55, 65, 81, 0.5)',
                  borderRight: '1px solid rgba(55, 65, 81, 0.5)',
                  fontSize: '11px'
                }}>
                  {row.strike}
                </td>
                
                {/* CALLS Data */}
                <td style={{ 
                  padding: '8px 4px', 
                  color: '#10b981', 
                  textAlign: 'right', 
                  fontWeight: '600',
                  fontSize: '11px'
                }}>
                  {formatNumber(row.call.ltp)}
                </td>
                <td style={{ 
                  padding: '8px 4px', 
                  color: getChangeColor(row.call.change), 
                  textAlign: 'right',
                  fontSize: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '2px'
                }}>
                  {getChangeIcon(row.call.change)}
                  {formatNumber(row.call.change, 2)}
                </td>
                <td style={{ 
                  padding: '8px 4px', 
                  color: '#94a3b8', 
                  textAlign: 'right',
                  fontSize: '10px'
                }}>
                  {formatNumber(row.call.bid)}
                </td>
                <td style={{ 
                  padding: '8px 4px', 
                  color: '#94a3b8', 
                  textAlign: 'right',
                  fontSize: '10px'
                }}>
                  {formatNumber(row.call.ask)}
                </td>
                <td style={{ 
                  padding: '8px 4px', 
                  color: '#94a3b8', 
                  textAlign: 'right',
                  fontSize: '10px'
                }}>
                  {formatVolume(row.call.volume)}
                </td>
                <td style={{ 
                  padding: '8px 4px', 
                  color: '#94a3b8', 
                  textAlign: 'right',
                  fontSize: '10px'
                }}>
                  {formatVolume(row.call.oi)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Greeks Table (if enabled) */}
      {includeGreeks && signalData.signals.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <h4 style={{ 
            color: '#ffffff', 
            margin: '0 0 12px 0',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            Greeks Data
          </h4>
          <div style={{ 
            maxHeight: '300px', 
            overflowY: 'auto',
            border: '1px solid rgba(55, 65, 81, 0.3)',
            borderRadius: '8px'
          }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              fontSize: '11px'
            }}>
              <thead>
                <tr style={{ 
                  background: 'rgba(55, 65, 81, 0.4)',
                  borderBottom: '2px solid rgba(55, 65, 81, 0.5)'
                }}>
                  <th colSpan="5" style={{ 
                    padding: '8px 4px', 
                    color: '#ef4444', 
                    fontWeight: '600',
                    textAlign: 'center',
                    borderRight: '2px solid rgba(55, 65, 81, 0.5)',
                    background: 'rgba(239, 68, 68, 0.1)'
                  }}>
                    PUT GREEKS
                  </th>
                  <th style={{ 
                    padding: '8px 4px', 
                    color: '#ffffff', 
                    fontWeight: '600',
                    textAlign: 'center',
                    background: 'rgba(15, 23, 42, 0.8)',
                    borderLeft: '2px solid rgba(55, 65, 81, 0.5)',
                    borderRight: '2px solid rgba(55, 65, 81, 0.5)'
                  }}>
                    STRIKE
                  </th>
                  <th colSpan="5" style={{ 
                    padding: '8px 4px', 
                    color: '#10b981', 
                    fontWeight: '600',
                    textAlign: 'center',
                    borderLeft: '2px solid rgba(55, 65, 81, 0.5)',
                    background: 'rgba(16, 185, 129, 0.1)'
                  }}>
                    CALL GREEKS
                  </th>
                </tr>
                <tr style={{ 
                  background: 'rgba(55, 65, 81, 0.3)',
                  borderBottom: '1px solid rgba(55, 65, 81, 0.5)'
                }}>
                  <th style={{ padding: '6px 4px', color: '#64748b', fontSize: '9px', textAlign: 'center' }}>DELTA</th>
                  <th style={{ padding: '6px 4px', color: '#64748b', fontSize: '9px', textAlign: 'center' }}>GAMMA</th>
                  <th style={{ padding: '6px 4px', color: '#64748b', fontSize: '9px', textAlign: 'center' }}>THETA</th>
                  <th style={{ padding: '6px 4px', color: '#64748b', fontSize: '9px', textAlign: 'center' }}>VEGA</th>
                  <th style={{ padding: '6px 4px', color: '#64748b', fontSize: '9px', textAlign: 'center' }}>IV</th>
                  <th style={{ 
                    padding: '6px 4px', 
                    color: '#ffffff', 
                    fontWeight: '600',
                    textAlign: 'center',
                    background: 'rgba(15, 23, 42, 0.9)',
                    borderLeft: '1px solid rgba(55, 65, 81, 0.5)',
                    borderRight: '1px solid rgba(55, 65, 81, 0.5)'
                  }}>
                    STRIKE
                  </th>
                  <th style={{ padding: '6px 4px', color: '#64748b', fontSize: '9px', textAlign: 'center' }}>DELTA</th>
                  <th style={{ padding: '6px 4px', color: '#64748b', fontSize: '9px', textAlign: 'center' }}>GAMMA</th>
                  <th style={{ padding: '6px 4px', color: '#64748b', fontSize: '9px', textAlign: 'center' }}>THETA</th>
                  <th style={{ padding: '6px 4px', color: '#64748b', fontSize: '9px', textAlign: 'center' }}>VEGA</th>
                  <th style={{ padding: '6px 4px', color: '#64748b', fontSize: '9px', textAlign: 'center' }}>IV</th>
                </tr>
              </thead>
              <tbody>
                {signalData.signals.map((row, index) => (
                  <tr key={index} style={{ 
                    borderBottom: '1px solid rgba(55, 65, 81, 0.3)',
                    backgroundColor: index % 2 === 0 ? 'rgba(255, 255, 255, 0.02)' : 'transparent'
                  }}>
                    {/* PUT GREEKS */}
                    <td style={{ padding: '6px 4px', color: '#94a3b8', textAlign: 'right', fontSize: '9px' }}>
                      {formatNumber(row.put.delta, 3)}
                    </td>
                    <td style={{ padding: '6px 4px', color: '#94a3b8', textAlign: 'right', fontSize: '9px' }}>
                      {formatNumber(row.put.gamma, 4)}
                    </td>
                    <td style={{ padding: '6px 4px', color: '#94a3b8', textAlign: 'right', fontSize: '9px' }}>
                      {formatNumber(row.put.theta, 3)}
                    </td>
                    <td style={{ padding: '6px 4px', color: '#94a3b8', textAlign: 'right', fontSize: '9px' }}>
                      {formatNumber(row.put.vega, 2)}
                    </td>
                    <td style={{ padding: '6px 4px', color: '#94a3b8', textAlign: 'right', fontSize: '9px' }}>
                      {formatNumber(row.put.iv, 2)}
                    </td>
                    
                    {/* STRIKE */}
                    <td style={{ 
                      padding: '6px 4px', 
                      color: '#ffffff', 
                      fontWeight: '600',
                      textAlign: 'center',
                      background: 'rgba(15, 23, 42, 0.9)',
                      borderLeft: '1px solid rgba(55, 65, 81, 0.5)',
                      borderRight: '1px solid rgba(55, 65, 81, 0.5)',
                      fontSize: '9px'
                    }}>
                      {row.strike}
                    </td>
                    
                    {/* CALL GREEKS */}
                    <td style={{ padding: '6px 4px', color: '#94a3b8', textAlign: 'right', fontSize: '9px' }}>
                      {formatNumber(row.call.delta, 3)}
                    </td>
                    <td style={{ padding: '6px 4px', color: '#94a3b8', textAlign: 'right', fontSize: '9px' }}>
                      {formatNumber(row.call.gamma, 4)}
                    </td>
                    <td style={{ padding: '6px 4px', color: '#94a3b8', textAlign: 'right', fontSize: '9px' }}>
                      {formatNumber(row.call.theta, 3)}
                    </td>
                    <td style={{ padding: '6px 4px', color: '#94a3b8', textAlign: 'right', fontSize: '9px' }}>
                      {formatNumber(row.call.vega, 2)}
                    </td>
                    <td style={{ padding: '6px 4px', color: '#94a3b8', textAlign: 'right', fontSize: '9px' }}>
                      {formatNumber(row.call.iv, 2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignalTable; 