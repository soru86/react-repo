import React, { useState } from 'react';
import { markets } from '../data/market-data';
import { Link } from 'react-router';
import UserDropdown from '../components/UserDropdown';

const Landing = () => {
  const [selectedMarket, setSelectedMarket] = useState(null);

  const handleMarketSelect = (market) => {
    setSelectedMarket(market);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'monospace',
      color: '#e2e8f0'
    }}>
      {/* Terminal Header */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.8)',
        borderBottom: '2px solid #475569',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#ef4444',
            boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)'
          }}></div>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#fbbf24',
            boxShadow: '0 0 8px rgba(251, 191, 36, 0.5)'
          }}></div>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: '#10b981',
            boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)'
          }}></div>
          <span className='truncate text-[14px] slate-400 w-70 ml-4'>
            Algoyatra Trading Terminal v1.0.0
          </span>
        </div>
        <div className='truncate text-[12px] slate-500 w-40'>
          {new Date().toLocaleString()}
        </div>
        {/* User Dropdown */}
        <div className="top-1/8 right-6">
          <UserDropdown />
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '48px 24px',
        gap: '48px'
      }}>
        {/* Welcome Message */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px',
            textShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
          }}>
            ALGOYATRA TRADING TERMINAL
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#94a3b8',
            maxWidth: '1200px',
            lineHeight: '1.6'
          }}>
            Professional-grade trading platform for cryptocurrency, forex, and Indian markets.
            Deploy advanced algorithms and implement broad ranging strategies across all markets.
            Select your preferred market to begin trading.
          </p>
        </div>

        {/* Market Selection Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          maxWidth: '1200px',
          width: '100%'
        }}>
          {markets.map((market) => (
            <Link
              key={market.id}
              to={`/${market.id}`}
              onClick={() => handleMarketSelect(market)}
              style={{
                background: 'rgba(30, 41, 59, 0.8)',
                border: `2px solid ${selectedMarket?.id === market.id ? market.color : '#475569'}`,
                borderRadius: '16px',
                padding: '32px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)',
                boxShadow: selectedMarket?.id === market.id
                  ? `0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px ${market.color}40`
                  : '0 4px 16px rgba(0, 0, 0, 0.2)',
                transform: selectedMarket?.id === market.id ? 'scale(1.02)' : 'scale(1)',
              }}
              onMouseEnter={(e) => {
                if (selectedMarket?.id !== market.id) {
                  e.target.style.transform = 'scale(1.02)';
                  e.target.style.borderColor = market.color;
                }
              }}
              onMouseLeave={(e) => {
                if (selectedMarket?.id !== market.id) {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.borderColor = '#475569';
                }
              }}
            >
              {/* Background Gradient */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: market.gradient,
                opacity: 0.1,
                zIndex: 0
              }}></div>

              {/* Content */}
              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Icon and Title */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  <div style={{
                    fontSize: '32px',
                    width: '64px',
                    height: '64px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: market.gradient,
                    borderRadius: '12px',
                    boxShadow: `0 4px 16px ${market.color}40`
                  }}>
                    {market.icon}
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#f1f5f9',
                      margin: 0
                    }}>
                      {market.name}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: '#94a3b8',
                      margin: '4px 0 0 0'
                    }}>
                      {market.description}
                    </p>
                  </div>
                </div>

                {/* Features List */}
                <div style={{ marginTop: '24px' }}>
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#e2e8f0',
                    marginBottom: '12px'
                  }}>
                    Key Features:
                  </h4>
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    {market.features.map((feature, index) => (
                      <li key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        color: '#cbd5e1'
                      }}>
                        <span style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: market.color,
                          flexShrink: 0
                        }}></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <div style={{
                  marginTop: '24px',
                  textAlign: 'center'
                }}>
                  <button style={{
                    background: market.gradient,
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 24px',
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: `0 4px 12px ${market.color}40`,
                    width: '100%'
                  }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = `0 6px 20px ${market.color}60`;
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = `0 4px 12px ${market.color}40`;
                    }}
                  >
                    {selectedMarket?.id === market.id ? 'Launching...' : `Launch ${market.name}`}
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer Info */}
        <div style={{
          textAlign: 'center',
          marginTop: '48px',
          padding: '24px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderRadius: '12px',
          border: '1px solid #475569'
        }}>
          <p style={{
            fontSize: '14px',
            color: '#64748b',
            margin: '0 0 8px 0'
          }}>
            🔒 Secure • ⚡ Fast • 📊 Professional • 🤖 Algo Trading
          </p>
          <p style={{
            fontSize: '12px',
            color: '#475569',
            margin: 0
          }}>
            Built with React & Node.js • Real-time data feeds • Advanced charting • Broad ranging strategies
          </p>
        </div>
      </div>
    </div>
  );
};

export default Landing; 