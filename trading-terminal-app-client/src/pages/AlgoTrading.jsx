import React, { useState, useEffect } from 'react';
import {
  Play,
  Square,
  RotateCcw,
  Settings,
  Plus,
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Activity
} from 'lucide-react';
import { useTheme } from '../shared/context/ThemeContext';
import { BACKEND_BASE_URL } from '../shared/config/api';
import StrategyCard from '../components/algo/StrategyCard';
import DeployStrategyModal from '../components/algo/DeployStrategyModal';
import PerformanceMetrics from '../components/algo/PerformanceMetrics';
import { useLocation } from 'react-router';

const AlgoTrading = ({ paperTrading, setPaperTrading }) => {
  const { isDarkMode } = useTheme();
  const location = useLocation();
  const [strategies, setStrategies] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({});
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('deployed');
  const [loggedInExchange, setLoggedInExchange] = useState(null);

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
      }
    };

    checkExchangeStatus();
  }, [marketContext]);

  // Strategy templates for the templates tab
  const strategyTemplates = [
    {
      name: 'Moving Average Crossover',
      desc: 'A strategy that generates buy and sell signals based on the crossing of two moving averages. When the short-term moving average crosses above the long-term moving average, it generates a buy signal.',
      type: 'moving_average'
    },
    {
      name: 'RSI Strategy',
      desc: 'Uses the Relative Strength Index (RSI) to identify overbought and oversold conditions. Generates buy signals when RSI drops below 30 and sell signals when it rises above 70.',
      type: 'rsi'
    },
    {
      name: 'Bollinger Bands Strategy',
      desc: 'Implements a mean reversion strategy using Bollinger Bands. Generates buy signals when price touches the lower band and sell signals when it touches the upper band.',
      type: 'bollinger_bands'
    },
    {
      name: 'MACD Strategy',
      desc: 'Uses the Moving Average Convergence Divergence (MACD) indicator to identify trend changes. Generates signals based on MACD line crossovers and histogram patterns.',
      type: 'macd'
    }
  ];

  const advancedStrategies = [
    {
      name: 'LSTM Neural Network',
      desc: 'Uses a Long Short-Term Memory (LSTM) neural network to predict future price movements based on historical data.',
      type: 'lstm'
    },
    {
      name: 'Reinforcement Learning Agent',
      desc: 'An RL agent that learns to trade by maximizing cumulative reward through trial and error.',
      type: 'rl'
    },
    {
      name: 'Random Forest Classifier',
      desc: 'Applies a random forest machine learning model to classify buy/sell signals from technical indicators.',
      type: 'random_forest'
    }
  ];

  const statisticalStrategies = [
    {
      name: 'Pairs Trading',
      desc: 'A statistical arbitrage strategy that identifies and trades pairs of correlated assets when their price relationship diverges.',
      type: 'pairs_trading'
    },
    {
      name: 'Mean Reversion',
      desc: 'Buys assets that have fallen below their historical average and sells those above, betting on a return to the mean.',
      type: 'mean_reversion'
    },
    {
      name: 'Cointegration Strategy',
      desc: 'Uses cointegration tests to find asset pairs whose prices move together in the long run, trading on short-term deviations.',
      type: 'cointegration'
    }
  ];

  const moreStrategies = [
    {
      name: 'Custom Python Script',
      desc: 'Run your own Python-based trading script with full flexibility.',
      type: 'custom_python'
    },
    {
      name: 'Webhook/Signal Integration',
      desc: 'Connect to external signal providers or webhooks to automate your trades.',
      type: 'webhook'
    }
  ];

  // Form state for strategy deployment
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

  // Update formData when loggedInExchange changes
  useEffect(() => {
    const exchangeToUse = loggedInExchange || defaultExchange;
    setFormData(prev => ({
      ...prev,
      exchange: exchangeToUse
    }));
  }, [loggedInExchange, defaultExchange]);

  useEffect(() => {
    fetchStrategies();
    fetchPerformanceMetrics();
  }, []);

  const fetchStrategies = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_BASE_URL}/api/algo/strategies`);
      const data = await response.json();
      setStrategies(data.strategies || {});
    } catch (err) {
      setError('Failed to fetch strategies');
      console.error('Error fetching strategies:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPerformanceMetrics = async () => {
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/algo/performance`);
      const data = await response.json();
      setPerformanceMetrics(data);
    } catch (err) {
      console.error('Error fetching performance metrics:', err);
    }
  };

  const deployStrategy = async (strategyData) => {
    try {
      setLoading(true);
      const response = await fetch(`${BACKEND_BASE_URL}/api/algo/strategies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(strategyData),
      });

      const data = await response.json();

      if (response.ok) {
        setShowDeployModal(false);
        fetchStrategies();
        fetchPerformanceMetrics();
      } else {
        setError(data.message || 'Failed to deploy strategy');
      }
    } catch (err) {
      setError('Failed to deploy strategy');
      console.error('Error deploying strategy:', err);
    } finally {
      setLoading(false);
    }
  };

  const restartStrategy = async (strategyName) => {
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/algo/strategies/${strategyName}/restart`, {
        method: 'POST',
      });

      if (response.ok) {
        fetchStrategies();
      }
    } catch (err) {
      console.error('Error restarting strategy:', err);
    }
  };

  const stopStrategy = async (strategyName) => {
    try {
      const response = await fetch(`${BACKEND_BASE_URL}/api/algo/strategies/${strategyName}/stop`, {
        method: 'POST',
      });

      if (response.ok) {
        fetchStrategies();
      }
    } catch (err) {
      console.error('Error stopping strategy:', err);
    }
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
    setError(null);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'stopped':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'starting':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'text-green-500 bg-green-100 dark:bg-green-900';
      case 'stopped':
        return 'text-red-500 bg-red-100 dark:bg-red-900';
      case 'starting':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-900';
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Algorithmic Trading</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Deploy and manage automated trading strategies
            </p>
          </div>
          <button
            onClick={() => setShowDeployModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Deploy Strategy
          </button>
        </div>

        {/* Paper Trading Toggle */}
        <div className="flex items-center gap-3 mb-6">
          <label className="text-gray-600 dark:text-gray-400 font-medium">Paper Trading Mode</label>
          <button
            onClick={() => setPaperTrading(!paperTrading)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${paperTrading
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : 'bg-gray-300 hover:bg-gray-400 text-gray-700 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-gray-200'
              }`}
          >
            {paperTrading ? 'ON' : 'OFF'}
          </button>
          {paperTrading && (
            <div className="text-yellow-600 dark:text-yellow-400 font-medium text-sm">
              Disable to place real trades
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('deployed')}
            className={`px-4 py-2 font-medium transition-colors ${activeTab === 'deployed'
              ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
          >
            Deployed Strategies
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 font-medium transition-colors ${activeTab === 'templates'
              ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
          >
            Strategy Templates
          </button>
          <button
            onClick={() => setActiveTab('advanced')}
            className={`px-4 py-2 font-medium transition-colors ${activeTab === 'advanced'
              ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
          >
            Advanced Strategies
          </button>
          <button
            onClick={() => setActiveTab('statistical')}
            className={`px-4 py-2 font-medium transition-colors ${activeTab === 'statistical'
              ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
          >
            Statistical Strategies
          </button>
          <button
            onClick={() => setActiveTab('more')}
            className={`px-4 py-2 font-medium transition-colors ${activeTab === 'more'
              ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
          >
            More
          </button>
        </div>

        {/* Performance Overview - Only show for deployed tab */}
        {activeTab === 'deployed' && (
          <PerformanceMetrics metrics={performanceMetrics} isDarkMode={isDarkMode} />
        )}

        {/* Content based on active tab */}
        {activeTab === 'deployed' && (
          <div className={`rounded-lg shadow-md ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold">Deployed Strategies</h2>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Loading strategies...</p>
              </div>
            ) : Object.keys(strategies).length === 0 ? (
              <div className="p-8 text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No strategies deployed yet</p>
                <button
                  onClick={() => setShowDeployModal(true)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Deploy Your First Strategy
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {Object.entries(strategies).map(([name, strategy]) => (
                  <StrategyCard
                    key={name}
                    strategy={{ ...strategy, name }}
                    onRestart={restartStrategy}
                    onStop={stopStrategy}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Strategy Templates Tab */}
        {activeTab === 'templates' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {strategyTemplates.map((strategy) => (
              <div key={strategy.name} className={`rounded-lg shadow-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} relative`}>
                {paperTrading && (
                  <div className="absolute top-4 right-4 bg-yellow-500 text-gray-900 font-bold text-xs px-3 py-1 rounded-full">
                    PAPER TRADING
                  </div>
                )}
                <h3 className="text-lg font-semibold mb-3">{strategy.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{strategy.desc}</p>
                <button
                  onClick={() => {
                    setSelectedStrategy(strategy);
                    setShowDeployModal(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Deploy Strategy
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Advanced Strategies Tab */}
        {activeTab === 'advanced' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advancedStrategies.map((strategy) => (
              <div key={strategy.name} className={`rounded-lg shadow-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} relative`}>
                {paperTrading && (
                  <div className="absolute top-4 right-4 bg-yellow-500 text-gray-900 font-bold text-xs px-3 py-1 rounded-full">
                    PAPER TRADING
                  </div>
                )}
                <h3 className="text-lg font-semibold mb-3">{strategy.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{strategy.desc}</p>
                <button
                  onClick={() => {
                    setSelectedStrategy(strategy);
                    setShowDeployModal(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Deploy Strategy
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Statistical Strategies Tab */}
        {activeTab === 'statistical' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statisticalStrategies.map((strategy) => (
              <div key={strategy.name} className={`rounded-lg shadow-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} relative`}>
                {paperTrading && (
                  <div className="absolute top-4 right-4 bg-yellow-500 text-gray-900 font-bold text-xs px-3 py-1 rounded-full">
                    PAPER TRADING
                  </div>
                )}
                <h3 className="text-lg font-semibold mb-3">{strategy.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{strategy.desc}</p>
                <button
                  onClick={() => {
                    setSelectedStrategy(strategy);
                    setShowDeployModal(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Deploy Strategy
                </button>
              </div>
            ))}
          </div>
        )}

        {/* More Strategies Tab */}
        {activeTab === 'more' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {moreStrategies.map((strategy) => (
              <div key={strategy.name} className={`rounded-lg shadow-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} relative`}>
                {paperTrading && (
                  <div className="absolute top-4 right-4 bg-yellow-500 text-gray-900 font-bold text-xs px-3 py-1 rounded-full">
                    PAPER TRADING
                  </div>
                )}
                <h3 className="text-lg font-semibold mb-3">{strategy.name}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{strategy.desc}</p>
                <button
                  onClick={() => {
                    setSelectedStrategy(strategy);
                    setShowDeployModal(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Deploy Strategy
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Deploy Strategy Modal */}
        <DeployStrategyModal
          isOpen={showDeployModal}
          onClose={() => {
            setShowDeployModal(false);
            setSelectedStrategy(null);
          }}
          onDeploy={deployStrategy}
          loading={loading}
          error={error}
          selectedStrategy={selectedStrategy}
        />
      </div>
    </div>
  );
};

export default AlgoTrading; 