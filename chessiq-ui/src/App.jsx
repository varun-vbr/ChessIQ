import { Routes, Route } from "react-router-dom";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/MainPage";
import SignUpPage from "./pages/SignUpPage";
import ProtectedRoute from "./pages/ProtectedRoute";
import PasswordResetPage from "./pages/PasswordResetPage";
import AnalysisPage from "./pages/AnalysisPage";
import GameArchive from "./pages/GameArchive";
import TrainingPlans from "./pages/TrainingPlans";
import ChessDashboard from "./pages/ChessDashboard";

function App() {
  //const [count, setCount] = useState(0);

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/mainpage"
        element={
          <ProtectedRoute>
            <MainPage />
          </ProtectedRoute>
        }
      >
        <Route path="upload" element={<AnalysisPage />} />
        <Route path="games" element={<GameArchive />} />
        <Route path="dashboard" element={<ChessDashboard />} />
        <Route path="training" element={<TrainingPlans />} />
      </Route>
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/password-reset" element={<PasswordResetPage />} />
    </Routes>
  );
}

export default App;
