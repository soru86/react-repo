import React from 'react';
import { 
  Play, 
  Square, 
  RotateCcw, 
  TrendingUp, 
  TrendingDown,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

const StrategyCard = ({ strategy, onRestart, onStop }) => {
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

  const getPerformanceColor = (value) => {
    if (value > 0) return 'text-green-500';
    if (value < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {strategy.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {strategy.strategy_type}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon(strategy.status)}
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(strategy.status)}`}>
            {strategy.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Symbols
          </p>
          <p className="text-sm font-medium">
            {strategy.symbols?.join(', ') || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Exchange
          </p>
          <p className="text-sm font-medium capitalize">
            {strategy.exchange || 'N/A'}
          </p>
        </div>
      </div>

      {strategy.performance_metrics && (
        <div className="mb-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Performance
          </p>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Total PnL</p>
              <p className={`text-sm font-bold ${getPerformanceColor(strategy.performance_metrics.total_pnl)}`}>
                ${(strategy.performance_metrics.total_pnl || 0).toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Win Rate</p>
              <p className="text-sm font-bold">
                {((strategy.performance_metrics.win_rate || 0) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">Trades</p>
              <p className="text-sm font-bold">
                {strategy.performance_metrics.total_trades || 0}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Memory Usage
          </p>
          <p className="text-sm font-medium">
            {(strategy.memory_usage || 0).toFixed(1)} MB
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            CPU Usage
          </p>
          <p className="text-sm font-medium">
            {(strategy.cpu_usage || 0).toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {strategy.status === 'running' ? (
            <button
              onClick={() => onStop(strategy.name)}
              className="p-2 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
              title="Stop Strategy"
            >
              <Square className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => onRestart(strategy.name)}
              className="p-2 text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors"
              title="Start Strategy"
            >
              <Play className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onRestart(strategy.name)}
            className="p-2 text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
            title="Restart Strategy"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex items-center gap-1">
          <Activity className="w-4 h-4 text-gray-400" />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {strategy.uptime ? `${Math.floor(strategy.uptime / 3600)}h ${Math.floor((strategy.uptime % 3600) / 60)}m` : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StrategyCard; 