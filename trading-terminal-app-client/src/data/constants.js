export const SNACKBAR_VARIANTS = Object.freeze([
  'success',
  'error',
  'info',
  'warning'
]);

export const intervalMap = {
  '1m': '1m',
  '3m': '3m',
  '5m': '5m',
  '15m': '15m',
  '30m': '30m',
  '1h': '1h',
  '2h': '2h',
  '4h': '4h',
  '6h': '6h',
  '8h': '8h',
  '12h': '12h',
  '1D': '1d',
  '3D': '3d',
  '1W': '1w',
  '1M': '1M',
  '3M': '1M', // Fallback to 1M
  '1Y': '1M', // Fallback to 1M
};

export const orderTypesMap = {
  'MARKET': 'Market',
  'LIMIT': 'Limit',
  'STOP': 'Stop',
  'STOP_LIMIT': 'Stop Limit',
}

export const marketTypesMap = {
  'stocks': 'Stocks',
  'fno': 'F&O',
  'index': 'Index',
  'mcx': 'MCX',
};

export const commonMarketTypesMap = {
  'stocks': 'Stocks',
  'fno': 'F&O',
  'crypto': 'Crypto',
  'forex': 'Forex',
};

export const indicatorsMap = {
  'none': 'None',
  'sma': 'SMA (14)',
  'ema': 'EMA (14)',
  'rsi': 'RSI (14)',
  'macd': 'MACD',
};

export const commonIndicatorsMap = {
  'none': 'None',
  'sma': 'SMA (14)',
  'ema': 'EMA (14)',
};

export const intervalLabelsMap = {
  '1m': '1min',
  '3m': '3min',
  '5m': '5min',
  '15m': '15min',
  '30m': '30min',
  '1h': '1h',
  '2h': '2h',
  '4h': '4h',
  '6h': '6h',
  '8h': '8h',
  '12h': '12h',
  '1D': '1D',
  '3D': '3D',
  '1W': '1W',
  '1M': '1M',
  '3M': '3M',
  '1Y': '1Y',
};



export const SNACKBAR_DEFAULT_DURATION = 1600; // 3 seconds