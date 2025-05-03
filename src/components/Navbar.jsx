import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav style={{ padding: "1rem", background: "#1e1e1e", display: "flex", gap: "1rem" }}>
      <Link to="/">Home</Link>

      {user ? (
        <>
          <Link to="/profile">Profile</Link>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/your-games">Your Games</Link>
          <button onClick={handleLogout} style={{ background: "transparent", border: "none", color: "#ff5555", cursor: "pointer" }}>
            Logout
          </button>
        </>
      ) : (
        <>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </>
      )}
    </nav>
  );
};

export default Navbar;
