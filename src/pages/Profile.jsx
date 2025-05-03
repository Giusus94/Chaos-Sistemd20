
// ✅ Profile.jsx
import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) return <p>Caricamento...</p>;

  return (
    <div>
      <h2>Benvenuto, {user.nickname || "-"}</h2>
      <img src={user.avatar} alt="Avatar" width={100} height={100} />
      <p>Email: {user.email}</p>
    </div>
  );
}