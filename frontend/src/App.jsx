import { useState } from "react";

const API_URL = "http://localhost:5000";

function App() {
  const [view, setView] = useState("register"); // register | login | profile
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const [profileMessage, setProfileMessage] = useState("");

  // نبعت طلب التسجيل
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error);
        return;
      }

      setMessage("Registered successfully! Now log in.");
      setView("login");
    } catch (err) {
      setMessage("Something went wrong. Is the backend running?");
    }
  };

  // نبعت طلب الدخول
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error);
        return;
      }

      setToken(data.token);
      setView("profile");
    } catch (err) {
      setMessage("Something went wrong. Is the backend running?");
    }
  };

  // نجيب بيانات الـ protected endpoint
  const handleGetProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        setProfileMessage(data.error);
        return;
      }

      setProfileMessage(data.message);
    } catch (err) {
      setProfileMessage("Something went wrong.");
    }
  };

  const handleLogout = () => {
    setToken("");
    setUsername("");
    setPassword("");
    setMessage("");
    setProfileMessage("");
    setView("login");
  };

  return (
    <div style={{ maxWidth: 400, margin: "60px auto", fontFamily: "sans-serif" }}>
      <h2>Secure Auth Demo</h2>

      {view === "register" && (
        <form onSubmit={handleRegister}>
          <h3>Register</h3>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button type="submit">Register</button>
          <p>
            Already have an account?{" "}
            <span style={{ color: "blue", cursor: "pointer" }} onClick={() => setView("login")}>
              Login
            </span>
          </p>
        </form>
      )}

      {view === "login" && (
        <form onSubmit={handleLogin}>
          <h3>Login</h3>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          <button type="submit">Login</button>
          <p>
            No account?{" "}
            <span style={{ color: "blue", cursor: "pointer" }} onClick={() => setView("register")}>
              Register
            </span>
          </p>
        </form>
      )}

      {view === "profile" && (
        <div>
          <h3>You're logged in 🎉</h3>
          <button onClick={handleGetProfile}>Get Protected Profile Data</button>
          <button onClick={handleLogout} style={{ marginLeft: 10 }}>
            Logout
          </button>
          {profileMessage && <p>{profileMessage}</p>}
        </div>
      )}

      {message && <p style={{ color: "red" }}>{message}</p>}
    </div>
  );
}

export default App;