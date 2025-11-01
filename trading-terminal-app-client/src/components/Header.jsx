import { useState, useEffect } from "react";
import { BarChart3, User, CheckCircle } from "lucide-react";
import BrokerSelectionPopup from "./BrokerSelectionPopup";
import FyresLoginPopup from "./FyresLoginPopup";
import DhanLoginPopup from "./DhanLoginPopup";
import config from '../shared/config/api';
import UserDropdown from "./UserDropdown";

const headerStyle = {
    background: 'var(--card-bg)',
    borderBottom: `1px solid var(--border)`,
    minHeight: 'clamp(50px, 8vh, 70px)',
    padding: 'clamp(0.5rem, 2vw, 1rem)',
    position: 'sticky',
    top: 0,
    zIndex: '9999',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
};

const Header = () => {
    const [showBrokerPopup, setShowBrokerPopup] = useState(false);
    const [showFyersLoginPopup, setShowFyersLoginPopup] = useState(false);
    const [showDhanLoginPopup, setShowDhanLoginPopup] = useState(false);
    const [dhanStatus, setDhanStatus] = useState({
        isLoggedIn: false,
        profile: null,
        welcome_message: null,
        client_id: null,
        token_validity: null,
        active_segments: null,
        connection_status: null,
        broker: null
    });

    // Check Dhan authentication status
    useEffect(() => {
        const checkDhanStatus = async () => {
            try {
                const response = await fetch(`${config.endpoints.dhanStatus}?user_id=default_user`);
                if (response.ok) {
                    const data = await response.json();
                    console.log('Dhan status response:', data);
                    setDhanStatus(data);
                } else {
                    console.log('Dhan status check failed:', response.status);
                    setDhanStatus({
                        isLoggedIn: false,
                        profile: null,
                        welcome_message: null,
                        client_id: null,
                        token_validity: null,
                        active_segments: null,
                        connection_status: null,
                        broker: null
                    });
                }
            } catch (error) {
                console.error('Error checking Dhan status:', error);
                setDhanStatus({
                    isLoggedIn: false,
                    profile: null,
                    welcome_message: null,
                    client_id: null,
                    token_validity: null,
                    active_segments: null,
                    connection_status: null,
                    broker: null
                });
            }
        };

        checkDhanStatus();
        // Check status every 30 seconds
        const interval = setInterval(checkDhanStatus, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header style={headerStyle}>
            {/* Dhan Welcome Banner */}
            {dhanStatus.isLoggedIn && dhanStatus.welcome_message && (
                <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    border: '1px solid #10b981',
                    borderRadius: '8px',
                    padding: '6px 12px',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                    zIndex: 5
                }}>
                    <CheckCircle size={12} />
                    {dhanStatus.welcome_message}
                    {dhanStatus.client_id && (
                        <span style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontFamily: 'monospace',
                            marginLeft: '6px'
                        }}>
                            ID: {dhanStatus.client_id}
                        </span>
                    )}
                    {dhanStatus.connection_status && (
                        <span style={{
                            background: dhanStatus.connection_status === 'Connected' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            marginLeft: '6px',
                            color: dhanStatus.connection_status === 'Connected' ? '#22c55e' : '#ef4444'
                        }}>
                            {dhanStatus.connection_status}
                        </span>
                    )}
                </div>
            )}

            {/* Broker Integration Button - Top Right */}
            <div>
                <button
                    onClick={() => setShowBrokerPopup(true)}
                    style={{
                        padding: '8px 16px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#ffffff',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <BarChart3 size={14} />
                    Broker
                </button>
            </div>
            {/* User Dropdown */}
            <div style={{
                position: 'absolute',
                top: '16px',
                right: '24px',
                zIndex: 10
            }}>
                <UserDropdown />
            </div>
            {/* Broker Selection Popup */}
            {showBrokerPopup && <BrokerSelectionPopup setShowBrokerPopup={setShowBrokerPopup} setShowFyersLoginPopup={setShowFyersLoginPopup} setShowDhanLoginPopup={setShowDhanLoginPopup} />}
            {/* Fyers Login Popup */}
            {showFyersLoginPopup && <FyresLoginPopup setShowFyersLoginPopup={setShowFyersLoginPopup} />}
            {/* Dhan Login Popup */}
            {showDhanLoginPopup && <DhanLoginPopup setShowDhanLoginPopup={setShowDhanLoginPopup} />}
        </header>
    )
}

export default Header;
