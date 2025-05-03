import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'
import './App.css'
import { Airport, Airline, Home } from './components'

function App() {
  return (
    <Router>
      <header>
        <nav className="nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>Etusivu</NavLink>
          <NavLink to="/airport" className={({ isActive }) => isActive ? 'active' : ''}>Lentokenttähaku</NavLink>
          <NavLink to="/airline" className={({ isActive }) => isActive ? 'active' : ''}>Lentoyhtiöhaku</NavLink>
        </nav>
      </header>
      <main>
      <h1>Lentotukikohdan  informaatio sovellus</h1>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/airport" element={<Airport />} />
          <Route path="/airline" element={<Airline />} />
        </Routes>
      </main>
      <footer>
        <small>&copy; 2025 LentoInfo</small>
      </footer>
    </Router>
  )
}

export default App
