import './index.css';
import App from './App';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './shared/context/ThemeContext';
import { BrowserRouter } from "react-router";
import { AuthProvider } from './shared/context/AuthProvider';
import { SnackbarProvider } from './shared/context/SnackbarContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GOOGLE_CLIENT_ID } from './shared/config/api';
import { WebsocketProvider } from './shared/context/WebsocketProvider';

createRoot(document.getElementById('root')).render(
    <ThemeProvider>
        <BrowserRouter>
            <AuthProvider>
                <WebsocketProvider>
                    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                        <SnackbarProvider>
                            <App />
                        </SnackbarProvider>
                    </GoogleOAuthProvider>
                </WebsocketProvider>
            </AuthProvider>
        </BrowserRouter>
    </ThemeProvider >
);
