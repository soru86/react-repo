import { brokerOptions } from "../data/broker-data";
import { Shield, BarChart3 } from 'lucide-react';

const BrokerSelectionPopup = ({ setShowBrokerPopup, setShowFyersLoginPopup, setShowDhanLoginPopup }) => {
    const handleFyersPopupLogin = () => {
        setShowBrokerPopup(false);
        // Show Fyers login popup instead of scrolling to section
        setShowFyersLoginPopup(true);
    };

    const handleDhanPopupLogin = () => {
        setShowBrokerPopup(false);
        // Show Dhan login popup
        setShowDhanLoginPopup(true);
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                borderRadius: '16px',
                padding: '24px',
                maxWidth: '400px',
                width: '90%',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
                border: '1px solid #334155'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                    }}>
                        <BarChart3 size={20} color="#ffffff" />
                    </div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#f1f5f9' }}>
                            Select Broker
                        </h2>
                        <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8' }}>
                            Choose your preferred trading broker
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                    {brokerOptions.filter(option => option.value !== '').map((option) => (
                        <button
                            key={option.value}
                            onClick={() => {
                                if (option.value === 'fyers') {
                                    handleFyersPopupLogin();
                                } else if (option.value === 'dhan') {
                                    handleDhanPopupLogin();
                                }
                            }}
                            style={{
                                padding: '12px 16px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid #334155',
                                borderRadius: '8px',
                                color: '#ffffff',
                                cursor: 'pointer',
                                fontSize: '14px',
                                fontWeight: '500',
                                textAlign: 'left',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                        >
                            <div style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '8px',
                                background: option.value === 'fyers'
                                    ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                                    : option.value === 'dhan'
                                        ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' // Dhan color
                                        : 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <Shield size={16} color="#ffffff" />
                            </div>
                            <div>
                                <div style={{ fontWeight: '600' }}>{option.label}</div>
                                <div style={{
                                    fontSize: '12px',
                                    color: option.value === 'fyers' ? '#10b981' : option.value === 'dhan' ? '#ef4444' : '#94a3b8'
                                }}>
                                    {option.value === 'fyers' ? 'Fully Integrated' : option.value === 'dhan' ? 'Fully Integrated' : 'Coming Soon'}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => setShowBrokerPopup(false)}
                        style={{
                            flex: 1,
                            padding: '10px 16px',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '500',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'}
                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default BrokerSelectionPopup;
