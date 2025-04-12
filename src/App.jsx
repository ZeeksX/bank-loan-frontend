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
import AdminDashboard from "./pages/AdminDashboard";
import Landing from "./pages/Landing";
import Container from "./components/customer/Container"
import Profile from "./components/customer/Profile";
import MyLoans from "./components/customer/MyLoans";
import Apply from "./components/customer/Apply";
import CustomerProducts from "./components/customer/CustomerProducts";
import Payments from "./components/customer/Payments";
import Admin from "./components/admin/Admin";
import Loans from "./components/admin/Loans";
import LoanPayments from "./components/admin/LoanPayments";
import Users from "./components/admin/Users";
import AdminProfile from "./components/admin/Profile";
import LoanProducts from "./components/admin/LoanProducts";
import Reports from "./components/admin/Reports";
import Security from "./components/admin/Security";
import LoanInformation from "./components/customer/LoanInformation";

// ProtectedRoute ensures that the children are rendered only if the user is authenticated.
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated === null) return null;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// AdminRoute ensures that only admin users can access admin routes
const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  if (isAuthenticated === null) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin()) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

const App = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const role = JSON.parse(localStorage.getItem('user')).role
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

          {/* Customer Routes */}
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
            <Route path="payments" element={<Payments />} />
            <Route path="loans/:id" element={<LoanInformation />} />
          </Route>

          {/* Admin Routes */}
          <Route
            element={
              <AdminRoute>
                <AdminDashboard
                  sidebarOpen={sidebarOpen}
                  toggleSidebar={toggleSidebar}
                  isMobile={isMobile}
                />
              </AdminRoute>
            }
          >
            <Route path="admin/dashboard" element={<Admin />} />
            <Route path="admin/loans" element={<Loans />} />
            <Route path="admin/payments" element={<LoanPayments />} />
            <Route path="admin/users" element={<Users />} />
            <Route path="admin/profile" element={<AdminProfile />} />
            <Route path="admin/products" element={<LoanProducts />} />
            <Route path="admin/reports" element={<Reports />} />
            <Route path="admin/security" element={<Security />} />
          </Route>

          {/* Catch-all route redirects to login */}
          <Route
            path="*"
            element={<Navigate to={role === 'customer' ? '/dashboard' : '/admin/dashboard'} />}
          />

        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;