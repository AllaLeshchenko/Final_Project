import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import styles from "./RegisterForm.module.css";
import Logo from "../../assets/ichgram2.png";

function RegisterForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === "userName") {
      setError(""); // очищаем ошибку при вводе
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/register", formData);

      if (res.status === 201) {
        navigate("/"); 
      }
    } catch (err) {
      const field = err.response?.data?.field;
      const message = err.response?.data?.message || "Registration error";

      if (field === "userName") {
        setError(message);
      }
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.containerOne}>
        <img className={styles.logo} src={Logo} alt="LogoApp" />
        <h3>Sign up to see photos and video from your friends.</h3>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputField}>
            <input
              className={styles.input}
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              className={styles.input}
              type="text"
              name="fullName"
              placeholder="Full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <input
              className={`${styles.input} ${error ? styles.inputError : ""}`}
              type="text"
              name="userName"
              placeholder="UserName"
              value={formData.userName}
              onChange={handleChange}
              required
            />
            {error && <p className={styles.error}>{error}</p>}

            <input
              className={styles.input}
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.parField}>
            <p className={styles.par}>
              People who use our service may have uploaded your contact
              information to Instagram. <a href="*">Learn More</a>
            </p>
            <p className={styles.par}>
              By signing up, you agree to our <a href="*">Terms</a>,{" "}
              <a href="*">Privacy</a>
              <a href="*">Policy</a> and <a href="*">Cookie Policy</a>
            </p>
          </div>

          <button className={styles.button} type="submit">
            Sign up
          </button>
        </form>
      </div>

      <div className={styles.containerTwo}>
        <p className={styles.parTwo}>
          Have an account?{" "}
          <Link style={{ color: "rgba(0, 149, 246, 1)" }} to="/login">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterForm;
