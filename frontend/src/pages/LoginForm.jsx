import { useState } from "react";

export default function LoginForm() {
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        credentials: "include", // отправка cookie
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.emailOrUsername,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      alert("Login successful!");
      console.log(data);
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div
      style={{
        width: "350px",
        height: "640px",
        border: "1px solid #dbdbdb",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 30px",
        boxSizing: "border-box",
      }}
    >
      <h1 style={{ fontFamily: "cursive", fontSize: "28px", marginBottom: "30px" }}>
        ICHGRAM
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input
          type="text"
          name="emailOrUsername"
          placeholder="Username, or email"
          value={formData.emailOrUsername}
          onChange={handleChange}
          style={{
            width: "268px",
            height: "38px",
            border: "1px solid #dbdbdb",
            borderRadius: "3px",
            padding: "0 10px",
            fontSize: "14px",
          }}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={{
            width: "268px",
            height: "38px",
            border: "1px solid #dbdbdb",
            borderRadius: "3px",
            padding: "0 10px",
            fontSize: "14px",
          }}
        />

        {error && (
          <p style={{ color: "red", fontSize: "12px", marginTop: "-5px" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          style={{
            width: "268px",
            height: "38px",
            backgroundColor: "#0095f6",
            border: "none",
            borderRadius: "6px",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            marginTop: "10px",
          }}
        >
          Log in
        </button>
      </form>

      <div
        style={{
          width: "100%",
          textAlign: "center",
          margin: "20px 0",
          borderBottom: "1px solid #dbdbdb",
          lineHeight: "0.1em",
        }}
      >
        <span style={{ background: "#fff", padding: "0 10px", fontSize: "12px", color: "#8e8e8e" }}>
          OR
        </span>
      </div>

      <a href="#" style={{ fontSize: "12px", color: "#385185", marginBottom: "20px" }}>
        Forgot password?
      </a>

      <div
        style={{
          width: "100%",
          textAlign: "center",
          borderTop: "1px solid #dbdbdb",
          marginTop: "auto",
          padding: "15px 0",
        }}
      >
        <p style={{ fontSize: "14px" }}>
          Don’t have an account?{" "}
          <a href="/register" style={{ color: "#0095f6", fontWeight: "bold" }}>
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
