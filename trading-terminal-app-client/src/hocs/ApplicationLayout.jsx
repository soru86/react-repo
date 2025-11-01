import { useState } from "react";
import { useTheme } from "../shared/context/ThemeContext";
import { useNavigate } from "react-router";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";

const contentStyle = {
    overflowY: 'auto',
    flex: 1,
    minHeight: 0,
};

const appContainerStyles = (isDarkMode) => ({
    height: '100vh',
    overflow: 'hidden',
    display: 'flex',
    background: isDarkMode ? '#0f172a' : '#f8fafc'
});

const mainContainerStyles = (isDarkMode) => ({
    flex: 1,
    overflow: 'hidden',
    background: isDarkMode ? '#0f172a' : '#f8fafc',
    display: 'flex',
    flexDirection: 'column',
});

const ApplicationLayout = ({ market, children }) => {
    const [selectedMarket, setSelectedMarket] = useState(market);
    const [selectedTab, setSelectedTab] = useState(() => {
        return window.location.pathname.split('/').pop() || 'dashboard';
    });
    const { isDarkMode } = useTheme();
    const navigate = useNavigate();

    const handleBackToLanding = () => {
        setSelectedMarket(null);
        navigate('/', { replace: true });
    };

    return (
        <div style={appContainerStyles(isDarkMode)}>
            <Sidebar
                selectedTab={selectedTab}
                setSelectedTab={setSelectedTab}
                selectedMarket={selectedMarket}
                onBackToLanding={handleBackToLanding}
                market={market}
            />
            <div style={mainContainerStyles(isDarkMode)}>
                {/* Header */}
                <Header />
                <div style={contentStyle}>
                    {children}
                </div>
                {/* Footer */}
                <Footer />
            </div>
        </div>
    )
}

export default ApplicationLayout;
