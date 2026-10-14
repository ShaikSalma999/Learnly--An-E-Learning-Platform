import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo.jsx';
import Icon from './Icon.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getInitials } from '../utils/format.js';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', menuOpen);
    return () => document.body.classList.remove('no-scroll');
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    const closeOnDesktop = () => {
      if (window.innerWidth > 860) setMenuOpen(false);
    };
    window.addEventListener('resize', closeOnDesktop);
    return () => window.removeEventListener('resize', closeOnDesktop);
  }, []);

  const handleLogout = () => {
    navigate('/');
    logout();
  };

  const linkClass = ({ isActive }) => `navbar__link${isActive ? ' is-active' : ''}`;

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Logo />

        <button
          type="button"
          className="navbar__toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <Icon name={menuOpen ? 'close' : 'menu'} size={24} />
        </button>

        <nav id="primary-navigation" className={`navbar__panel${menuOpen ? ' is-open' : ''}`} aria-label="Primary">
          <div className="navbar__links">
            <NavLink to="/" end className={linkClass}>Home</NavLink>
            <NavLink to="/courses" className={linkClass}>Courses</NavLink>
            <NavLink to="/my-learning" className={linkClass}>My Learning</NavLink>
          </div>

          <div className="navbar__actions">
            <ThemeToggle />
            {currentUser ? (
              <>
                <span className="navbar__user">
                  <span className="avatar" aria-hidden="true">{getInitials(currentUser.name)}</span>
                  <span className="navbar__user-name">{currentUser.name.split(' ')[0]}</span>
                </span>
                <button type="button" className="btn btn--ghost btn--sm" onClick={handleLogout}>
                  <Icon name="logout" size={16} /> Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn--ghost btn--sm">Log in</Link>
                <Link to="/register" className="btn btn--primary btn--sm">Sign up free</Link>
              </>
            )}
          </div>
        </nav>
      </div>
      {menuOpen && <div className="navbar__backdrop" onClick={() => setMenuOpen(false)} aria-hidden="true" />}
    </header>
  );
}
