import { useState, useEffect } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router';
import Landing from './pages/Landing';
import CryptoMarket from './pages/CryptoMarket';
import ApplicationLayout from './hocs/ApplicationLayout';
import ForexMarket from './pages/ForexMarket';
import IndianMarket from './pages/IndianMarket';
import Dashboard from './pages/Dashboard';
import Trading from './pages/Trading';
import IndianMarketTrading from './pages/IndianMarketTrading';
import Portfolio from './pages/Portfolio';
import Analysis from './pages/Analysis';
import Settings from './pages/Settings';
import AlgoTrading from './pages/AlgoTrading';
import ChatGPT from './pages/ChatGPT';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';
import { orderBook, portfolioData, positions, recentOrders, watchlist } from './data/app-data';
import ProtectedRoute from './hocs/ProtectedRoute';

// Function to get default symbol based on market
const getDefaultSymbol = (market) => {
  switch (market) {
    case 'crypto':
      return 'BTCUSDT';
    case 'forex':
      return 'EURUSD';
    case 'indian':
      return 'RELIANCE';
    default:
      return 'BTCUSDT';
  }
};

// Determine current market from URL
const getCurrentMarket = (location) => {
  if (location.pathname.startsWith('/crypto')) return 'crypto';
  if (location.pathname.startsWith('/forex')) return 'forex';
  if (location.pathname.startsWith('/indian')) return 'indian';
  return 'crypto'; // default
};

const App = () => {
  const location = useLocation();

  const currentMarket = getCurrentMarket(location);
  const defaultSymbol = getDefaultSymbol(currentMarket);

  const [selectedSymbol, setSelectedSymbol] = useState(defaultSymbol);
  const [orderType, setOrderType] = useState('MARKET');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [paperTrading, setPaperTrading] = useState(false);

  // Update selectedSymbol when market changes
  useEffect(() => {
    const newDefaultSymbol = getDefaultSymbol(currentMarket);
    if (selectedSymbol === 'BTCUSDT' && currentMarket === 'indian') {
      setSelectedSymbol(newDefaultSymbol);
    } else if (selectedSymbol === 'RELIANCE' && currentMarket === 'crypto') {
      setSelectedSymbol(newDefaultSymbol);
    } else if (selectedSymbol === 'RELIANCE' && currentMarket === 'forex') {
      setSelectedSymbol(newDefaultSymbol);
    }
  }, [currentMarket, selectedSymbol]);

  const handlePlaceOrder = (side) => {
    if (paperTrading) {
      console.log('Disable Paper Trading mode to place real orders.');
      return;
    }
    console.log('Placing order:', { side, symbol: selectedSymbol, type: orderType, quantity, price });
  };

  return (
    <>
      <Outlet />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/landing" element={<ProtectedRoute><Landing /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to="/landing" replace />} />
        <Route path="/crypto" element={<ProtectedRoute><ApplicationLayout market='crypto'><CryptoMarket /></ApplicationLayout></ProtectedRoute>} >
          <Route path="/crypto/dashboard" element={<Dashboard portfolioData={portfolioData} recentOrders={recentOrders} positions={positions} />} />
          <Route path="/crypto" element={<Navigate to="/crypto/dashboard" />} />
          <Route path="/crypto/trading" element={<Trading
            orderBook={orderBook}
            recentOrders={recentOrders}
            watchlist={watchlist}
            selectedSymbol={selectedSymbol}
            setSelectedSymbol={setSelectedSymbol}
            orderType={orderType}
            setOrderType={setOrderType}
            quantity={quantity}
            setQuantity={setQuantity}
            price={price}
            setPrice={setPrice}
            handlePlaceOrder={handlePlaceOrder}
            paperTrading={paperTrading}
            setPaperTrading={setPaperTrading}
          />} />
          <Route path="/crypto/portfolio" element={<Portfolio positions={positions} portfolioData={portfolioData} />} />
          <Route path="/crypto/analysis" element={<Analysis portfolioData={portfolioData} positions={positions} />} />
          <Route path="/crypto/algo-trading" element={<AlgoTrading paperTrading={paperTrading} setPaperTrading={setPaperTrading} />} />
          <Route path="/crypto/chatgpt" element={<ChatGPT />} />
          <Route path="/crypto/settings" element={<Settings />} />
        </Route>
        <Route path="/forex" element={<ProtectedRoute><ApplicationLayout market='forex'><ForexMarket /></ApplicationLayout></ProtectedRoute>} >
          <Route path="/forex/dashboard" element={<Dashboard portfolioData={portfolioData} recentOrders={recentOrders} positions={positions} />} />
          <Route path="/forex" element={<Navigate to="/forex/dashboard" />} />
          <Route path="/forex/trading" element={<Trading
            orderBook={orderBook}
            recentOrders={recentOrders}
            watchlist={watchlist}
            selectedSymbol={selectedSymbol}
            setSelectedSymbol={setSelectedSymbol}
            orderType={orderType}
            setOrderType={setOrderType}
            quantity={quantity}
            setQuantity={setQuantity}
            price={price}
            setPrice={setPrice}
            handlePlaceOrder={handlePlaceOrder}
            paperTrading={paperTrading}
            setPaperTrading={setPaperTrading}
          />} />
          <Route path="/forex/portfolio" element={<Portfolio positions={positions} portfolioData={portfolioData} />} />
          <Route path="/forex/analysis" element={<Analysis portfolioData={portfolioData} positions={positions} />} />
          <Route path="/forex/algo-trading" element={<AlgoTrading paperTrading={paperTrading} setPaperTrading={setPaperTrading} />} />
          <Route path="/forex/chatgpt" element={<ChatGPT />} />
          <Route path="/forex/settings" element={<Settings />} />
        </Route>
        <Route path="/indian" element={<ProtectedRoute><ApplicationLayout market='indian'><IndianMarket /></ApplicationLayout></ProtectedRoute>} >
          <Route path="/indian/dashboard" element={<Dashboard portfolioData={portfolioData} recentOrders={recentOrders} positions={positions} />} />
          <Route path="/indian" element={<Navigate to="/indian/dashboard" />} />
          <Route path="/indian/trading" element={<IndianMarketTrading
            orderBook={orderBook}
            recentOrders={recentOrders}
            watchlist={watchlist}
            selectedSymbol={selectedSymbol}
            setSelectedSymbol={setSelectedSymbol}
            orderType={orderType}
            setOrderType={setOrderType}
            quantity={quantity}
            setQuantity={setQuantity}
            price={price}
            setPrice={setPrice}
            handlePlaceOrder={handlePlaceOrder}
            paperTrading={paperTrading}
            setPaperTrading={setPaperTrading}
          />} />
          <Route path="/indian/portfolio" element={<Portfolio positions={positions} portfolioData={portfolioData} />} />
          <Route path="/indian/analysis" element={<Analysis portfolioData={portfolioData} positions={positions} />} />
          <Route path="/indian/algo-trading" element={<AlgoTrading paperTrading={paperTrading} setPaperTrading={setPaperTrading} />} />
          <Route path="/indian/chatgpt" element={<ChatGPT />} />
          <Route path="/indian/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;