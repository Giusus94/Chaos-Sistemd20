import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Ricarica utente ogni volta che cambia la location
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav style={{ padding: "1rem", background: "#1e1e1e", display: "flex", gap: "1rem" }}>
      <Link to="/">Home</Link>
      {!user && (
        <>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </>
      )}
      {user && (
        <>
          <Link to="/profile">Profile</Link>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/your-games">Your Games</Link>
          {user.role === "admin" && <Link to="/admin">Dashboard</Link>}
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </nav>
  );
};

export default Navbar;
