import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  GraduationCap, Menu, X, Bell, LogOut, User,
  ChevronDown, Shield
} from 'lucide-react';
import './Layout.css';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthenticated, isHeadTeacher } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/news', label: 'News & Events' },
    { to: '/register', label: 'Admission' },
    { to: '/contact', label: 'Contact' },
  ];

  function handleLogout() {
    logout();
    navigate('/');
    setUserMenuOpen(false);
  }

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="layout">
      <header className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="navbar-brand">
            <div className="brand-icon">
              <GraduationCap size={22} />
            </div>
            <div className="brand-text">
              <span className="brand-name">𝘎𝘖𝘛𝘈𝘔𝘈𝘙𝘠 𝘋𝘕𝘚𝘊</span>
              <span className="brand-sub">Excellence in Education</span>
            </div>
          </Link>

          <nav className={`navbar-links ${menuOpen ? 'open' : ''}`}>
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-link ${isActive(link.to) ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="navbar-actions">
            {isAuthenticated && user ? (
              <div className="user-menu-wrapper">
                <button className="user-btn" onClick={() => setUserMenuOpen(v => !v)}>
                  <div className="user-avatar">
                    {user.name.charAt(0)}
                  </div>
                  <span className="user-name-short">{user.name.split(' ')[0]}</span>
                  <ChevronDown size={14} />
                </button>
                {userMenuOpen && (
                  <div className="user-dropdown">
                    <div className="dropdown-header">
                      <div className="dropdown-name">{user.name}</div>
                      <div className="dropdown-role">{user.role?.replace('_', ' ').toUpperCase()}</div>
                    </div>
                    {isHeadTeacher && (
                      <Link to="/admin" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                        <Shield size={14} /> Admin Dashboard
                      </Link>
                    )}
                    {(user.role === 'teacher') && (
                      <Link to="/teacher" className="dropdown-item" onClick={() => setUserMenuOpen(false)}>
                        <User size={14} /> Teacher Portal
                      </Link>
                    )}
                    <button className="dropdown-item danger" onClick={handleLogout}>
                      <LogOut size={14} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-login">Staff Login</Link>
            )}
            <button className="hamburger" onClick={() => setMenuOpen(v => !v)}>
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <main className="page-content">
        {children}
      </main>

      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="footer-logo">
                <GraduationCap size={28} />
              </div>
              <div>
                <div className="footer-school-name">𝘎𝘖𝘛𝘈𝘔𝘈𝘙𝘠 𝘋𝘕𝘚𝘊</div>
                <div className="footer-tagline">Shaping Tomorrow's Leaders</div>
              </div>
            </div>
            <div className="footer-links-grid">
              <div className="footer-col">
                <h4>Quick Links</h4>
                <Link to="/">Home</Link>
                <Link to="/about">About School</Link>
                <Link to="/news">News & Events</Link>
                <Link to="/register">Admissions</Link>
              </div>
              <div className="footer-col">
                <h4>Academic</h4>
                <Link to="/about#teachers">Our Teachers</Link>
                <Link to="/about#curriculum">Curriculum</Link>
                <Link to="/about#facilities">Facilities</Link>
                <Link to="/news">Achievements</Link>
              </div>
              <div className="footer-col">
                <h4>Contact</h4>
                <span>📍 123 Education Road, Dhaka</span>
                <span>📞 +880 1700-000000</span>
                <span>✉️ info@gotamarydnsc.edu.bd</span>
                <span>🕐 Sun–Thu: 7:30am–2:30pm</span>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 𝘎𝘖𝘛𝘈𝘔𝘈𝘙𝘠 𝘋𝘕𝘚𝘊. All rights reserved.</span>
            <span>Empowering minds, building futures.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
