  // Mock data
  const portfolioData = [
    { time: '9:30', value: 100000 },
    { time: '10:00', value: 102000 },
    { time: '10:30', value: 101500 },
    { time: '11:00', value: 103000 },
    { time: '11:30', value: 104000 },
    { time: '12:00', value: 103500 },
    { time: '12:30', value: 105000 },
    { time: '13:00', value: 106000 },
    { time: '13:30', value: 105500 },
    { time: '14:00', value: 107000 },
    { time: '14:30', value: 108000 },
    { time: '15:00', value: 109000 },
    { time: '15:30', value: 110000 }
  ];

  const priceData = [
    { time: '9:30', price: 2500 },
    { time: '10:00', price: 2520 },
    { time: '10:30', price: 2510 },
    { time: '11:00', price: 2530 },
    { time: '11:30', price: 2540 },
    { time: '12:00', price: 2535 },
    { time: '12:30', price: 2550 },
    { time: '13:00', price: 2560 },
    { time: '13:30', price: 2555 },
    { time: '14:00', price: 2570 },
    { time: '14:30', price: 2580 },
    { time: '15:00', price: 2590 },
    { time: '15:30', price: 2600 }
  ];

  const watchlist = [
    { symbol: 'RELIANCE', price: 2600 },
    { symbol: 'TCS', price: 3500 },
    { symbol: 'HDFCBANK', price: 1600 },
    { symbol: 'INFY', price: 1500 },
    { symbol: 'ICICIBANK', price: 900 }
  ];

  const positions = [
    { symbol: 'RELIANCE', shares: 10, price: 2600, pnl: 2500, pnlPercent: 9.6 },
    { symbol: 'TCS', shares: 5, price: 3500, pnl: -500, pnlPercent: -2.8 },
    { symbol: 'HDFCBANK', shares: 8, price: 1600, pnl: 1200, pnlPercent: 9.4 }
  ];

  const recentOrders = [
    { id: 1, symbol: 'RELIANCE', side: 'BUY', quantity: 10, price: 2600, time: '10:30 AM' },
    { id: 2, symbol: 'TCS', side: 'SELL', quantity: 5, price: 3500, time: '11:15 AM' },
    { id: 3, symbol: 'HDFCBANK', side: 'BUY', quantity: 8, price: 1600, time: '1:45 PM' }
  ];

  const orderBook = [
    { id: 1, side: 'BUY', quantity: 100, price: 2590 },
    { id: 2, side: 'BUY', quantity: 150, price: 2585 },
    { id: 3, side: 'BUY', quantity: 200, price: 2580 },
    { id: 4, side: 'SELL', quantity: 120, price: 2605 },
    { id: 5, side: 'SELL', quantity: 180, price: 2610 },
    { id: 6, side: 'SELL', quantity: 250, price: 2615 }
  ];

export {
    portfolioData,
    priceData,
    watchlist,
    positions,
    recentOrders,
    orderBook
  };