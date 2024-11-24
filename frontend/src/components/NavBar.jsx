import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import { ConnectKitButton } from "connectkit";
import "../App.css";

const NavBar = () => {
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
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
          {/* Replace with your logo */}
          <img src="https://pump.fun/logo.png" alt="Logo" className="logo-image" />
        </Link>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">[how it works]</Link>
          <Link to="/" className="nav-link">[advanced]</Link>
          {/* <div className="support-links">
            <span className="nav-link">[support]</span>
            <div className="social-links">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <img src="/path/to/twitter-icon" alt="Twitter" />
              </a>
              <a href="https://telegram.org" target="_blank" rel="noopener noreferrer">
                <img src="/path/to/telegram-icon" alt="Telegram" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <img src="/path/to/instagram-icon" alt="Instagram" />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer">
                <img src="/path/to/tiktok-icon" alt="TikTok" />
              </a>
            </div>
          </div> */}
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
