// src/App.jsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider, useAuth } from "./components/Auth";
import Dashboard from "./pages/Dashboard";
import Landing from "./pages/Landing";
import Container from "./components/customer/Container"
import Profile from "./components/customer/Profile";
import MyLoans from "./components/customer/MyLoans";
import Apply from "./components/customer/Apply";
import CustomerProducts from "./components/customer/CustomerProducts";

// ProtectedRoute ensures that the children are rendered only if the user is authenticated.
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated === null) return null;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  // Method to check if the screen is mobile
  const checkIfMobile = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}

          <Route
            path="/"
            element={
              <Landing
                isMobile={isMobile}
              />
            }
          />
          <Route
            path="/login"
            element={
              <Login
                isMobile={isMobile} />
            }
          />
          <Route
            path="/register"
            element={
              <Register
                sidebarOpen={sidebarOpen}
                toggleSidebar={toggleSidebar}
                isMobile={isMobile}
              />
            }
          />
          <Route
            element={
              <ProtectedRoute>
                <Dashboard
                  sidebarOpen={sidebarOpen}
                  toggleSidebar={toggleSidebar}
                  isMobile={isMobile}
                />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Container />} />
            <Route path="apply" element={<Apply />} />
            <Route path="my-loans" element={<MyLoans />} />
            <Route path="profile" element={<Profile />} />
            <Route path="products" element={<CustomerProducts />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
