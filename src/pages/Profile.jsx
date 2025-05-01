import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const nick = localStorage.getItem("nickname");
    const ava = localStorage.getItem("avatar");

    if (!token) {
      navigate("/login");
    } else {
      setNickname(nick);
      setAvatar(ava);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="container">
      <h2>Benvenuto, {nickname}</h2>
      {avatar && <img src={avatar} alt="Avatar" style={{ width: 100, borderRadius: "50%" }} />}
      <p>Hai effettuato l'accesso con successo.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
