import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider } from "./AuthContext";
import ProtectedRoute from "./ProtectedRoute";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
  path="/"
  element={
    <ProtectedRoute>
      <App />
    </ProtectedRoute>
  }
/>
          <Route path="/login" element={<Login />} />
          <Route path="/register"element={<Register/>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);