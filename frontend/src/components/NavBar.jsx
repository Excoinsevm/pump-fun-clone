import React from "react";
import "../App.css";

const NavBar = () => {
  return (
      <nav className="navbar">
        <a href="#" className="nav-link">
          [how it works]
        </a>
        {/* <a href="#" className="nav-link">
          [docs]
        </a> */}
        <button className="nav-button">[connect wallet]</button>
      </nav>
  );
};

export default NavBar;
