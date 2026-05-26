import React, { useState } from "react";
import {useNavigate} from "react-router-dom"
import "../styles/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

const handleSubmit = async (e) => {
    e.preventDefault();
    setMessages([]);

    try {
      const res = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages([data.message || "Błąd logowania"]);
        return;
      }

      //  zapis tokena
      localStorage.setItem("token", data.token);

      //  przekierowanie
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setMessages(["Błąd połączenia z serwerem"]);
    }
  };

  

  return (
    <div className="flex-column-center-center" id="login-page">
      <h1>LOGIN</h1>

      {messages.map((msg, i) => (
        <p key={i} className="error">{msg}</p>
      ))}


      <form className="flex-column-center-center" onSubmit={handleSubmit}>
        <div className="form-control">
          <i className="fa-solid fa-envelope" style={{ color: "#272b35" }}></i>
          <input
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-control">
          <i className="fa-solid fa-lock" style={{ color: "#272b35" }}></i>
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">
          <i className="fa-solid fa-arrow-right-to-bracket" style={{ color: "#e5e9f0" }}></i>{" "}
          SIGN IN
        </button>

        <a href="/register" className="register-button">
          <i className="fa-solid fa-user-plus" style={{ color: "#e5e9f0" }}></i> REGISTER
        </a>
      </form>
    </div>
  );
}

export default Login;
