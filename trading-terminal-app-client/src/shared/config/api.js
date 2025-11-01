// API Configuration
// Update this URL manually when you need to change your backend URL

// Manual URL configuration - update this when your ngrok URL changes
const BACKEND_URL = "http://localhost:8000"; // ← Update this URL manually

// Base URL for API calls
export const BACKEND_BASE_URL = BACKEND_URL;

// Redirect URLs for OAuth (used by brokers)
export const REDIRECT_BASE_URL = BACKEND_URL;

// API Endpoints
export const API_ENDPOINTS = {
  // Health and status
  health: `${BACKEND_BASE_URL}/health`,
  apiDocs: `${BACKEND_BASE_URL}/api/docs`,

  // Indian market data (broker-based only)
  indianMarketData: `${BACKEND_BASE_URL}/indian-market`,
  indianRealtimeData: `${BACKEND_BASE_URL}/indian-market/realtime`,

  // Broker authentication
  fyersLogin: `${BACKEND_BASE_URL}/indian-market/fyers/login`,
  fyersCallback: `${BACKEND_BASE_URL}/indian-market/fyers/callback`,
  fyersStatus: `${BACKEND_BASE_URL}/indian-market/fyers/status`,
  fyersLogout: `${BACKEND_BASE_URL}/indian-market/fyers/logout`,

  dhanLogin: `${BACKEND_BASE_URL}/indian-market/dhan/login`,
  dhanCallback: `${BACKEND_BASE_URL}/indian-market/dhan/callback`,
  dhanStatus: `${BACKEND_BASE_URL}/indian-market/dhan/status`,
  dhanLogout: `${BACKEND_BASE_URL}/indian-market/dhan/logout`,
  dhanProfile: `${BACKEND_BASE_URL}/indian-market/dhan/profile`,

  // Binance data
  binanceData: `${BACKEND_BASE_URL}/crypto-market/binance/data`,
  binanceRealtime: `${BACKEND_BASE_URL}/crypto-market/binance/realtime`,
  binanceAccount: `${BACKEND_BASE_URL}/crypto-market/binance/account`,
  binanceOrders: `${BACKEND_BASE_URL}/crypto-market/binance/orders`,

  // Broker market data
  fyersMarketData: `${BACKEND_BASE_URL}/indian-market/fyers/market-data/historical`,
  fyersRealtime: `${BACKEND_BASE_URL}/indian-market/fyers/market-data/realtime`,
  dhanMarketData: `${BACKEND_BASE_URL}/indian-market/dhan/market-data/historical`,
  dhanRealtime: `${BACKEND_BASE_URL}/indian-market/dhan/market-data/realtime`,

  // Orders and trading
  placeOrder: `${BACKEND_BASE_URL}/indian-market/placeorder`,
  accountInfo: `${BACKEND_BASE_URL}/indian-market/account`,
  positions: `${BACKEND_BASE_URL}/indian-market/positions`,
  orders: `${BACKEND_BASE_URL}/indian-market/orders`
};

export const GOOGLE_CLIENT_ID = "77222803445-e8d8m3k8vart24a7tln3e88ft7pl3ie0.apps.googleusercontent.com";

// Helper function to get base URL
export const getBaseURL = () => BACKEND_BASE_URL;

// Helper function to get endpoint URL
export const getEndpoint = (endpointName) => {
  return API_ENDPOINTS[endpointName] || `${BACKEND_BASE_URL}/${endpointName}`;
};

// Configuration object for easy access
export default {
  baseURL: BACKEND_BASE_URL,
  redirectURL: REDIRECT_BASE_URL,
  endpoints: API_ENDPOINTS
};