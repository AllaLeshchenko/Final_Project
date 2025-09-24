import { Routes, Route, Navigate } from "react-router-dom";
import RegisterForm from "./pages/RegisterForm";
import LoginForm from "./pages/LoginForm";

function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fafafa",
      }}
    >
      <Routes>
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />

        {/* перенаправление с / на /login */}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;

