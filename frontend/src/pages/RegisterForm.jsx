import { useState } from "react";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      alert("Registration successful!");
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
      <h1
        style={{ fontFamily: "cursive", fontSize: "28px", marginBottom: "30px" }}
      >
        ICHGRAM
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          style={inputStyle}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          style={inputStyle}
        />

        {error && (
          <p style={{ color: "red", fontSize: "12px", marginTop: "-5px" }}>
            {error}
          </p>
        )}

        <button type="submit" style={buttonStyle}>
          Sign up
        </button>
      </form>

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
          Have an account?{" "}
          <a href="/login" style={{ color: "#0095f6", fontWeight: "bold" }}>
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "268px",
  height: "38px",
  border: "1px solid #dbdbdb",
  borderRadius: "3px",
  padding: "0 10px",
  fontSize: "14px",
};

const buttonStyle = {
  width: "268px",
  height: "38px",
  backgroundColor: "#0095f6",
  border: "none",
  borderRadius: "6px",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  marginTop: "10px",
};
