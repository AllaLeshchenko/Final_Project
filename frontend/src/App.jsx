import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LogIn from "./pages/LogIn/LogIn";
import Register from "./pages/Register/Register";
import MainPage from "./pages/MainPage/MainPage";
import Profile from "./pages/Profile/Profile";
import Explore from "./pages/Explore/Explore";
import EditProfile from "./pages/EditProfile/EditProfile";
import NotFound from "./pages/NotFound/NotFound";

function App() {
  return (
  <div className="App">
    <Routes>
      {/* Главная защищённая страница */}
      <Route path="/" element={<ProtectedRoute><MainPage /></ProtectedRoute>}/>

      <Route path="/login" element={<LogIn />} />

      <Route path="/register" element={<Register />} />

      <Route path="/profile/:userId" element={<Profile />} />

      <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>}/>

      <Route path="/explore" element={<Explore />} />

      <Route path="*" element={<NotFound />} />
      
    </Routes>
  </div>
  );
}

export default App;







