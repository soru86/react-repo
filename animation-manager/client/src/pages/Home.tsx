import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home-container">
      <div className="home-hero">
        <h1>🎬 Lottie Animation Manager</h1>
        <p className="home-subtitle">
          Manage, organize, and share your Lottie animations with offline-first support
        </p>
        {user ? (
          <div className="home-actions">
            <Link to="/animations" className="btn-primary btn-large">
              Browse Animations
            </Link>
            <Link to="/upload" className="btn-secondary btn-large">
              Upload Animation
            </Link>
          </div>
        ) : (
          <div className="home-actions">
            <Link to="/register" className="btn-primary btn-large">
              Get Started
            </Link>
            <Link to="/login" className="btn-secondary btn-large">
              Login
            </Link>
          </div>
        )}
      </div>
      <div className="home-features">
        <div className="feature-card">
          <h3>📦 Offline First</h3>
          <p>Access your animations even when you're offline using service workers</p>
        </div>
        <div className="feature-card">
          <h3>🎨 Lottie Support</h3>
          <p>Upload and preview Lottie JSON animation files seamlessly</p>
        </div>
        <div className="feature-card">
          <h3>🔒 Secure</h3>
          <p>JWT-based authentication keeps your animations safe</p>
        </div>
        <div className="feature-card">
          <h3>🌐 Share & Discover</h3>
          <p>Make animations public or keep them private for your use</p>
        </div>
      </div>
    </div>
  );
}





