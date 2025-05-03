import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Marketplace from "./pages/Marketplace";
import YourGames from "./pages/YourGames";
import AdminDashboard from "./pages/AdminDashboard";
import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* 🔐 Rotte protette */}
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="/marketplace"
          element={
            <RequireAuth>
              <Marketplace />
            </RequireAuth>
          }
        />
        <Route
          path="/your-games"
          element={
            <RequireAuth>
              <YourGames />
            </RequireAuth>
          }
        />

        {/* 🔐 Solo Admin */}
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminDashboard />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
