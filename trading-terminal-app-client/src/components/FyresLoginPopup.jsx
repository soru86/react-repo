import { useState } from "react";
import config from '../shared/config/api';
import { useEffect } from "react";
import { User, LogIn, LogOut, Shield } from 'lucide-react';

const { redirectURL, endpoints } = config;

const FyresLoginPopup = ({ setShowFyersLoginPopup }) => {
    const [loginForm, setLoginForm] = useState({
        clientId: '',
        secretKey: '',
        redirectUri: `${redirectURL}/fyers/callback`
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
                const response = await fetch(endpoints['gainersLosers'], {
                    headers: { Authorization: `Bearer ${token}` }
                });
                return response.ok;
            } catch (err) {
                console.error("Error validating the token.", err);
                return false;
            }
        };
        const checkAuth = async () => {
            const token = localStorage.getItem('fyers_access_token');
            const profile = localStorage.getItem('fyers_user_profile');

            if (token && profile) {
                const isValid = await validateToken(token);
                if (!isValid) {
                    handleFyersLogout();
                    return;
                }

                setAuth({
                    isLoggedIn: true,
                    userProfile: JSON.parse(profile),
                    accessToken: token,
                    loading: false,
                    error: null
                });
            }
        };

        checkAuth();
    }, []);

    const handleFyersLogin = async () => {
        if (!loginForm.clientId || !loginForm.secretKey) {
            setAuth(prev => ({ ...prev, error: 'Please enter Client ID and Secret Key' }));
            return;
        }

        setAuth(prev => ({ ...prev, loading: true, error: null }));

        try {
            // Store credentials for backend use
            localStorage.setItem('fyers_client_id', loginForm.clientId);
            localStorage.setItem('fyers_secret_key', loginForm.secretKey);
            localStorage.setItem('fyers_redirect_uri', loginForm.redirectUri);

            // Use the base URL for login
            const loginUrl = `${endpoints['fyersLogin']}?client_id=${encodeURIComponent(loginForm.clientId)}&secret_key=${encodeURIComponent(loginForm.secretKey)}&redirect_uri=${encodeURIComponent(loginForm.redirectUri)}`;

            // Open in new window for OAuth flow
            const authWindow = window.open(loginUrl, 'fyers_auth', 'width=600,height=700');

            // Handle postMessage from popup
            const handleMessage = (event) => {
                if (event.data && event.data.type === 'fyers_auth_success') {
                    // Success - update state and close popup
                    const { data } = event.data;
                    setAuth({
                        isLoggedIn: true,
                        userProfile: data.profile,
                        accessToken: data.access_token,
                        loading: false,
                        error: null
                    });

                    localStorage.setItem('fyers_access_token', data.access_token);
                    localStorage.setItem('fyers_user_profile', JSON.stringify(data.profile));

                    // Close popup if still open
                    if (authWindow && !authWindow.closed) {
                        authWindow.close();
                    }

                    // Remove event listener
                    window.removeEventListener('message', handleMessage);
                } else if (event.data && event.data.type === 'fyers_auth_error') {
                    // Error - update state
                    setAuth(prev => ({
                        ...prev,
                        loading: false,
                        error: event.data.data.error
                    }));

                    // Remove event listener
                    window.removeEventListener('message', handleMessage);
                }
            };

            // Add event listener for postMessage
            window.addEventListener('message', handleMessage);

            // Fallback: Poll for completion if postMessage doesn't work
            const checkAuth = setInterval(() => {
                if (authWindow.closed) {
                    clearInterval(checkAuth);
                    // Check if we have auth data, if not, check status
                    const token = localStorage.getItem('fyers_access_token');
                    if (!token) {
                        checkAuthStatus();
                    }
                }
            }, 1000);

        } catch (error) {
            setAuth(prev => ({
                ...prev,
                loading: false,
                error: 'Login failed: ' + error.message
            }));
        }
    };

    const checkAuthStatus = async () => {
        try {
            const response = await fetch(`${endpoints['fyersStatus']}`);
            const data = await response.json();

            if (data.isLoggedIn) {
                setAuth({
                    isLoggedIn: true,
                    userProfile: data.profile,
                    accessToken: data.accessToken,
                    loading: false,
                    error: null
                });

                localStorage.setItem('fyers_access_token', data.accessToken);
                localStorage.setItem('fyers_user_profile', JSON.stringify(data.profile));
            }
        } catch (error) {
            console.error('Auth status check failed:', error);
        }
    };

    const handleFyersLogout = () => {
        setAuth({
            isLoggedIn: false,
            userProfile: null,
            accessToken: null,
            loading: false,
            error: null
        });

        localStorage.removeItem('fyers_access_token');
        localStorage.removeItem('fyers_user_profile');
        localStorage.removeItem('fyers_client_id');
        localStorage.removeItem('fyers_secret_key');
        localStorage.removeItem('fyers_redirect_uri');
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
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                    }}>
                        <Shield size={20} color="#ffffff" />
                    </div>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#f1f5f9' }}>
                            Fyers Trading Integration
                        </h2>
                        <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8' }}>
                            Connect your Fyers account for real trading
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
                                    Connected to Fyers
                                </h3>
                                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#94a3b8' }}>
                                    Welcome, {auth.userProfile?.name || auth.userProfile?.display_name || auth.userProfile?.displayName || 'User'}
                                </p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                onClick={handleFyersLogout}
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
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div>
                                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px', fontSize: '12px' }}>
                                    Client ID
                                </label>
                                <input
                                    type="text"
                                    value={loginForm.clientId}
                                    onChange={(e) => setLoginForm(prev => ({ ...prev, clientId: e.target.value }))}
                                    placeholder="Enter your Fyers Client ID"
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        border: '1px solid #334155',
                                        borderRadius: '6px',
                                        color: '#ffffff',
                                        fontSize: '14px',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px', fontSize: '12px' }}>
                                    Secret Key
                                </label>
                                <input
                                    type="password"
                                    value={loginForm.secretKey}
                                    onChange={(e) => setLoginForm(prev => ({ ...prev, secretKey: e.target.value }))}
                                    placeholder="Enter your Fyers Secret Key"
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        border: '1px solid #334155',
                                        borderRadius: '6px',
                                        color: '#ffffff',
                                        fontSize: '14px',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', color: '#94a3b8', marginBottom: '4px', fontSize: '12px' }}>
                                Redirect URI
                            </label>
                            <input
                                type="text"
                                value={loginForm.redirectUri}
                                onChange={(e) => setLoginForm(prev => ({ ...prev, redirectUri: e.target.value }))}
                                placeholder={`${redirectURL}/fyers/callback`}
                                style={{
                                    width: '100%',
                                    padding: '8px 12px',
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid #334155',
                                    borderRadius: '6px',
                                    color: '#ffffff',
                                    fontSize: '14px',
                                    outline: 'none'
                                }}
                            />
                            <div style={{
                                fontSize: '11px',
                                color: '#64748b',
                                marginTop: '4px',
                                fontStyle: 'italic'
                            }}>
                                Default: {`${redirectURL}/fyers/callback`}
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
                            onClick={handleFyersLogin}
                            disabled={auth.loading}
                            style={{
                                padding: '12px 24px',
                                background: auth.loading ? '#334155' : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
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
                                    Connect Fyers Account
                                </>
                            )}
                        </button>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                        onClick={() => setShowFyersLoginPopup(false)}
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

export default FyresLoginPopup;
