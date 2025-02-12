import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthCreation";
import { FaHome, FaSignInAlt, FaUserPlus, FaSignOutAlt } from "react-icons/fa";
import "../styles/Navbar.css";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-link">
          <FaHome className="nav-icon" /> Home
        </Link>
      </div>

      <div className="nav-right">
        {user ? (
          <button onClick={logout} className="nav-button">
            <FaSignOutAlt className="nav-icon" /> Logout
          </button>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              <FaSignInAlt className="nav-icon" /> Login
            </Link>
            <Link to="/register" className="nav-link">
              <FaUserPlus className="nav-icon" /> Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
