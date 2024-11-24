import React from "react";
import "../App.css";
import { ConnectKitButton } from "connectkit";

const NavBar = () => {
  return (
    <nav className="navbar">
      <button className="nav-button">
        <ConnectKitButton />
      </button>
    </nav>
  );
};

export default NavBar;
