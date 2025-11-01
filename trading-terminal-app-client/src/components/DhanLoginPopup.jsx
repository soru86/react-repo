import { useState } from "react";
import config from '../shared/config/api';
import { useEffect } from "react";
import { User, LogIn, LogOut, Shield } from 'lucide-react';

const { endpoints } = config;

const DhanLoginPopup = ({ setShowDhanLoginPopup }) => {
    const [loginForm, setLoginForm] = useState({
        jwtToken: ''
    });

    const [auth, setAuth] = useState({
        isLoggedIn: false,
        userProfile: null,
        accessToken: null,
        loading: false,
        error: null
    });

    // Check if user is already logged in
    useEffect(() => {
        const validateToken = async (token) => {
            try {
                const response = await fetch(`${endpoints['dhanStatus']}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                return response.ok;
            } catch (err) {
                console.error("Error validating the token.", err);
                return false;
            }
        };
        const checkAuth = async () => {
            const profile = localStorage.getItem('dhan_user_profile');

            if (profile) {
                // Check if user is still authenticated by calling the status endpoint
                try {
                    const response = await fetch(`${endpoints['dhanStatus']}?user_id=default_user`);
                    if (response.ok) {
                        const data = await response.json();
                        if (data.isLoggedIn) {
                            setAuth({
                                isLoggedIn: true,
                                userProfile: JSON.parse(profile),
                                accessToken: null,
                                loading: false,
                                error: null
                            });
                        } else {
                            handleDhanLogout();
                        }
                    } else {
                        handleDhanLogout();
                    }
                } catch (error) {
                    console.error('Error checking auth status:', error);
                    handleDhanLogout();
                }
            }
        };

        checkAuth();
    }, []);

    const handleLogin = async () => {
        if (!loginForm.jwtToken) {
            setAuth(prev => ({ ...prev, error: 'Please enter your JWT Token' }));
            return;
        }

        setAuth(prev => ({ ...prev, loading: true, error: null }));

        try {
            // Test the JWT token by making a request to the profile endpoint
            const response = await fetch(`${endpoints['dhanProfile']}`, {
                headers: {
                    'access-token': loginForm.jwtToken,
                    'user-id': 'default_user'  // You can make this dynamic based on actual user ID
                }
            });

            if (response.ok) {
                const profileData = await response.json();
                
                // Store only the profile data (token is stored server-side)
                localStorage.setItem('dhan_user_profile', JSON.stringify(profileData));

                setAuth({
                    isLoggedIn: true,
                    userProfile: profileData,
                    accessToken: null, // Don't store token in frontend state
                    loading: false,
                    error: null
                });

                // Clear the form
                setLoginForm({ jwtToken: '' });
            } else {
                const errorData = await response.json();
                setAuth(prev => ({
                    ...prev,
                    loading: false,
                    error: errorData.error || 'Invalid JWT token. Please check your token and try again.'
                }));
            }
        } catch (error) {
            setAuth(prev => ({
                ...prev,
                loading: false,
                error: 'Failed to authenticate. Please check your internet connection and try again.'
            }));
        }
    };

    const handleDhanLogout = () => {
        setAuth({
            isLoggedIn: false,
            userProfile: null,
            accessToken: null,
            loading: false,
            error: null
        });

        localStorage.removeItem('dhan_user_profile');
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
                maxWidth: '500px',
                width: '90%',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
                border: '1px solid #334155'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                    }}>
                        <Shield size={20} color="#ffffff" />
                    </div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#f1f5f9' }}>
                            Dhan Trading Integration
                        </h2>
                        <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8' }}>
                            Connect your Dhan account using JWT Token
                        </p>
                    </div>
                </div>

                {auth.isLoggedIn ? (
                    <div style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid #10b981',
                        borderRadius: '8px',
                        padding: '16px',
                        marginBottom: '20px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <User size={20} color="#10b981" />
                            <div>
                                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#10b981' }}>
                                    Connected to Dhan
                                </h3>
                                {auth.userProfile?.welcome_message && (
                                    <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#10b981', fontWeight: '500' }}>
                                        {auth.userProfile.welcome_message}
                                    </p>
                                )}
                                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#94a3b8' }}>
                                    Welcome, {auth.userProfile?.name || auth.userProfile?.display_name || auth.userProfile?.displayName || 'User'}
                                </p>
                                {auth.userProfile?.client_id && (
                                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>
                                        Client ID: {auth.userProfile.client_id}
                                    </p>
                                )}
                                {auth.userProfile?.token_validity && (
                                    <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748b' }}>
                                        Token Valid: {auth.userProfile.token_validity}
                                    </p>
                                )}
                                {auth.userProfile?.active_segments && (
                                    <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748b' }}>
                                        Segments: {auth.userProfile.active_segments}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={handleDhanLogout}
                                style={{
                                    padding: '8px 16px',
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    border: '1px solid #ef4444',
                                    borderRadius: '6px',
                                    color: '#ef4444',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                <LogOut size={16} />
                                Disconnect
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
                        <div>
                            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px', fontSize: '12px' }}>
                                JWT Token
                            </label>
                            <textarea
                                value={loginForm.jwtToken}
                                onChange={(e) => setLoginForm(prev => ({ ...prev, jwtToken: e.target.value }))}
                                placeholder="Enter your Dhan JWT Token"
                                rows={4}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid #334155',
                                    borderRadius: '6px',
                                    color: '#ffffff',
                                    fontSize: '14px',
                                    outline: 'none',
                                    resize: 'vertical',
                                    fontFamily: 'monospace'
                                }}
                            />
                            <div style={{
                                fontSize: '11px',
                                color: '#64748b',
                                marginTop: '4px',
                                fontStyle: 'italic'
                            }}>
                                Enter your Dhan JWT token to authenticate
                            </div>
                        </div>

                        {auth.error && (
                            <div style={{
                                padding: '8px 12px',
                                background: 'rgba(239, 68, 68, 0.1)',
                                border: '1px solid #ef4444',
                                borderRadius: '6px',
                                color: '#ef4444',
                                fontSize: '14px'
                            }}>
                                {auth.error}
                            </div>
                        )}

                        <button
                            onClick={handleLogin}
                            disabled={auth.loading}
                            style={{
                                padding: '12px 24px',
                                background: auth.loading ? '#334155' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#ffffff',
                                cursor: auth.loading ? 'not-allowed' : 'pointer',
                                fontSize: '14px',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                opacity: auth.loading ? 0.7 : 1
                            }}
                        >
                            {auth.loading ? (
                                <>
                                    <div style={{
                                        width: '16px',
                                        height: '16px',
                                        border: '2px solid #ffffff',
                                        borderTop: '2px solid transparent',
                                        borderRadius: '50%',
                                        animation: 'spin 1s linear infinite'
                                    }}></div>
                                    Connecting...
                                </>
                            ) : (
                                <>
                                    <LogIn size={16} />
                                    Connect Dhan Account
                                </>
                            )}
                        </button>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => setShowDhanLoginPopup(false)}
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
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DhanLoginPopup