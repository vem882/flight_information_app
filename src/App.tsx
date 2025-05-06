import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { FaBars, FaTimes } from "react-icons/fa"
import './App.css';
import { Airport, Airline, Home } from './components';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 701);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 701;
      setIsMobile(mobile);
      if (!mobile) setMenuOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <Router>
      <header className="header">
        <nav className="nav">
          <div className="nav-logo">LentoInfo</div>
          
          {isMobile && (
            <button
              className={`nav-burger ${menuOpen ? 'open' : ''}`}
              aria-label={menuOpen ? 'Sulje valikko' : 'Avaa valikko'}
              onClick={toggleMenu}
            >
              {menuOpen ? <FaTimes size={28} color="#fff" /> : <FaBars size={28} color="#fff" />}
            </button>
          )}

          <div className={`nav-links ${menuOpen ? 'open' : ''} ${!isMobile ? 'desktop' : ''}`}>
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
              Etusivu
            </NavLink>
            <NavLink to="/airport" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
              Lentokenttähaku
            </NavLink>
            <NavLink to="/airline" className={({ isActive }) => isActive ? 'active' : ''} onClick={closeMenu}>
              Lentoyhtiöhaku
            </NavLink>
          </div>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/airport" element={<Airport />} />
          <Route path="/airline" element={<Airline />} />
        </Routes>
      </main>
      <footer>
        <small>&copy; 2025 LentoInfo Made by ❤️ <a href="https://github.com/vem882/flight_information_app">Martin Negin</a></small><br />
        <small>Sivuston lentodata tarjoaa Flightradar24, sekä Finavia API-rajapinnat.</small>
      </footer>
    </Router>
  );
}

export default App;