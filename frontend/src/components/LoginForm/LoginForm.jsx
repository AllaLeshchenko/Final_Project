import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/slices/authSlice";
import styles from "./LoginForm.module.css";
import Phones from "../../assets/phone.png";
import Logo from "../../assets/ichgram2.png";

function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: "", password: "" });

  // изменения в инпутах
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // отправка формы
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  // если авторизация успешна → на главную
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: false }); 
      // replace: false → история сохраняется, стрелка "назад" работает
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.phones}>
        <img src={Phones} alt="Phones" />
      </div>

      <div className={styles.authForm}>
        <div className={styles.containerOne}>
          <img className={styles.logo} src={Logo} alt="LogoApp" />

          <form className={styles.form} onSubmit={handleSubmit}>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <div className={styles.inputField}>
              <input
                className={styles.input}
                type="text"
                name="email"
                placeholder="Username, or email"   
                value={formData.email}
                onChange={handleChange}
                required
              />
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

            <button className={styles.button} type="submit" disabled={loading}>
              Log in
            </button>

            <div className={styles.or}>
              <div className={styles.line}></div>
              <span style={{ padding: "0 10px" }}>OR</span>
              <div className={styles.line}></div>
            </div>

            <Link className={styles.link} to="/reset">
              Forgot password?
            </Link>
          </form>
        </div>

        <div className={styles.containerTwo}>
          <p className={styles.parTwo}>
            Don't have an account?{" "}
            <Link style={{ color: "rgba(0, 149, 246, 1)" }} to="/register">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;

