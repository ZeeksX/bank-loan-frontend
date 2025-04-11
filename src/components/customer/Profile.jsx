import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Avatar } from '@mui/material';
import { useOutletContext } from 'react-router-dom';
import { Check, Edit2, User, Mail, Phone, Home, Briefcase, FileText, Shield, ChevronRight, DollarSign, CreditCard } from 'lucide-react';
import Toast from "../Toast";

const getButtonClasses = (variant = 'outline', size = 'md', className = '') => {
  let baseClasses = "inline-flex items-center justify-center rounded-md border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none";

  // Variant styles
  if (variant === 'primary') {
    baseClasses += " border-transparent bg-blue-600 text-white shadow-sm hover:bg-blue-700";
  } else { // Default to outline
    baseClasses += " border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50";
  }

  // Size styles
  if (size === 'sm') {
    baseClasses += " px-3 py-1.5 text-xs"; // Adjusted size
  } else { // Default size
    baseClasses += " px-4 py-2";
  }

  return `${baseClasses} ${className}`;
};

// --- Helper Function for Basic Input Styling ---
const getInputClasses = (className = '') => {
  return `w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm ${className}`;
}

// --- Helper Function for Basic Switch Styling ---
const StyledSwitch = ({ checked, onCheckedChange, ...props }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${checked ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      {...props}
    >
      <span className="sr-only">Use setting</span>
      <span
        aria-hidden="true"
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'
          }`}
      />
    </button>
  );
};

// --- Profile Component ---
const Profile = () => {

  const { productData, myLoans } = useOutletContext() ?? { productData: [], myLoans: [] };
  console.log("Profile: ", myLoans)
  const user = myLoans?.customer || []
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [profileData, setProfileData] = useState({
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    phone: user.phone,
    address: `${user.address}, ${user.city}, ${user.country}, ${user.country}, ${user.postal_code}` ?? '123 Main Street, Apt 4B, New York, NY 10001',
    occupation: user.employement_status ?? "N/A",
    employer: user.employer ?? "N/A",
    income: `₦${user.income}`,
    bankAccount: 'Please register your bank account',
    paymentReminders: true,
    applicationUpdates: true,
    promotionalOffers: false,
    accountAlerts: true,
    twoFactorAuth: true,
  });

  const [toast, showToast] = useState(null);

  const handleInputChange = (e) => { // Removed type annotation
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  // Handler for Switches (including notification and security switches)
  const handleSwitchChange = (name, checked) => {
    setProfileData(prev => ({ ...prev, [name]: checked }));
  }

  const handleSaveProfile = () => {
    setIsEditing(false);
    // Add logic here to actually save the data (e.g., API call)
    console.log("Saving Profile Data:", profileData);
    showToast({ // Still assuming useToast works
      message: "Profile updated. Your profile information has been saved successfully.",
      type: 'success', // or use appropriate variant if useToast supports it
    });
  };

  // Helper component for info items (no TS types)
  const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-start space-x-3 py-3">
      <div className="mt-0.5 text-blue-600"> {/* Assuming text-primary maps to blue-600 */}
        {icon}
      </div>
      <div className="flex-1">
        {/* Assuming text-muted-foreground maps to text-gray-500 */}
        <div className="text-sm text-gray-500">{label}</div>
        <div className="font-medium mt-1 text-gray-800">{value}</div>
      </div>
    </div>
  );

  const NotificationItem = ({ title, description, name }) => {
    const enabled = profileData[name];

    return (
      <div className="flex justify-between items-start py-4">
        <div>
          <h4 className="font-medium text-gray-900">{title}</h4>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <StyledSwitch
          checked={enabled}
          onCheckedChange={(checked) => handleSwitchChange(name, checked)}
        />
      </div>
    );
  };

  const DocumentItem = ({ title, description, status }) => {
    return (
      <div className="flex justify-between items-center py-4">
        <div>
          <h4 className="font-medium text-gray-900">{title}</h4>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
        <div className="flex items-center">
          {status === 'verified' && (
            <span className="text-sm text-green-500 font-medium flex items-center">
              <Check size={16} className="mr-1" /> Verified
            </span>
          )}
          {status === 'pending' && (
            <span className="text-sm text-amber-500 font-medium">Pending</span>
          )}
          {status === 'required' && (
            // Replaced CustomButton
            <button type="button" className={getButtonClasses('outline', 'sm')}>
              Upload
            </button>
          )}
        </div>
      </div>
    );
  };

  const tabs = ['personal', 'financial', 'documents', 'settings'];
  const tabLabels = {
    personal: 'Personal Info',
    financial: 'Financial Info',
    documents: 'Documents',
    settings: 'Settings'
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8 w-full inter">
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg border border-gray-200 shadow-md rounded-2xl p-6 md:p-8 mb-8"
        >
          {toast && <Toast message={toast.message} type={toast.type} onClose={() => showToast(null)} />}
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <Avatar
              sx={{ bgcolor: "gray", height: 60, width: 60 }}
              alt="Remy Sharp"
              src="/broken-image.jpg"
            >
              {profileData.firstName?.charAt(0)}{profileData.lastName?.charAt(0)}
            </Avatar>

            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-2xl font-bold text-gray-900">
                {profileData.firstName} {profileData.lastName}
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Member since {user.created_at}
              </p>
            </div>

            <div className="flex gap-3 mt-4 lg:mt-0">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    className={getButtonClasses('outline')}
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className={getButtonClasses('primary')}
                    onClick={handleSaveProfile}
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className={getButtonClasses('outline')}
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
          <div className="flex space-x-1 rounded-lg bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg p-1 border border-gray-200 shadow-sm overflow-x-auto">
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

        <div >
          {activeTab === 'personal' && (
            <motion.div
              key="personal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg border border-gray-200 shadow-md rounded-2xl p-6 md:p-8"
            >
              <h2 className="text-xl font-semibold mb-6 text-gray-900">Personal Information</h2>
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-1">
                    {/* Replaced Label and Input */}
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                    <input type="text" id="firstName" name="firstName" value={profileData.firstName} onChange={handleInputChange} className={getInputClasses()} />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input type="text" id="lastName" name="lastName" value={profileData.lastName} onChange={handleInputChange} className={getInputClasses()} />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input type="email" id="email" name="email" value={profileData.email} onChange={handleInputChange} className={getInputClasses()} />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input type="tel" id="phone" name="phone" value={profileData.phone} onChange={handleInputChange} className={getInputClasses()} />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                    <input type="text" id="address" name="address" value={profileData.address} onChange={handleInputChange} className={getInputClasses()} />
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  {/* Replaced Separator with <hr> */}
                  <InfoItem icon={<User size={18} />} label="Full Name" value={`${profileData.firstName} ${profileData.lastName}`} />
                  <hr className="border-gray-200 my-1" />
                  <InfoItem icon={<Mail size={18} />} label="Email Address" value={profileData.email} />
                  <hr className="border-gray-200 my-1" />
                  <InfoItem icon={<Phone size={18} />} label="Phone Number" value={profileData.phone} />
                  <hr className="border-gray-200 my-1" />
                  <InfoItem icon={<Home size={18} />} label="Home Address" value={profileData.address} />
                </div>
              )}
            </motion.div>
          )}

          {/* Financial Info Tab */}
          {activeTab === 'financial' && (
            <motion.div
              key="financial"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg border border-gray-200 shadow-md rounded-2xl p-6 md:p-8"
            >
              <h2 className="text-xl font-semibold mb-6 text-gray-900">Financial Information</h2>
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className="space-y-1">
                    <label htmlFor="occupation" className="block text-sm font-medium text-gray-700">Occupation</label>
                    <input type="text" id="occupation" name="occupation" value={profileData.occupation} onChange={handleInputChange} className={getInputClasses()} />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="employer" className="block text-sm font-medium text-gray-700">Employer</label>
                    <input type="text" id="employer" name="employer" value={profileData.employer} onChange={handleInputChange} className={getInputClasses()} />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="income" className="block text-sm font-medium text-gray-700">Annual Income</label>
                    <input type="text" id="income" name="income" value={profileData.income} onChange={handleInputChange} className={getInputClasses()} />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="bankAccount" className="block text-sm font-medium text-gray-700">Bank Account</label>
                    <input type="text" id="bankAccount" name="bankAccount" value={profileData.bankAccount} onChange={handleInputChange} className={getInputClasses()} />
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <InfoItem icon={<Briefcase size={18} />} label="Occupation" value={profileData.occupation} />
                  <hr className="border-gray-200 my-1" />
                  <InfoItem icon={<Briefcase size={18} />} label="Employer" value={profileData.employer} />
                  <hr className="border-gray-200 my-1" />
                  <InfoItem icon={<DollarSign size={18} />} label="Annual Income" value={profileData.income} />
                  <hr className="border-gray-200 my-1" />
                  <InfoItem icon={<CreditCard size={18} />} label="Bank Account" value={profileData.bankAccount} />
                </div>
              )}
            </motion.div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <motion.div
              key="documents"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg border border-gray-200 shadow-md rounded-2xl p-6 md:p-8"
            >
              <h2 className="text-xl font-semibold mb-6 text-gray-900">Required Documents</h2>
              <div className="space-y-1">
                <DocumentItem title="ID Verification" description="Government-issued photo ID" status="verified" />
                <hr className="border-gray-200 my-1" />
                <DocumentItem title="Proof of Income" description="Recent pay stubs or tax returns" status="verified" />
                <hr className="border-gray-200 my-1" />
                <DocumentItem title="Bank Statements" description="Last 3 months of statements" status="pending" />
                <hr className="border-gray-200 my-1" />
                <DocumentItem title="Employment Verification" description="Letter from employer or contract" status="required" />
              </div>
            </motion.div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white bg-opacity-70 backdrop-filter backdrop-blur-lg border border-gray-200 shadow-md rounded-2xl p-6 md:p-8"
            >
              <h2 className="text-xl font-semibold mb-6 text-gray-900">Notification Settings</h2>
              <div className="space-y-1">
                {/* Using 'name' prop to link to state */}
                <NotificationItem title="Payment Reminders" description="Receive notifications when a payment is due" name="paymentReminders" />
                <hr className="border-gray-200 my-1" />
                <NotificationItem title="Application Updates" description="Receive updates about your loan application status" name="applicationUpdates" />
                <hr className="border-gray-200 my-1" />
                <NotificationItem title="Promotional Offers" description="Receive information about new loan products and offers" name="promotionalOffers" />
                <hr className="border-gray-200 my-1" />
                <NotificationItem title="Account Alerts" description="Receive alerts about important account activities" name="accountAlerts" />
              </div>

              <h2 className="text-xl font-semibold mb-6 mt-10 text-gray-900">Security Settings</h2>
              <div className="space-y-2">
                {/* Example clickable security items */}
                <button className="flex justify-between items-center w-full p-4 rounded-lg hover:bg-gray-100 transition-colors text-left">
                  <div className="flex items-start space-x-3">
                    <Shield size={20} className="text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Change Password</h4>
                      <p className="text-sm text-gray-500 mt-1">Update your account password</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </button>
                {/* Separating the switch item visually */}
                <div className="flex justify-between items-center p-4 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Shield size={20} className="text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-500 mt-1">Add an extra layer of security</p>
                    </div>
                  </div>
                  <StyledSwitch
                    checked={profileData.twoFactorAuth}
                    onCheckedChange={(checked) => handleSwitchChange('twoFactorAuth', checked)}
                  />
                </div>
                <button className="flex justify-between items-center w-full p-4 rounded-lg hover:bg-gray-100 transition-colors text-left">
                  <div className="flex items-start space-x-3">
                    <Shield size={20} className="text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-gray-900">Login History</h4>
                      <p className="text-sm text-gray-500 mt-1">View your account login activity</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div >
    </div >
  );
};

export default Profile;