import { useState } from "react";
import { BACKEND_BASE_URL } from '../shared/config/api';

export const useRedisCache = (defaultValue) => {
    const [authData, setAuthData] = useState(async () => {
        const lsData = JSON.parse(window.localStorage.getItem("user"));
        try {
            if (!lsData?.user) return null;
            const params = new URLSearchParams({ email: lsData?.user?.email_id });

            if (lsData?.user?.auth_type === 'google') {
                const response = await fetch(`${BACKEND_BASE_URL}/oauth/google/redis/tokens?${params.toString()}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
                const data = await response.json();

                if (data?.user_auth_data) {
                    return data?.user_auth_data;
                } else {
                    const response = await fetch(`${BACKEND_BASE_URL}/oauth/google/redis/tokens?${params.toString()}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                    // Check if the response indicates success
                    if (response?.status === 204) {
                        return defaultValue;
                    } else if (response?.status === 500) {
                        console.error("Resetting the user auth data failed!");
                    }
                }
            } else if (lsData?.user?.auth_type === 'basic') {
                const response = await fetch(`${BACKEND_BASE_URL}/basic-auth/redis/auth-data?${params.toString()}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                });
                const data = await response.json();
                if (data?.user_auth_data) {
                    return data?.user_auth_data;
                } else {
                    const response = await fetch(`${BACKEND_BASE_URL}/basic-auth/redis/auth-data?${params.toString()}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                    // Check if the response indicates success
                    if (response?.status === 204) {
                        return defaultValue;
                    } else if (response?.status === 500) {
                        console.error("Resetting the user auth data failed!");
                    }
                }
            }
        } catch (err) {
            console.error("Error reading/setting Redis cached auth data", err);
            return defaultValue;
        }
    });

    const setValue = async (action, userData, newValue) => {
        try {
            if (action === 'login') {
                if (newValue?.auth_type === 'google') {
                    const response = await fetch(`${BACKEND_BASE_URL}/oauth/google/redis/tokens`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(newValue)
                    });
                    const resp = await response.json();
                    if (resp?.user_auth_data) {
                        return resp?.user_auth_data;
                    } else if (resp?.error === 'Failed to save user auth data') {
                        console.error("Authentication successful, but saving user auth data failed!", resp.error);
                    }
                } else if (newValue?.auth_type === 'basic') {
                    const response = await fetch(`${BACKEND_BASE_URL}/basic-auth/redis/auth-data`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ email_id: newValue?.email_id })
                    });
                    const resp = await response.json();
                    if (resp?.error) {
                        console.error("Authentication successful, but saving user auth data failed!", resp.error);
                    }
                }
            } else if (action === 'logout') {
                const params = new URLSearchParams({ email: userData?.email_id });
                if (userData?.auth_type === 'google') {
                    const response = await fetch(`${BACKEND_BASE_URL}/oauth/google/redis/tokens?${params.toString()}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                    if (response?.status === 500) {
                        console.error("Logout successful, but deleting user auth data failed!");
                    }
                } else if (userData?.auth_type === 'basic') {
                    const response = await fetch(`${BACKEND_BASE_URL}/basic-auth/redis/auth-data?${params.toString()}`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });
                    if (response?.status === 500) {
                        console.error("Logout successful, but deleting user auth data failed!");
                    }
                }
            }
        } catch (err) {
            console.error("Error setting user auth data in Redis:", err);
        }
        setAuthData(newValue);
    };
    return [authData, setValue];
};
