import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const UserDashboard = () => {
  const userData = {
    "userId": 10,
    "name": "Rekha Lama",
    "membership": "Premium",
    "joinDate": "2025-01-15",
    "height": "165 cm",
    "weight": "62 kg",
    "goal": "Build Strength & Tone",
    "dailyData": [
      { "date": "2025-08-16", "muscleGroup": "Chest", "exercise": "Bench Press", "sets": 3, "reps": 10, "weight": 45, "cardioMinutes": 0, "notes": "" },
      { "date": "2025-08-16", "muscleGroup": "Cardio", "exercise": "Stair Climber", "sets": 0, "reps": 0, "weight": 0, "cardioMinutes": 15, "notes": "" },
      { "date": "2025-08-15", "muscleGroup": "Legs", "exercise": "Squats", "sets": 4, "reps": 12, "weight": 60, "cardioMinutes": 0, "notes": "Felt strong today" },
      { "date": "2025-08-15", "muscleGroup": "Cardio", "exercise": "Treadmill", "sets": 0, "reps": 0, "weight": 0, "cardioMinutes": 20, "notes": "" },
      { "date": "2025-08-14", "muscleGroup": "Back", "exercise": "Lat Pulldown", "sets": 3, "reps": 10, "weight": 40, "cardioMinutes": 0, "notes": "" },
      { "date": "2025-08-13", "muscleGroup": "Shoulders", "exercise": "Overhead Press", "sets": 3, "reps": 8, "weight": 25, "cardioMinutes": 0, "notes": "" },
      { "date": "2025-08-12", "muscleGroup": "Arms", "exercise": "Bicep Curls", "sets": 3, "reps": 12, "weight": 15, "cardioMinutes": 0, "notes": "" }
    ],
    "progress": {
      "strength": "+18%",
      "endurance": "+25%",
      "bodyFat": "22%",
      "muscleMass": "+5%"
    },
    "upcomingSession": {
      "date": "2025-08-18",
      "time": "09:30 AM",
      "trainer": "Alex Johnson",
      "focus": "Full Body Workout"
    }
  };

  // Process data for charts
  const workoutFrequency = userData.dailyData.reduce((acc, workout) => {
    const date = workout.date;
    if (!acc[date]) {
      acc[date] = { date, strength: 0, cardio: 0 };
    }
    if (workout.muscleGroup === 'Cardio') {
      acc[date].cardio += workout.cardioMinutes;
    } else {
      acc[date].strength += workout.sets * workout.reps * workout.weight;
    }
    return acc;
  }, {});

  const workoutFrequencyData = Object.values(workoutFrequency).reverse();

  const muscleGroupData = userData.dailyData
    .filter(workout => workout.muscleGroup !== 'Cardio')
    .reduce((acc, workout) => {
      const existing = acc.find(item => item.name === workout.muscleGroup);
      if (existing) {
        existing.value += workout.sets * workout.reps * workout.weight;
      } else {
        acc.push({
          name: workout.muscleGroup,
          value: workout.sets * workout.reps * workout.weight
        });
      }
      return acc;
    }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Calculate totals
  const totalWorkouts = userData.dailyData.length;
  const totalCardio = userData.dailyData.reduce((sum, workout) => sum + workout.cardioMinutes, 0);
  const totalVolume = userData.dailyData
    .filter(workout => workout.muscleGroup !== 'Cardio')
    .reduce((sum, workout) => sum + (workout.sets * workout.reps * workout.weight), 0);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-900 to-purple-800 rounded-xl p-6 mb-6 shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">FITNESS TRACKER</h1>
            <p className="text-indigo-200">Welcome back, {userData.name}!</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className="bg-white bg-opacity-20 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="bg-white bg-opacity-20 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-4 text-white">
            <h2 className="text-xl font-bold">MY PROFILE</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="bg-blue-100 rounded-full p-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold">{userData.name}</h3>
                <p className="text-gray-600">{userData.membership} Member</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Height</span>
                <span className="font-medium">{userData.height}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Weight</span>
                <span className="font-medium">{userData.weight}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Goal</span>
                <span className="font-medium text-blue-600">{userData.goal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Member Since</span>
                <span className="font-medium">{new Date(userData.joinDate).toLocaleDateString()}</span>
              </div>
            </div>
            
            <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition duration-200">
              Update Profile
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-purple-500 to-purple-700 p-4 text-white">
            <h2 className="text-xl font-bold">WORKOUT STATS</h2>
          </div>
          <div className="p-6 grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-purple-600">{totalWorkouts}</div>
              <div className="text-gray-600">Total Workouts</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-purple-600">{totalCardio} min</div>
              <div className="text-gray-600">Cardio Time</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-purple-600">{totalVolume}</div>
              <div className="text-gray-600">Total Volume</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-purple-600">{userData.dailyData.filter(w => w.muscleGroup !== 'Cardio').length}</div>
              <div className="text-gray-600">Strength Workouts</div>
            </div>
          </div>
          
          <div className="px-6 pb-6">
            <h3 className="font-bold mb-2">PROGRESS</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Strength</span>
                  <span className="font-medium">{userData.progress.strength}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '18%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Endurance</span>
                  <span className="font-medium">{userData.progress.endurance}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-600">Muscle Mass</span>
                  <span className="font-medium">{userData.progress.muscleMass}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '5%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Session */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-red-700 p-4 text-white">
            <h2 className="text-xl font-bold">UPCOMING SESSION</h2>
          </div>
          <div className="p-6">
            <div className="bg-red-50 rounded-lg p-4 mb-4">
              <div className="text-2xl font-bold text-red-600">
                {new Date(userData.upcomingSession.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </div>
              <div className="text-gray-600">{userData.upcomingSession.time}</div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <div className="text-gray-600">Focus Area</div>
                  <div className="font-medium">{userData.upcomingSession.focus}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="bg-red-100 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-gray-600">Trainer</div>
                  <div className="font-medium">{userData.upcomingSession.trainer}</div>
                </div>
              </div>
            </div>
            
            <button className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition duration-200 flex items-center justify-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Reschedule</span>
            </button>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workout Frequency Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">WORKOUT FREQUENCY</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={workoutFrequencyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="strength" fill="#4F46E5" name="Strength Volume" />
                <Bar dataKey="cardio" fill="#10B981" name="Cardio (mins)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Muscle Group Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4">MUSCLE GROUP DISTRIBUTION</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={muscleGroupData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {muscleGroupData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Workouts */}
      <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 p-4 text-white">
          <h2 className="text-xl font-bold">RECENT WORKOUTS</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Muscle Group</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exercise</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sets x Reps</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cardio</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {userData.dailyData.map((workout, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {new Date(workout.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      workout.muscleGroup === 'Cardio' ? 'bg-green-100 text-green-800' : 
                      workout.muscleGroup === 'Chest' ? 'bg-blue-100 text-blue-800' :
                      workout.muscleGroup === 'Legs' ? 'bg-purple-100 text-purple-800' :
                      workout.muscleGroup === 'Back' ? 'bg-red-100 text-red-800' :
                      workout.muscleGroup === 'Shoulders' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-indigo-100 text-indigo-800'
                    }`}>
                      {workout.muscleGroup}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{workout.exercise}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {workout.sets > 0 ? `${workout.sets} x ${workout.reps}` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {workout.weight > 0 ? `${workout.weight} kg` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {workout.cardioMinutes > 0 ? `${workout.cardioMinutes} mins` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default UserDashboard;