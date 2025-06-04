import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, RadialBarChart, RadialBar,
  AreaChart, Area, ScatterChart, Scatter, RadarChart, Radar, Treemap,
  ComposedChart, FunnelChart, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';

const UserDashboard = () => {
  const [userData, setUserData] = useState({
    name: 'Alex Johnson',
    membership: 'Premium',
    joinDate: '2023-01-15',
    nextPayment: '2023-07-15',
    trainer: 'Sarah Miller',
    trainerContact: 'sarah@gogain.com',
    todayFocus: 'Leg Day',
    workoutDuration: '75 mins',
    caloriesBurned: 620,
    currentStreak: 12
  });

  const [stats, setStats] = useState({
    workoutsThisWeek: 4,
    avgWorkoutDuration: 68,
    bodyFatChange: -2.3,
    muscleMassChange: 1.7
  });

  // Sample data for charts
  const workoutData = [
    { day: 'Mon', duration: 45, calories: 320, type: 'Cardio' },
    { day: 'Tue', duration: 60, calories: 420, type: 'Strength' },
    { day: 'Wed', duration: 30, calories: 280, type: 'Yoga' },
    { day: 'Thu', duration: 75, calories: 580, type: 'Strength' },
    { day: 'Fri', duration: 50, calories: 350, type: 'HIIT' },
    { day: 'Sat', duration: 90, calories: 720, type: 'Strength' },
    { day: 'Sun', duration: 0, calories: 0, type: 'Rest' }
  ];

  const progressData = [
    { month: 'Jan', weight: 78, bodyFat: 22 },
    { month: 'Feb', weight: 76, bodyFat: 21 },
    { month: 'Mar', weight: 75, bodyFat: 20.5 },
    { month: 'Apr', weight: 74, bodyFat: 19.8 },
    { month: 'May', weight: 73, bodyFat: 19.2 },
    { month: 'Jun', weight: 72, bodyFat: 18.5 }
  ];

  const muscleGroupData = [
    { name: 'Chest', value: 85 },
    { name: 'Back', value: 75 },
    { name: 'Legs', value: 90 },
    { name: 'Shoulders', value: 80 },
    { name: 'Arms', value: 70 },
    { name: 'Core', value: 65 }
  ];

  useEffect(() => {
    // Fetch actual user data
    const fetchData = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const response = await axios.get('/api/v1/user/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data.user);
        setStats(response.data.stats);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {userData.name}!</p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - User Info */}
        <div className="space-y-6">
          {/* User Profile Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-2xl font-bold text-indigo-600">
                  {userData.name.charAt(0)}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold">{userData.name}</h2>
                <p className="text-indigo-600">{userData.membership} Member</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Member Since</span>
                <span>{new Date(userData.joinDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Next Payment</span>
                <span>{new Date(userData.nextPayment).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Streak</span>
                <span>{userData.currentStreak} days</span>
              </div>
            </div>
          </div>

          {/* Today's Focus */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Today's Focus</h3>
            <div className="bg-indigo-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-indigo-700 text-xl">{userData.todayFocus}</h4>
                  <p className="text-gray-600">Recommended workout</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="bg-white p-2 rounded">
                  <p className="text-sm text-gray-500">Duration</p>
                  <p className="font-bold">{userData.workoutDuration}</p>
                </div>
                <div className="bg-white p-2 rounded">
                  <p className="text-sm text-gray-500">Calories</p>
                  <p className="font-bold">{userData.caloriesBurned}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trainer Info */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Your Trainer</h3>
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center">
                <span className="text-xl font-bold text-purple-600">
                  {userData.trainer.charAt(0)}
                </span>
              </div>
              <div>
                <h4 className="font-bold">{userData.trainer}</h4>
                <p className="text-gray-600">{userData.trainerContact}</p>
                <button className="mt-2 text-sm text-purple-600 hover:text-purple-800">
                  Message Trainer
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Workout Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-md p-4 text-center">
              <p className="text-gray-500">Workouts This Week</p>
              <p className="text-3xl font-bold text-indigo-600">{stats.workoutsThisWeek}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 text-center">
              <p className="text-gray-500">Avg Duration</p>
              <p className="text-3xl font-bold text-green-600">{stats.avgWorkoutDuration} min</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 text-center">
              <p className="text-gray-500">Body Fat %</p>
              <p className={`text-3xl font-bold ${stats.bodyFatChange < 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.bodyFatChange}%
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 text-center">
              <p className="text-gray-500">Muscle Mass</p>
              <p className={`text-3xl font-bold ${stats.muscleMassChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                +{stats.muscleMassChange}%
              </p>
            </div>
          </div>

          {/* Workout Duration Chart */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Weekly Workout Duration</h3>
            <div className="w-full h-[300px]"> {/* Adjust height if needed */}
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={workoutData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="duration"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorDuration)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Progress Charts */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Weight & Body Fat Chart */}
  <div className="bg-white rounded-xl shadow-md p-6">
    <h3 className="text-lg font-semibold mb-4">Weight & Body Fat</h3>
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={progressData}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="month" />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <Tooltip />
          <Legend />
          <Bar yAxisId="left" dataKey="weight" barSize={20} fill="#8884d8" />
          <Line yAxisId="right" type="monotone" dataKey="bodyFat" stroke="#82ca9d" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  </div>

  {/* Muscle Group Focus Chart */}
  <div className="bg-white rounded-xl shadow-md p-6">
    <h3 className="text-lg font-semibold mb-4">Muscle Group Focus</h3>
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={muscleGroupData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name" />
          <PolarRadiusAxis />
          <Radar
            name="Progress"
            dataKey="value"
            stroke="#8884d8"
            fill="#8884d8"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;