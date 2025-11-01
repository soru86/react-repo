import React, { useState } from 'react';
import { useTheme } from '../shared/context/ThemeContext';

const Algos = ({ paperTrading, setPaperTrading }) => {
  const { isDarkMode } = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStrategy, setModalStrategy] = useState('');
  const [indicator, setIndicator] = useState('');
  const [params, setParams] = useState('');
  const [activeTab, setActiveTab] = useState('custom');

  const openModal = (strategy) => {
    setModalStrategy(strategy);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setModalStrategy('');
    setIndicator('');
    setParams('');
  };

  const containerStyle = {
    padding: '24px',
    height: '100%',
    overflow: 'auto',
    background: isDarkMode ? '#0f172a' : '#f8fafc',
    marginLeft: '40px',
    marginRight: '40px',
    boxSizing: 'border-box',
    scrollbarWidth: 'none', // Firefox
    msOverflowStyle: 'none' // IE 10+
  };

  const titleStyle = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '24px',
    color: isDarkMode ? '#ffffff' : '#1e293b'
  };

  const tabNavStyle = {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px',
    borderBottom: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
    paddingBottom: '8px'
  };
  const tabBtnStyle = (active) => ({
    padding: '8px 20px',
    border: 'none',
    borderBottom: active ? '3px solid #10b981' : '3px solid transparent',
    background: '#233c4a',
    color: active ? '#10b981' : (isDarkMode ? '#94a3b8' : '#64748b'),
    fontWeight: active ? 700 : 500,
    fontSize: '15px',
    cursor: 'pointer',
    outline: 'none',
    transition: 'color 0.2s, border-bottom 0.2s'
  });

  const cardStyle = {
    background: isDarkMode ? '#1e293b' : '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
    boxShadow: isDarkMode
      ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      : '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    border: isDarkMode
      ? '1px solid rgba(55, 65, 81, 0.3)'
      : '1px solid rgba(226, 232, 240, 0.5)',
    position: 'relative'
  };

  const cardTitleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '12px',
    color: isDarkMode ? '#ffffff' : '#1e293b'
  };

  const cardDescriptionStyle = {
    fontSize: '14px',
    color: isDarkMode ? '#94a3b8' : '#64748b',
    marginBottom: '16px'
  };

  const buttonStyle = {
    padding: '8px 16px',
    borderRadius: '6px',
    background: isDarkMode ? '#3b82f6' : '#2563eb',
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  };

  const paperModeLabel = (
    <div style={{
      position: 'absolute',
      top: '16px',
      right: '16px',
      background: '#fbbf24',
      color: '#1e293b',
      fontWeight: 700,
      fontSize: '12px',
      padding: '6px 18px',
      borderRadius: '999px',
      boxShadow: '0 2px 8px rgba(251,191,36,0.15)',
      letterSpacing: '1px',
      zIndex: 2
    }}>
      PAPER TRADING MODE
    </div>
  );

  // Modal styles
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(0,0,0,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  };
  const modalCardStyle = {
    background: isDarkMode ? '#1e293b' : '#fff',
    borderRadius: '12px',
    padding: '32px 24px',
    minWidth: '320px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
    position: 'relative',
    color: isDarkMode ? '#fff' : '#1e293b',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px'
  };
  const closeBtnStyle = {
    position: 'absolute',
    top: 12,
    right: 16,
    background: 'transparent',
    border: 'none',
    color: isDarkMode ? '#fff' : '#1e293b',
    fontSize: 22,
    cursor: 'pointer'
  };
  const inputStyle = {
    width: '100%',
    padding: '8px 10px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    marginBottom: '10px',
    background: isDarkMode ? '#0f172a' : '#f8fafc',
    color: isDarkMode ? '#fff' : '#1e293b'
  };

  // Strategy lists for each tab
  const customStrategies = [
    {
      name: 'Moving Average Crossover',
      desc: 'A strategy that generates buy and sell signals based on the crossing of two moving averages. When the short-term moving average crosses above the long-term moving average, it generates a buy signal.'
    },
    {
      name: 'RSI Strategy',
      desc: 'Uses the Relative Strength Index (RSI) to identify overbought and oversold conditions. Generates buy signals when RSI drops below 30 and sell signals when it rises above 70.'
    },
    {
      name: 'Bollinger Bands Strategy',
      desc: 'Implements a mean reversion strategy using Bollinger Bands. Generates buy signals when price touches the lower band and sell signals when it touches the upper band.'
    },
    {
      name: 'MACD Strategy',
      desc: 'Uses the Moving Average Convergence Divergence (MACD) indicator to identify trend changes. Generates signals based on MACD line crossovers and histogram patterns.'
    }
  ];
  const advancedStrategies = [
    {
      name: 'LSTM Neural Network',
      desc: 'Uses a Long Short-Term Memory (LSTM) neural network to predict future price movements based on historical data.'
    },
    {
      name: 'Reinforcement Learning Agent',
      desc: 'An RL agent that learns to trade by maximizing cumulative reward through trial and error.'
    },
    {
      name: 'Random Forest Classifier',
      desc: 'Applies a random forest machine learning model to classify buy/sell signals from technical indicators.'
    }
  ];
  const statisticalStrategies = [
    {
      name: 'Pairs Trading',
      desc: 'A statistical arbitrage strategy that identifies and trades pairs of correlated assets when their price relationship diverges.'
    },
    {
      name: 'Mean Reversion',
      desc: 'Buys assets that have fallen below their historical average and sells those above, betting on a return to the mean.'
    },
    {
      name: 'Cointegration Strategy',
      desc: 'Uses cointegration tests to find asset pairs whose prices move together in the long run, trading on short-term deviations.'
    }
  ];
  const moreStrategies = [
    {
      name: 'Custom Python Script',
      desc: 'Run your own Python-based trading script with full flexibility.'
    },
    {
      name: 'Webhook/Signal Integration',
      desc: 'Connect to external signal providers or webhooks to automate your trades.'
    }
  ];

  let strategiesToShow = [];
  if (activeTab === 'custom') strategiesToShow = customStrategies;
  if (activeTab === 'advanced') strategiesToShow = advancedStrategies;
  if (activeTab === 'statistical') strategiesToShow = statisticalStrategies;
  if (activeTab === 'more') strategiesToShow = moreStrategies;

  return (
    <>
      <style>{`
        .algos-scroll-hide::-webkit-scrollbar {
          width: 0px;
          background: transparent;
        }
      `}</style>
      <div style={containerStyle} className="algos-scroll-hide">
        <h1 style={titleStyle}>Algorithmic Trading</h1>
        {/* Paper Trading Switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <label style={{ color: '#94a3b8', fontWeight: 500, fontSize: '15px' }}>Paper Trading Mode</label>
          <button
            onClick={() => setPaperTrading(!paperTrading)}
            style={{
              padding: '6px 18px',
              background: paperTrading ? '#10b981' : '#334155',
              color: '#fff',
              border: 'none',
              borderRadius: '16px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'background 0.2s'
            }}
          >
            {paperTrading ? 'ON' : 'OFF'}
          </button>
        </div>
        {paperTrading && (
          <div style={{ color: '#fbbf24', fontWeight: 600, fontSize: '13px', marginBottom: '16px' }}>
            Disable to place real trades
          </div>
        )}
        {/* Tab Navigation */}
        <div style={tabNavStyle}>
          <button style={tabBtnStyle(activeTab === 'custom')} onClick={() => setActiveTab('custom')}>Custom Strategies</button>
          <button style={tabBtnStyle(activeTab === 'advanced')} onClick={() => setActiveTab('advanced')}>Advanced Strategies</button>
          <button style={tabBtnStyle(activeTab === 'statistical')} onClick={() => setActiveTab('statistical')}>Statistical Strategies</button>
          <button style={tabBtnStyle(activeTab === 'more')} onClick={() => setActiveTab('more')}>More</button>
        </div>
        {/* Strategy Cards */}
        {strategiesToShow.map((strategy) => (
          <div style={{ ...cardStyle }} key={strategy.name}>
            {paperTrading && paperModeLabel}
            <h2 style={cardTitleStyle}>{strategy.name}</h2>
            <p style={cardDescriptionStyle}>{strategy.desc}</p>
            <button style={buttonStyle} onClick={() => openModal(strategy.name)}>Configure Strategy</button>
          </div>
        ))}
        {/* Modal Popup */}
        {modalOpen && (
          <div style={modalOverlayStyle}>
            <div style={modalCardStyle}>
              <button style={closeBtnStyle} onClick={closeModal} title="Close">×</button>
              <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>{modalStrategy} Parameters</h2>
              <label style={{ fontWeight: 500, marginBottom: 4 }}>Indicator</label>
              <input
                style={inputStyle}
                type="text"
                placeholder="e.g. SMA, EMA, RSI"
                value={indicator}
                onChange={e => setIndicator(e.target.value)}
              />
              <label style={{ fontWeight: 500, marginBottom: 4 }}>Algo Parameters</label>
              <input
                style={inputStyle}
                type="text"
                placeholder="e.g. period=14, threshold=30"
                value={params}
                onChange={e => setParams(e.target.value)}
              />
              <button style={{ ...buttonStyle, marginTop: 8 }} onClick={closeModal}>Save</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Algos; 