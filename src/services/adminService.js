// src/services/adminService.js
const API_BASE_URL = "https://bank-loan-backend-4cyr.onrender.com/api";

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem("access_token");

// Reusable fetch function with authentication
const fetchWithAuth = async (url, options = {}) => {
  const token = getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "API request failed");
  }

  return response.json();
};

// Application status management
export const updateApplicationStatus = async (applicationId, status) => {
  return fetchWithAuth(
    `${API_BASE_URL}/loans/applications/ref/${applicationId}`,
    {
      method: "PUT",
      body: JSON.stringify({ status }),
    }
  );
};

// User management
export const updateUserStatus = async (userId, status) => {
  return fetchWithAuth(`${API_BASE_URL}/customers/${userId}`, {
    method: "PUT",
    body: JSON.stringify({ id_verification_status: status }),
  });
};

export const deleteUser = async (userId) => {
  return fetchWithAuth(`${API_BASE_URL}/customers/${userId}`, {
    method: "DELETE",
  });
};

// Get admin dashboard data
export const fetchAdminDashboardData = async () => {
  const [customersData, loansData, applicationsData] = await Promise.all([
    fetchWithAuth(`${API_BASE_URL}/customers`),
    fetchWithAuth(`${API_BASE_URL}/loans`),
    fetchWithAuth(`${API_BASE_URL}/loans/applications`),
  ]);

  return {
    customers: customersData,
    loans: loansData,
    applications: applicationsData,
  };
};
