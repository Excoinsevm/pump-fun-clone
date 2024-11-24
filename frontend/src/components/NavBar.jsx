import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { ConnectKitButton } from "connectkit";
import "../App.css";

const NavBar = () => {
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleViewProfile = () => {
    if (address) {
      navigate(`/profile/${address}`);
    }
    setIsDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-logo">
          <img src="https://pump.fun/logo.png" alt="Logo" className="logo-image" />
        </Link>
        
        <button 
          className="mobile-menu-button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰
        </button>
        
        <div className={`nav-links ${isMobileMenuOpen ? 'show' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>[how it works]</Link>
          <Link to="/" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>[advanced]</Link>
        </div>
      </div>

      <div className="nav-right">
        {isConnected ? (
          <div className="wallet-info">
            <span className="balance">(1.79 ETH)</span>
            <div 
              className="profile-dropdown"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <img src="https://pump.fun/logo.png" alt="Profile" className="nav-profile-avatar" />
              <span className="username">qiwihui</span>
              <span className="dropdown-arrow">▼</span>
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <button 
                    className="dropdown-item"
                    onClick={handleViewProfile}
                  >
                    [view profile]
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <ConnectKitButton />
        )}
      </div>
    </nav>
  );
};

export default NavBar;
