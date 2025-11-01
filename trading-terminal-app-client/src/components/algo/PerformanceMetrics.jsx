import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  BarChart3, 
  DollarSign,
  Target,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

const PerformanceMetrics = ({ metrics, isDarkMode }) => {
  const getPerformanceColor = (value) => {
    if (value > 0) return 'text-green-500';
    if (value < 0) return 'text-red-500';
    return 'text-gray-500';
  };

  const getPerformanceIcon = (value) => {
    if (value > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (value < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value || 0);
  };

  const formatPercentage = (value) => {
    return `${((value || 0) * 100).toFixed(2)}%`;
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
      <h3 className="text-lg font-semibold mb-4">System Performance</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Strategies */}
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Strategies</p>
              <p className="text-2xl font-bold">{metrics.total_containers || 0}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        {/* Running Strategies */}
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Running</p>
              <p className="text-2xl font-bold text-green-500">{metrics.running_containers || 0}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        {/* Memory Usage */}
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Memory Usage</p>
              <p className="text-2xl font-bold">{(metrics.total_memory_usage_mb || 0).toFixed(1)} MB</p>
            </div>
            <Activity className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        {/* CPU Usage */}
        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">CPU Usage</p>
              <p className="text-2xl font-bold">{(metrics.total_cpu_usage_percent || 0).toFixed(1)}%</p>
            </div>
            <Target className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Detailed Metrics */}
      {metrics.strategy_performance && Object.keys(metrics.strategy_performance).length > 0 && (
        <div className="mt-6">
          <h4 className="text-md font-medium mb-4">Strategy Performance</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(metrics.strategy_performance).map(([strategyName, performance]) => (
              <div key={strategyName} className={`p-4 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-sm truncate">{strategyName}</h5>
                  {getPerformanceIcon(performance.total_pnl)}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Total PnL:</span>
                    <span className={`font-medium ${getPerformanceColor(performance.total_pnl)}`}>
                      {formatCurrency(performance.total_pnl)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Win Rate:</span>
                    <span className="font-medium">
                      {formatPercentage(performance.win_rate)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Total Trades:</span>
                    <span className="font-medium">
                      {performance.total_trades || 0}
                    </span>
                  </div>
                  
                  {performance.max_drawdown !== undefined && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Max Drawdown:</span>
                      <span className="font-medium text-red-500">
                        {formatPercentage(performance.max_drawdown)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System Health */}
      <div className="mt-6">
        <h4 className="text-md font-medium mb-4">System Health</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Healthy Containers</span>
            </div>
            <p className="text-2xl font-bold text-green-500">
              {metrics.healthy_containers || 0}
            </p>
          </div>
          
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              <span className="text-sm font-medium">Warning</span>
            </div>
            <p className="text-2xl font-bold text-yellow-500">
              {metrics.warning_containers || 0}
            </p>
          </div>
          
          <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-5 h-5 text-red-500" />
              <span className="text-sm font-medium">Failed</span>
            </div>
            <p className="text-2xl font-bold text-red-500">
              {metrics.failed_containers || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Resource Usage */}
      {metrics.resource_usage && (
        <div className="mt-6">
          <h4 className="text-md font-medium mb-4">Resource Usage</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Memory Usage</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {formatPercentage(metrics.resource_usage.memory_usage_percent)}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(metrics.resource_usage.memory_usage_percent || 0) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">CPU Usage</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {formatPercentage(metrics.resource_usage.cpu_usage_percent)}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(metrics.resource_usage.cpu_usage_percent || 0) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMetrics; 