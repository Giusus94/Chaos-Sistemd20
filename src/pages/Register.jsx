import React from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    // Simula registrazione e redirect
    navigate("/login");
  };

  return (
    <div>
      <h2>Register Page</h2>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;
