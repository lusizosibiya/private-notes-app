import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthLayout from "./components/authorisation/AuthLayout";
import { apiRequest } from "./services/api";

function ProtectedRoute({ children }) {
  const [authenticated, setAuthenticated] = useState(null);

  useEffect(() => {
    async function checkSession() {
      try {
        await apiRequest("/api/auth/me");
        setAuthenticated(true);
      } catch {
        setAuthenticated(false);
      }
    }

    checkSession();
  }, []);

  if (authenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#D5D1D1] text-[#652423]">
        Checking your session...
      </div>
    );
  }

  return authenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<AuthLayout form={<Register />} />} />

        <Route path="/login" element={<AuthLayout form={<Login />} />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
