import { useState } from 'react';
import {
  TrendingUp, TrendingDown, Activity, DollarSign,
  PieChart, BarChart3, Settings, User, Bell,
  ChevronRight, ChevronLeft, ArrowLeft,
  MessageSquare, Bot
} from 'lucide-react';
import { useTheme } from '../shared/context/ThemeContext';
import { Link } from 'react-router';
import { getMarketInfo } from '../shared/utils/market-utils';

const Sidebar = ({ selectedTab, setSelectedTab, selectedMarket, onBackToLanding, market }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { isDarkMode } = useTheme();

  const marketInfo = getMarketInfo(selectedMarket);

  const sidebarStyle = {
    width: isSidebarCollapsed ? '80px' : '100%',
    maxWidth: isSidebarCollapsed ? '80px' : '280px',
    background: 'var(--card-bg)',
    borderRight: `1px solid var(--border)`,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: isDarkMode
      ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      : '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease'
  };

  const backgroundOverlayStyle = {
    position: 'absolute',
    inset: '0',
    background: isDarkMode
      ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, transparent 50%, rgba(139, 92, 246, 0.05) 100%)'
      : 'linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, transparent 50%, rgba(139, 92, 246, 0.02) 100%)',
    opacity: isDarkMode ? 0.6 : 0.4
  };

  const logoSectionStyle = {
    position: 'relative',
    padding: '16px',
    borderBottom: `1px solid var(--border)`,
    backdropFilter: 'blur(4px)'
  };

  const logoContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const logoContentStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const logoIconStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: marketInfo.color,
    boxShadow: isDarkMode
      ? '0 8px 32px rgba(59, 130, 246, 0.3)'
      : '0 8px 32px rgba(37, 99, 235, 0.2)',
    transform: 'scale(1)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    flexShrink: 0
  };

  const logoTextStyle = {
    transition: 'all 0.5s ease',
    overflow: 'hidden',
    opacity: isSidebarCollapsed ? 0 : 1,
    maxWidth: isSidebarCollapsed ? '0px' : '200px'
  };

  const titleStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'var(--text)',
    whiteSpace: 'nowrap',
    margin: 0
  };

  const subtitleStyle = {
    color: 'var(--secondary)',
    fontSize: '14px',
    fontWeight: '500',
    letterSpacing: '0.025em',
    whiteSpace: 'nowrap',
    margin: 0
  };

  const subTitleContentStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const backButtonStyle = {
    height: '1.25rem',
    marginLeft: '0.5rem',
    padding: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    color: 'var(--secondary)',
    fontSize: '14px',
    fontWeight: '500',
  }

  const toggleButtonStyle = {
    position: 'absolute',
    right: '-12px',
    top: '50%',
    transform: 'translateY(-50%)',
    padding: '6px',
    background: 'var(--card-bg)',
    borderRadius: '8px',
    border: `1px solid var(--border)`,
    boxShadow: isDarkMode
      ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      : '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    flexShrink: 0,
    color: 'var(--text)'
  };

  const navStyle = {
    flex: 1,
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    overflowY: 'auto'
  };

  const getNavItemStyle = (isActive) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
    background: isActive
      ? marketInfo.color
      : 'transparent',
    color: isActive
      ? '#ffffff'
      : 'var(--text)',
    border: 'none',
    cursor: 'pointer',
    boxShadow: isActive
      ? isDarkMode
        ? `0 4px 6px -1px ${marketInfo.color}40`
        : `0 4px 6px -1px ${marketInfo.color}30`
      : 'none'
  });

  const navItemContentStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    position: 'relative',
    zIndex: 10,
    minWidth: 0,
    flex: 1
  };

  const iconContainerStyle = (isActive) => ({
    padding: '4px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    background: isActive
      ? 'rgba(255, 255, 255, 0.2)'
      : 'transparent',
    flexShrink: 0
  });

  const navTextStyle = {
    fontWeight: '500',
    transition: 'all 0.5s ease',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    opacity: isSidebarCollapsed ? 0 : 1,
    maxWidth: isSidebarCollapsed ? '0px' : '200px'
  };

  return (
    <div style={sidebarStyle}>
      <div style={backgroundOverlayStyle} />
      <div style={logoSectionStyle}>
        <div style={logoContainerStyle}>
          <div style={logoContentStyle}>
            <div style={logoIconStyle}>
              <span style={{ fontSize: '20px', color: '#ffffff' }}>{marketInfo.icon}</span>
            </div>
            <div style={logoTextStyle}>
              <h1 style={titleStyle}>Algoyatra Terminal</h1>
              <div style={subTitleContentStyle}>
                <p style={subtitleStyle}>{marketInfo.name}</p>
                <button style={backButtonStyle} onClick={onBackToLanding}>
                  Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <button
        style={toggleButtonStyle}
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      >
        {isSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>
      <nav style={navStyle}>
        <Link
          to={`/${market}/dashboard`}
          style={getNavItemStyle(selectedTab === 'dashboard')}
          onClick={() => setSelectedTab('dashboard')}
        >
          <div style={navItemContentStyle}>
            <div style={iconContainerStyle(selectedTab === 'dashboard')}>
              <Activity size={20} />
            </div>
            <span style={navTextStyle}>Dashboard</span>
          </div>
        </Link>
        <Link
          to={`/${market}/trading`}
          style={getNavItemStyle(selectedTab === 'trading')}
          onClick={() => setSelectedTab('trading')}
        >
          <div style={navItemContentStyle}>
            <div style={iconContainerStyle(selectedTab === 'trading')}>
              <TrendingUp size={20} />
            </div>
            <span style={navTextStyle}>Trading</span>
          </div>
        </Link>
        <Link
          to={`/${market}/portfolio`}
          style={getNavItemStyle(selectedTab === 'portfolio')}
          onClick={() => setSelectedTab('portfolio')}
        >
          <div style={navItemContentStyle}>
            <div style={iconContainerStyle(selectedTab === 'portfolio')}>
              <PieChart size={20} />
            </div>
            <span style={navTextStyle}>Portfolio</span>
          </div>
        </Link>
        <Link
          to={`/${market}/analysis`}
          style={getNavItemStyle(selectedTab === 'analysis')}
          onClick={() => setSelectedTab('analysis')}
        >
          <div style={navItemContentStyle}>
            <div style={iconContainerStyle(selectedTab === 'analysis')}>
              <BarChart3 size={20} />
            </div>
            <span style={navTextStyle}>Analysis</span>
          </div>
        </Link>
        <Link
          to={`/${market}/algo-trading`}
          style={getNavItemStyle(selectedTab === 'algo-trading')}
          onClick={() => setSelectedTab('algo-trading')}
        >
          <div style={navItemContentStyle}>
            <div style={iconContainerStyle(selectedTab === 'algo-trading')}>
              <Bot size={20} />
            </div>
            <span style={navTextStyle}>Algo Trading</span>
          </div>
        </Link>
        <Link
          to={`/${market}/chatgpt`}
          style={getNavItemStyle(selectedTab === 'chatgpt')}
          onClick={() => setSelectedTab('chatgpt')}
        >
          <div style={navItemContentStyle}>
            <div style={iconContainerStyle(selectedTab === 'chatgpt')}>
              <MessageSquare size={20} />
            </div>
            <span style={navTextStyle}>ChatGPT</span>
          </div>
        </Link>
        <Link
          to={`/${market}/settings`}
          style={getNavItemStyle(selectedTab === 'settings')}
          onClick={() => setSelectedTab('settings')}
        >
          <div style={navItemContentStyle}>
            <div style={iconContainerStyle(selectedTab === 'settings')}>
              <Settings size={20} />
            </div>
            <span style={navTextStyle}>Settings</span>
          </div>
        </Link>
      </nav>
    </div >
  );
};

export default Sidebar; 