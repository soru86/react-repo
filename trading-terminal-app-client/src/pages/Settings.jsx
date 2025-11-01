import React from 'react';
import { useTheme } from '../shared/context/ThemeContext';

const Settings = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  const containerStyle = {
    padding: '24px',
    height: '100%',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    marginLeft: '40px',
    marginRight: '40px',
    boxSizing: 'border-box',
  };

  return (
    <div style={containerStyle}>
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ color: '#94a3b8', marginBottom: '24px' }}>Account Settings</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px' }}>Display Name</label>
            <input
              type="text"
              defaultValue="alok kumar"
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '6px',
                color: '#ffffff'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px' }}>Email</label>
            <input
              type="email"
              defaultValue="alok@example.com"
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '6px',
                color: '#ffffff'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px' }}>Phone Number</label>
            <input
              type="tel"
              defaultValue="+91 9876543210"
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '6px',
                color: '#ffffff'
              }}
            />
          </div>
        </div>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ color: '#94a3b8', marginBottom: '24px' }}>Preferences</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#ffffff', fontWeight: '500' }}>Dark Mode</div>
              <div style={{ color: '#94a3b8', fontSize: '14px' }}>Enable dark mode for the application</div>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={toggleTheme}
                style={{ opacity: 0, width: 0, height: 0 }}
              />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: isDarkMode ? '#3b82f6' : '#9ca3af',
                borderRadius: '24px',
                transition: '.4s'
              }}>
                <span style={{
                  position: 'absolute',
                  content: '""',
                  height: '20px',
                  width: '20px',
                  left: isDarkMode ? '26px' : '2px',
                  bottom: '2px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  transition: '.4s'
                }} />
              </span>
            </label>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#ffffff', fontWeight: '500' }}>Email Notifications</div>
              <div style={{ color: '#94a3b8', fontSize: '14px' }}>Receive email notifications for trades</div>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
              <input type="checkbox" defaultChecked style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#3b82f6',
                borderRadius: '24px',
                transition: '.4s'
              }}>
                <span style={{
                  position: 'absolute',
                  content: '""',
                  height: '20px',
                  width: '20px',
                  left: '2px',
                  bottom: '2px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  transition: '.4s'
                }} />
              </span>
            </label>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#ffffff', fontWeight: '500' }}>SMS Notifications</div>
              <div style={{ color: '#94a3b8', fontSize: '14px' }}>Receive SMS notifications for trades</div>
            </div>
            <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '24px' }}>
              <input type="checkbox" style={{ opacity: 0, width: 0, height: 0 }} />
              <span style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#3b82f6',
                borderRadius: '24px',
                transition: '.4s'
              }}>
                <span style={{
                  position: 'absolute',
                  content: '""',
                  height: '20px',
                  width: '20px',
                  left: '2px',
                  bottom: '2px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  transition: '.4s'
                }} />
              </span>
            </label>
          </div>
        </div>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        padding: '24px',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ color: '#94a3b8', marginBottom: '24px' }}>Security</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px' }}>Current Password</label>
            <input
              type="password"
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '6px',
                color: '#ffffff'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px' }}>New Password</label>
            <input
              type="password"
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '6px',
                color: '#ffffff'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '8px' }}>Confirm New Password</label>
            <input
              type="password"
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '6px',
                color: '#ffffff'
              }}
            />
          </div>
          <button
            style={{
              padding: '12px',
              background: '#3b82f6',
              border: 'none',
              borderRadius: '6px',
              color: '#ffffff',
              fontWeight: '500',
              cursor: 'pointer',
              alignSelf: 'flex-start'
            }}
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings; 