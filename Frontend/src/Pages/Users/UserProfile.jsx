import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserProfile() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    joinDate: '',
    membershipType: '',
    profileImage: '',
    goals: '',
    height: '',
    weight: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.get('/api/v1/user/getuser', {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        });

        if (response.data.success) {
          setUserData(response.data.user);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // Add your save/update API call here
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="bg-indigo-600 py-6 px-6 sm:px-8 text-white">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img 
                    src={userData.avatar || 'https://via.placeholder.com/150'} 
                    alt="Profile" 
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white object-cover"
                  />
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                  )}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">{userData.fullName}</h1>
                  <h1 className="text-2xl font-bold">{userData.gender}</h1>
                  <h1 className="text-2xl font-bold">{userData.date_of_birth}</h1>
                  <p className="text-indigo-100">{userData.membershipType || 'Premium Member'}</p>
                </div>
              </div> 
              <p>{userData.last_login}</p>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="mt-4 sm:mt-0 px-4 py-2 bg-white text-indigo-600 rounded-md font-medium hover:bg-indigo-50 transition duration-300"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 sm:p-8">
            {/* Personal Info */}
            <div className="md:col-span-2 space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Personal Information</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={userData.fullName}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{userData.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{userData.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={userData.phone}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{userData.phone || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Member Since</label>
                  <p className="mt-1 text-gray-900">{new Date(userData.joinDate).toLocaleDateString() || 'N/A'}</p>
                </div>
              </div>

              
            </div>

            {/* Stats */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">Fitness Stats</h2>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Height</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="height"
                      value={userData.height}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{userData.height || 'Not set'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Weight</label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="weight"
                      value={userData.weight}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{userData.weight || 'Not set'}</p>
                  )}
                </div>

                <div className="pt-4">
                  <h3 className="text-sm font-medium text-gray-700">Membership Status</h3>
                  <div className="mt-2 flex items-center">
                    <span className="flex-shrink-0 bg-green-500 h-4 w-4 rounded-full"></span>
                    <span className="ml-2 text-sm font-medium text-gray-900">Active</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Expires on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>

              {isEditing && (
                <button
                  onClick={handleSave}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-300"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="border-t border-gray-200 px-6 py-5 sm:px-8">
            <h2 className="text-xl font-semibold text-gray-800">Recent Activity</h2>
            <div className="mt-4 space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Completed Workout</p>
                  <p className="text-sm text-gray-500">Upper Body Strength • 45 mins • Yesterday</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-green-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Achieved New PR</p>
                  <p className="text-sm text-gray-500">Bench Press • 185 lbs • 2 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
