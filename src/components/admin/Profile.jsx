import React, { useState, useEffect, Fragment } from 'react';
import { motion } from 'framer-motion';
import { Avatar } from '@mui/material';
import { Edit2, User, Mail, Phone, Shield, ChevronRight, Briefcase, Lock } from 'lucide-react';
import Toast from "../Toast";

const Profile = () => {
  const [adminData, setAdminData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [toast, setToast] = useState({ message: "", type: "" });

  // Load employee data from the API.
  useEffect(() => {
    const fetchMe = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        if (!response.ok) throw new Error('Error fetching employee data');
        const data = await response.json();
        console.log('My information: ', data);
        setAdminData(data.user);
      } catch (err) {
        console.error("Error fetching employee ", err.message);
      }
    };

    fetchMe();
  }, []);

  // Initialize profileData based on adminData; update when adminData changes.
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: 'N/A', // default value since only department_id is provided
    role: 'admin',
  });

  useEffect(() => {
    if (Object.keys(adminData).length !== 0) {
      setProfileData({
        firstName: adminData.first_name || '',
        lastName: adminData.last_name || '',
        email: adminData.email || '',
        phone: adminData.phone || '',
        department: adminData.department_name || 'N/A',
        role: adminData.role || 'admin',
      });
    }
  }, [adminData]);

  const securitySettings = [
    {
      icon: <Lock size={20} className="text-blue-600 mt-0.5" />,
      title: "Change Password",
      description: "Update your account password",
      action: () => console.log("Change password clicked")
    },
    {
      icon: <Lock size={20} className="text-blue-600 mt-0.5" />,
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security",
      isSwitch: true,
      checked: true,
      onChange: (checked) => console.log("2FA changed:", checked)
    },
    {
      icon: <Lock size={20} className="text-blue-600 mt-0.5" />,
      title: "Login History",
      description: "View your account login activity",
      action: () => console.log("Login history clicked")
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setIsEditing(false);
    try {
      const response = await fetch(`http://localhost:8000/api/employees/${adminData.employee_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          email: profileData.email,
          phone: profileData.phone
        })
      });

      if (response.ok) {
        setToast({ message: "Profile updated successfully", type: 'success' });
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      setToast({ message: error.message, type: 'error' });
    }
  };

  const tabs = ['profile', 'security'];
  const tabLabels = {
    profile: 'Profile',
    security: 'Security'
  };

  return (
    <>
      {toast.message && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="bg-gray-50 min-h-screen py-8 w-full inter">
        <div className="max-w-6xl mx-auto p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white border border-gray-200 shadow-md rounded-2xl p-6 md:p-8 mb-8"
          >
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <Avatar
                sx={{ bgcolor: "gray", height: 60, width: 60 }}
                alt="Admin Avatar"
                src="/broken-image.jpg"
              >
                {profileData.firstName?.charAt(0)}{profileData.lastName?.charAt(0)}
              </Avatar>

              <div className="flex-1 text-center lg:text-left">
                <h1 className="text-2xl font-bold text-gray-900">
                  {profileData.firstName} {profileData.lastName}
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  {profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)} · {profileData.department}
                </p>
              </div>

              <div className="flex gap-3 mt-4 lg:mt-0">
                {isEditing ? (
                  <>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      onClick={handleSaveProfile}
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit2 size={16} className="mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          <div className="mb-8">
            <div className="flex space-x-1 rounded-lg bg-white p-1 border border-gray-200 shadow-sm overflow-x-auto">
              {tabs.map((tabValue) => (
                <button
                  key={tabValue}
                  onClick={() => setActiveTab(tabValue)}
                  className={`w-full px-3 py-2 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 whitespace-nowrap ${activeTab === tabValue
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                    }`}
                >
                  {tabLabels[tabValue]}
                </button>
              ))}
            </div>
          </div>

          <div>
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white border border-gray-200 shadow-md rounded-2xl p-6 md:p-8"
              >
                <h2 className="text-xl font-semibold mb-6 text-gray-900">Admin Profile</h2>
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={profileData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={profileData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4 py-3">
                      <Briefcase className="text-blue-600 mt-0.5" size={20} />
                      <div>
                        <div className="text-sm text-gray-500">Role</div>
                        <div className="font-medium text-gray-800">
                          {profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 py-3">
                      <User className="text-blue-600 mt-0.5" size={20} />
                      <div>
                        <div className="text-sm text-gray-500">Full Name</div>
                        <div className="font-medium text-gray-800">
                          {profileData.firstName} {profileData.lastName}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 py-3">
                      <Mail className="text-blue-600 mt-0.5" size={20} />
                      <div>
                        <div className="text-sm text-gray-500">Email</div>
                        <div className="font-medium text-gray-800">{profileData.email}</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 py-3">
                      <Phone className="text-blue-600 mt-0.5" size={20} />
                      <div>
                        <div className="text-sm text-gray-500">Phone</div>
                        <div className="font-medium text-gray-800">{profileData.phone}</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4 py-3">
                      <Briefcase className="text-blue-600 mt-0.5" size={20} />
                      <div>
                        <div className="text-sm text-gray-500">Department</div>
                        <div className="font-medium text-gray-800">{profileData.department}</div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white border border-gray-200 shadow-md rounded-2xl p-6 md:p-8"
              >
                <h2 className="text-xl font-semibold mb-6 text-gray-900">Security Settings</h2>
                <div className="space-y-4">
                  {securitySettings.map((setting, index) => (
                    <Fragment key={index}>
                      <div className="flex justify-between items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-start space-x-3">
                          {setting.icon}
                          <div>
                            <h4 className="font-medium text-gray-900">{setting.title}</h4>
                            <p className="text-sm text-gray-500 mt-1">{setting.description}</p>
                          </div>
                        </div>
                        {setting.isSwitch ? (
                          <button
                            onClick={() => setting.onChange(!setting.checked)}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${setting.checked ? 'bg-blue-600' : 'bg-gray-200'}`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${setting.checked ? 'translate-x-5' : 'translate-x-0'}`}
                            />
                          </button>
                        ) : (
                          <ChevronRight className="text-gray-400" size={20} />
                        )}
                      </div>
                      {index < securitySettings.length - 1 && <hr className="border-gray-200" />}
                    </Fragment>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
