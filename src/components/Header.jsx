import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  // 💡 State to manage mobile menu toggle internally without direct DOM layout manipulation
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="p-5 text-center border-bottom border-secondary bg-dark">
      <img src="/logo192.png" alt="SGYMT Logo" className="mb-3" width="150" />
      <h1 className="mb-3 text-danger">Simple Gym Tracker</h1>
      
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/dashboard" onClick={() => setIsMenuOpen(false)}>
            <img src="/logo192.png" alt="SGYMT Logo" width="50" />
          </Link>
          
          {/* Mobile Menu Toggler Button */}
          <button
            className="navbar-toggler"
            type="button"
            aria-controls="navbarNav"
            aria-expanded={isMenuOpen}
            aria-label="Toggle navigation"
            onClick={toggleMenu} // 💡 Trigger local React state toggle toggle control
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          {/* Conditionally apply 'show' class based on component rendering state flags */}
          <div className={`collapse navbar-collapse ${isMenuOpen ? "show" : ""}`} id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/profile" onClick={() => setIsMenuOpen(false)}>
                  My Profile
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/search" onClick={() => setIsMenuOpen(false)}>
                  Find Account
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}