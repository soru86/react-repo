import React, { useState, useEffect } from 'react';
import { XCircle, Play, AlertTriangle, Info } from 'lucide-react';
import { useTheme } from '../../shared/context/ThemeContext';
import { useLocation } from 'react-router';
import { BACKEND_BASE_URL } from '../../shared/config/api';

const DeployStrategyModal = ({
  isOpen,
  onClose,
  onDeploy,
  loading,
  error,
  selectedStrategy
}) => {
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const [loggedInExchange, setLoggedInExchange] = useState(null);
  const [exchangeLoading, setExchangeLoading] = useState(false);

  // Determine market context and exchange from URL path
  const getMarketContext = () => {
    if (location.pathname.startsWith('/crypto')) return 'crypto';
    if (location.pathname.startsWith('/forex')) return 'forex';
    if (location.pathname.startsWith('/indian')) return 'indian';
    return 'crypto'; // default
  };

  const getExchangeForMarket = (market) => {
    switch (market) {
      case 'crypto':
        return 'binance'; // Default to binance for crypto
      case 'forex':
        return 'oanda'; // Default forex exchange
      case 'indian':
        return 'dhan'; // Default Indian exchange
      default:
        return 'binance';
    }
  };

  const marketContext = getMarketContext();
  const defaultExchange = getExchangeForMarket(marketContext);

  // Check for logged-in exchange status
  useEffect(() => {
    const checkExchangeStatus = async () => {
      if (!isOpen) return;

      setExchangeLoading(true);
      try {
        let exchangeStatus = null;

        // Check exchange status based on market context
        switch (marketContext) {
          case 'crypto':
            // Check Binance status
            const binanceResponse = await fetch(`${BACKEND_BASE_URL}/crypto-market/binance/status`);
            if (binanceResponse.ok) {
              const binanceData = await binanceResponse.json();
              if (binanceData.status === 'connected') {
                exchangeStatus = 'binance';
              }
            }
            break;
          case 'forex':
            // Check OANDA status (if endpoint exists)
            try {
              const oandaResponse = await fetch(`${BACKEND_BASE_URL}/forex-market/oanda/status`);
              if (oandaResponse.ok) {
                const oandaData = await oandaResponse.json();
                if (oandaData.status === 'connected') {
                  exchangeStatus = 'oanda';
                }
              }
            } catch (error) {
              console.log('OANDA status endpoint not available');
            }
            break;
          case 'indian':
            // Check Dhan status
            try {
              const dhanResponse = await fetch(`${BACKEND_BASE_URL}/indian-market/dhan/status`);
              if (dhanResponse.ok) {
                const dhanData = await dhanResponse.json();
                if (dhanData.isLoggedIn) {
                  exchangeStatus = 'dhan';
                }
              }
            } catch (error) {
              console.log('Dhan status endpoint not available');
            }
            break;
          default:
            break;
        }

        setLoggedInExchange(exchangeStatus);
      } catch (error) {
        console.error('Error checking exchange status:', error);
        setLoggedInExchange(null);
      } finally {
        setExchangeLoading(false);
      }
    };

    checkExchangeStatus();
  }, [isOpen, marketContext]);

  const [formData, setFormData] = useState({
    strategy_name: '',
    strategy_type: 'moving_average',
    symbols: ['BTCUSDT'],
    exchange: defaultExchange,
    parameters: {},
    risk_management: {
      stop_loss_pct: 0.02,
      take_profit_pct: 0.05,
      max_position_size: 0.1,
      max_daily_loss: 0.05
    }
  });

  // Update form when selectedStrategy changes or when logged-in exchange is determined
  useEffect(() => {
    const exchangeToUse = loggedInExchange || defaultExchange;

    if (selectedStrategy) {
      setFormData(prev => ({
        ...prev,
        strategy_name: selectedStrategy.name.toLowerCase().replace(/\s+/g, '_'),
        strategy_type: selectedStrategy.type || 'moving_average',
        exchange: exchangeToUse,
        parameters: {}
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        exchange: exchangeToUse
      }));
    }
  }, [selectedStrategy, loggedInExchange, defaultExchange]);

  // Strategy templates with detailed descriptions
  const strategyTemplates = {
    moving_average: {
      name: 'Moving Average Crossover',
      description: 'Simple moving average crossover strategy that generates buy signals when the fast MA crosses above the slow MA, and sell signals when it crosses below.',
      icon: '📈',
      parameters: {
        fast_period: {
          type: 'number',
          default: 10,
          min: 5,
          max: 50,
          label: 'Fast Period',
          description: 'Period for the fast moving average'
        },
        slow_period: {
          type: 'number',
          default: 20,
          min: 10,
          max: 100,
          label: 'Slow Period',
          description: 'Period for the slow moving average'
        },
        min_trend_strength: {
          type: 'number',
          default: 0.1,
          min: 0.01,
          max: 1.0,
          label: 'Min Trend Strength',
          description: 'Minimum trend strength required for signal generation'
        },
        volume_threshold: {
          type: 'number',
          default: 1000,
          min: 100,
          max: 10000,
          label: 'Volume Threshold',
          description: 'Minimum volume required for signal validation'
        }
      }
    },
    rsi: {
      name: 'RSI Strategy',
      description: 'Relative Strength Index based strategy that generates signals based on oversold and overbought conditions.',
      icon: '📊',
      parameters: {
        rsi_period: {
          type: 'number',
          default: 14,
          min: 7,
          max: 30,
          label: 'RSI Period',
          description: 'Period for RSI calculation'
        },
        oversold_level: {
          type: 'number',
          default: 30,
          min: 20,
          max: 40,
          label: 'Oversold Level',
          description: 'RSI level considered oversold (buy signal)'
        },
        overbought_level: {
          type: 'number',
          default: 70,
          min: 60,
          max: 80,
          label: 'Overbought Level',
          description: 'RSI level considered overbought (sell signal)'
        },
        momentum_threshold: {
          type: 'number',
          default: 0.5,
          min: 0.1,
          max: 2.0,
          label: 'Momentum Threshold',
          description: 'Minimum momentum required for signal confirmation'
        }
      }
    },
    macd: {
      name: 'MACD Strategy',
      description: 'Moving Average Convergence Divergence strategy that generates signals based on MACD line crossovers and histogram analysis.',
      icon: '📉',
      parameters: {
        fast_period: {
          type: 'number',
          default: 12,
          min: 5,
          max: 30,
          label: 'Fast Period',
          description: 'Fast EMA period for MACD calculation'
        },
        slow_period: {
          type: 'number',
          default: 26,
          min: 15,
          max: 50,
          label: 'Slow Period',
          description: 'Slow EMA period for MACD calculation'
        },
        signal_period: {
          type: 'number',
          default: 9,
          min: 5,
          max: 20,
          label: 'Signal Period',
          description: 'Signal line period for MACD'
        },
        histogram_threshold: {
          type: 'number',
          default: 0.001,
          min: 0.0001,
          max: 0.01,
          label: 'Histogram Threshold',
          description: 'Minimum histogram value for signal generation'
        }
      }
    },
    bollinger_bands: {
      name: 'Bollinger Bands Strategy',
      description: 'Bollinger Bands based strategy with squeeze detection and volatility analysis.',
      icon: '📏',
      parameters: {
        period: {
          type: 'number',
          default: 20,
          min: 10,
          max: 50,
          label: 'Period',
          description: 'Period for Bollinger Bands calculation'
        },
        std_dev: {
          type: 'number',
          default: 2.0,
          min: 1.0,
          max: 3.0,
          label: 'Standard Deviation',
          description: 'Number of standard deviations for bands'
        },
        squeeze_threshold: {
          type: 'number',
          default: 0.1,
          min: 0.05,
          max: 0.3,
          label: 'Squeeze Threshold',
          description: 'Threshold for detecting market squeeze'
        },
        volatility_threshold: {
          type: 'number',
          default: 0.02,
          min: 0.01,
          max: 0.1,
          label: 'Volatility Threshold',
          description: 'Minimum volatility required for signals'
        }
      }
    }
  };

  const handleStrategyTypeChange = (strategyType) => {
    setFormData(prev => ({
      ...prev,
      strategy_type: strategyType,
      parameters: {}
    }));
  };

  const handleParameterChange = (paramName, value) => {
    setFormData(prev => ({
      ...prev,
      parameters: {
        ...prev.parameters,
        [paramName]: value
      }
    }));
  };

  const handleRiskManagementChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      risk_management: {
        ...prev.risk_management,
        [field]: value
      }
    }));
  };

  const handleDeploy = () => {
    if (!formData.strategy_name.trim()) {
      return;
    }
    onDeploy(formData);
  };

  const resetForm = () => {
    const exchangeToUse = loggedInExchange || defaultExchange;
    setFormData({
      strategy_name: '',
      strategy_type: 'moving_average',
      symbols: ['BTCUSDT'],
      exchange: exchangeToUse,
      parameters: {},
      risk_management: {
        stop_loss_pct: 0.02,
        take_profit_pct: 0.05,
        max_position_size: 0.1,
        max_daily_loss: 0.05
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-5xl max-h-[90vh] overflow-y-auto ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Deploy New Trading Strategy</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Configure and deploy an automated trading strategy
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg dark:bg-red-900 dark:border-red-800 dark:text-red-200 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Basic Configuration */}
            <div>
              <h3 className="text-lg font-medium mb-4">Basic Configuration</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Strategy Name *</label>
                  <input
                    type="text"
                    value={formData.strategy_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, strategy_name: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    placeholder="e.g., my_btc_strategy"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Use lowercase letters, numbers, and underscores only
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Strategy Type *</label>
                  <select
                    value={formData.strategy_type}
                    onChange={(e) => handleStrategyTypeChange(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                  >
                    {Object.entries(strategyTemplates).map(([key, template]) => (
                      <option key={key} value={key} style={{
                        color: '#ffffff',
                        background: '#213547',
                      }}>
                        {template.icon} {template.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Exchange</label>
                  <div className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'} bg-gray-100 dark:bg-gray-600 flex items-center justify-between`}>
                    <span>{formData.exchange.charAt(0).toUpperCase() + formData.exchange.slice(1)}</span>
                    {exchangeLoading && (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    )}
                    {loggedInExchange && !exchangeLoading && (
                      <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900 px-2 py-1 rounded">
                        Connected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {loggedInExchange
                      ? `Using logged-in ${loggedInExchange} exchange for ${marketContext} market`
                      : `Using default ${defaultExchange} exchange for ${marketContext} market`
                    }
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Trading Symbols *</label>
                  <input
                    type="text"
                    value={formData.symbols.join(', ')}
                    onChange={(e) => setFormData(prev => ({ ...prev, symbols: e.target.value.split(',').map(s => s.trim()) }))}
                    className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    placeholder="e.g., BTCUSDT, ETHUSDT"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Separate multiple symbols with commas
                  </p>
                </div>
              </div>

              {/* Strategy Description */}
              {formData.strategy_type && strategyTemplates[formData.strategy_type] && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{strategyTemplates[formData.strategy_type].icon}</span>
                    <div>
                      <h4 className="font-medium mb-2">{strategyTemplates[formData.strategy_type].name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {strategyTemplates[formData.strategy_type].description}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Parameters and Risk Management */}
            <div>
              {/* Strategy Parameters */}
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-4">Strategy Parameters</h3>

                <div className="space-y-4">
                  {formData.strategy_type && strategyTemplates[formData.strategy_type] &&
                    Object.entries(strategyTemplates[formData.strategy_type].parameters).map(([paramName, config]) => (
                      <div key={paramName}>
                        <label className="block text-sm font-medium mb-2">{config.label}</label>
                        <input
                          type="number"
                          value={formData.parameters[paramName] || config.default}
                          onChange={(e) => handleParameterChange(paramName, parseFloat(e.target.value))}
                          min={config.min}
                          max={config.max}
                          step="any"
                          className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                        />
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Range: {config.min} - {config.max}
                          </p>
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <Info className="w-3 h-3" />
                            <span>{config.description}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>

              {/* Risk Management */}
              <div>
                <h3 className="text-lg font-medium mb-4">Risk Management</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Stop Loss (%)</label>
                    <input
                      type="number"
                      value={formData.risk_management.stop_loss_pct * 100}
                      onChange={(e) => handleRiskManagementChange('stop_loss_pct', parseFloat(e.target.value) / 100)}
                      min="0.1"
                      max="10"
                      step="0.1"
                      className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Automatic stop loss percentage
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Take Profit (%)</label>
                    <input
                      type="number"
                      value={formData.risk_management.take_profit_pct * 100}
                      onChange={(e) => handleRiskManagementChange('take_profit_pct', parseFloat(e.target.value) / 100)}
                      min="0.1"
                      max="50"
                      step="0.1"
                      className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Automatic take profit percentage
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Max Position Size (%)</label>
                    <input
                      type="number"
                      value={formData.risk_management.max_position_size * 100}
                      onChange={(e) => handleRiskManagementChange('max_position_size', parseFloat(e.target.value) / 100)}
                      min="1"
                      max="100"
                      step="1"
                      className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Maximum position size as % of capital
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Max Daily Loss (%)</label>
                    <input
                      type="number"
                      value={formData.risk_management.max_daily_loss * 100}
                      onChange={(e) => handleRiskManagementChange('max_daily_loss', parseFloat(e.target.value) / 100)}
                      min="1"
                      max="20"
                      step="0.1"
                      className={`w-full px-3 py-2 border rounded-lg ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Maximum daily loss limit
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeploy}
              disabled={loading || !formData.strategy_name.trim()}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Deploying...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Deploy Strategy
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeployStrategyModal; 