import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav style={{ padding: "1rem", background: "#1e1e1e", display: "flex", gap: "1rem" }}>
    <Link to="/">Home</Link>
    <Link to="/register">Register</Link>
    <Link to="/login">Login</Link>
    <Link to="/profile">Profile</Link>
    <Link to="/marketplace">Marketplace</Link>
    <Link to="/your-games">Your Games</Link>
  </nav>
);

export default Navbar;
