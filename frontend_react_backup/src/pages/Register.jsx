import React, { useState } from "react";
import "../styles/login.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [messages, setMessages] = useState([]);

const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessages(["Hasła nie są takie same"]);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role: "user" // domyślna rola
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages([data.message || "Błąd rejestracji"]);
      } else {
        setMessages(["Użytkownik zarejestrowany pomyślnie!"]);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      console.error(err);
      setMessages(["Błąd sieci"]);
    }
  };

  return (
    <div id="login-page">
      <div className="login-panel">
        <h1>REGISTER</h1>

        {messages.length > 0 && (
          <div className="messages">
            {messages.map((msg, i) => (
              <p key={i}>{msg}</p>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <span role="img" aria-label="email">📧</span>
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <span role="img" aria-label="password">🔒</span>
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-control">
            <span role="img" aria-label="confirm password">🔒</span>
            <input
              type="password"
              placeholder="confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">REGISTER</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
