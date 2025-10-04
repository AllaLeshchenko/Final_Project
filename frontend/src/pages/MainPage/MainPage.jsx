import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

function MainPage() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout"); // /api/auth/logout
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <main className="App">
      <header>
        <button onClick={handleLogout}>Logout</button>
      </header>
      <h1>Главная страница Ichgram 📸</h1>
      <p>Здесь будет лента постов.</p>
    </main>
  );
}

export default MainPage;
