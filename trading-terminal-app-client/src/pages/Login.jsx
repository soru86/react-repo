import googleLogo from '../assets/google.svg';
import facebookLogo from '../assets/facebook.svg';
import { useState } from 'react';
import { useAuth } from "../shared/context/AuthProvider";
import { useSnackbar } from '../shared/context/SnackbarContext';
import { useGoogleLogin } from '@react-oauth/google';
import { getSnackbarVariant } from '../shared/utils/common-utils';
import { BACKEND_BASE_URL } from '../shared/config/api';

const Login = () => {
    const { postLogin } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { showSnackbar } = useSnackbar();
    const login = useGoogleLogin({
        onSuccess: async (credentialResponse) => {
            const userInfo = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                    Authorization: `Bearer ${credentialResponse.access_token}`
                }
            });
            const userData = await userInfo.json();
            console.log('User Data:', userData);
            await postLogin({
                user: {
                    email_id: userData.email,
                    user_name: userData.name,
                    auth_type: 'google',
                    authenticated: true,
                    credential: credentialResponse
                }
            });
        },
        onError: () => {
            showSnackbar({
                message: "Google authentication failed!",
                variant: getSnackbarVariant('error')
            });
        }
    });

    const handleGoogleLogin = async (e) => {
        e.preventDefault();
        login();
    };

    const handleFacebookLogin = async (e) => {
        e.preventDefault();
        const response = await fetch(`${BACKEND_BASE_URL}/oauth/facebook/login`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            mode: 'cors'
        });
        const authUrl = await response.json();
        window.location.href = authUrl;
    };

    const handleBasicLogin = async (e) => {
        e.preventDefault();
        if (username && password) {
            const response = await fetch(`${BACKEND_BASE_URL}/basic-auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email_id: username, password })
            });
            const data = await response.json();
            if (data[0].authenticated) {
                await postLogin({ user: data[0] });
            } else {
                showSnackbar({
                    message: "Login failed!",
                    variant: getSnackbarVariant('error')
                });
            }
        } else if (!username || !password) {
            showSnackbar({
                message: "Please enter your username and password",
                variant: getSnackbarVariant('error')
            });
        }
    };

    return (
        <div className='dark'>
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                <div className="max-w-md w-full space-y-8 p-8 rounded-lg shadow-md bg-white dark:bg-gray-800">
                    <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
                        Welcome Back
                    </h2>
                    <form className="space-y-6" onSubmit={handleBasicLogin}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Username <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded shadow-sm focus:outline-none focus:ring focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex justify-between text-sm">
                            <a href="/signup" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                                Sign up
                            </a>
                            <a href="/forgot-password" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                                Forgot Password?
                            </a>
                        </div>
                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            >
                                Login
                            </button>
                            <button
                                type="button"
                                className="w-full px-4 py-2 bg-gray-300 dark:bg-gray-600 dark:text-white rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                    <div className="flex items-center py-4">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="mx-4 text-gray-500">Or Continue with</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                    <div className="mt-6 space-y-2">
                        <button className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700" onClick={handleGoogleLogin}>
                            <img className="w-5 h-5" src={googleLogo} alt="Google Logo" />
                            <p>Sign in with Google</p>
                        </button>
                        <button className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 opacity-50 cursor-none pointer-events-none" onClick={handleFacebookLogin} disabled>
                            <img className="w-5 h-5" src={facebookLogo} alt="Facebook Logo" />
                            <p>Sign in with Facebook <i>[Coming soon...]</i></p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
