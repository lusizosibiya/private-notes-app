import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthLayout from "./components/authorisation/AuthLayout";
import { hasActiveUserSession } from "./utils/userProfile";

function ProtectedRoute({ children }) {
  return hasActiveUserSession()
    ? children
    : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/register"
          element={<AuthLayout form={<Register />} />}
        />

        <Route
          path="/login"
          element={<AuthLayout form={<Login />} />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            <Navigate
              to={hasActiveUserSession() ? "/dashboard" : "/login"}
              replace
            />
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;