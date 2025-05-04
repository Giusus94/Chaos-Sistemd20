// ✅ src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Marketplace from "./pages/Marketplace";
import YourGames from "./pages/YourGames";
import RequireAuth from "./components/RequireAuth";
import AdminDashboard from "./pages/AdminDashboard";
import Lobbies from "./pages/Lobbies";
import LobbyDetail from "./pages/LobbyDetail";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

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
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <AdminDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/lobbies"
          element={
            <RequireAuth>
              <Lobbies />
            </RequireAuth>
          }
        />
        <Route
          path="/lobby/:id"
          element={
            <RequireAuth>
              <LobbyDetail />
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
