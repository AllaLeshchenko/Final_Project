import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LogIn from "./pages/LogIn/LogIn";
import Register from "./pages/Register/Register";
import MainPage from "./pages/MainPage/MainPage";
import NotFound from "./pages/NotFound/NotFound";

function App() {
  return (
    <Routes>
      {/* Главная защищённая страница */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>
        }
      />

      {/* Страницы для авторизации */}
      <Route path="/login" element={<LogIn />} />
      <Route path="/register" element={<Register />} />

      {/* Путь не найден */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;








