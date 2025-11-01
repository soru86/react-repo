import { useState } from "react";
import { BACKEND_BASE_URL } from '../shared/config/api';
import { useSnackbar } from '../shared/context/SnackbarContext';
import { getSnackbarVariant } from "../shared/utils/common-utils";
import Spinner from "../components/Spinner";

const Signup = () => {
    const [userData, setUserData] = useState({
        fullName: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const { showSnackbar } = useSnackbar();

    const handleSignup = async (event) => {
        event.preventDefault();

        if (!userData.fullName || !userData.email || !userData.mobile || !userData.password || !userData.confirmPassword) {
            showSnackbar({
                message: "Please fill in all required fields!",
                variant: getSnackbarVariant('error')
            });
            return;
        }

        if (userData.password !== userData.confirmPassword) {
            showSnackbar({
                message: "Passwords do not match!",
                variant: getSnackbarVariant('error')
            });
            return;
        }

        setIsLoading(true);
        try {
            const signupData = {
                full_name: userData.fullName,
                email_id: userData.email,
                mobile_num: userData.mobile,
                password: userData.password
            };

            const response = await fetch(`${BACKEND_BASE_URL}/users/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                mode: 'cors',
                body: JSON.stringify(signupData),
            });

            const data = await response.json();

            if (!response.ok) {
                showSnackbar({
                    message: "Registration failed!",
                    variant: getSnackbarVariant('error')
                });
                return;
            } else {
                showSnackbar({
                    message: "Registration successful! Please login.",
                    variant: getSnackbarVariant('success')
                });
                setUserData({
                    fullName: '',
                    email: '',
                    mobile: '',
                    password: '',
                    confirmPassword: ''
                });
                setTimeout(() => window.location.href = '/login', 1800) // Redirect to login page after successful signup
            }
        } catch (error) {
            console.error("Error during signup:", error);
            showSnackbar({ 
                message: "An error occurred during registration. Please try again later.",
                variant: getSnackbarVariant('error')
            });
            return;
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="max-w-md w-full space-y-8 p-8 rounded-lg shadow-md bg-white dark:bg-gray-800">
                <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
                    Create an Account
                </h2>

                <form className="space-y-6" onSubmit={handleSignup}>
                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className="mt-1 w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
                            placeholder="First Name Last Name"
                            value={userData.fullName}
                            onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email Address (Login Id) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            className="mt-1 w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
                            value={userData.email}
                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                            placeholder="e.g. test@abc.com"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* Mobile */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Mobile Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            className="mt-1 w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
                            placeholder="e.g. +911234567890"
                            value={userData.mobile}
                            onChange={(e) => setUserData({ ...userData, mobile: e.target.value })}
                            required
                            disabled={isLoading}
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            className="mt-1 w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
                            value={userData.password}
                            onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                            required
                            minLength="6"
                            placeholder="At least 6 characters"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Confirm Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            className="mt-1 w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
                            value={userData.confirmPassword}
                            onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
                            required
                            minLength="6"
                            placeholder="Re-enter your password"
                            disabled={isLoading}
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            className={`w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 ${isLoading ? 'pointer-events-none' : ''}`}
                            disabled={isLoading}
                        >
                            <div className="flex items-center justify-center">{isLoading ? <Spinner /> : 'Register'}</div>
                        </button>
                        <button
                            type="button"
                            className={`w-full px-4 py-2 bg-gray-300 dark:bg-gray-600 dark:text-white rounded hover:bg-gray-400 ${isLoading ? 'pointer-events-none' : ''}`}
                            onClick={() => setUserData({ fullName: '', email: '', mobile: '', password: '', confirmPassword: '' })}
                            disabled={isLoading}
                        >
                            Reset
                        </button>
                    </div>

                    {/* Navigation Link */}
                    <p className="text-sm text-center text-gray-600 dark:text-gray-300">
                        Already have an account?{' '}
                        <a href="/login" className="text-indigo-600 hover:underline dark:text-indigo-400">
                            Login here
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Signup;
