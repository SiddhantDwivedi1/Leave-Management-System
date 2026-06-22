import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import LeaveForm from "./pages/LeaveForm";
import LeaveHistory from "./pages/LeaveHistory";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";


const App = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));

  return (
    <BrowserRouter>
      <Routes>

        {/* Public route */}
        <Route path="/" element={<LoginPage />} />

        {/* Employee routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="employee">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/apply"
          element={
            <ProtectedRoute requiredRole="employee">
              <LeaveForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute requiredRole="employee">
              <LeaveHistory />
            </ProtectedRoute>
          }
        />

        {/* Admin route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            user
              ? user.role === "admin"
                ? <Navigate to="/admin" />
                : <Navigate to="/dashboard" />
              : <Navigate to="/" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;