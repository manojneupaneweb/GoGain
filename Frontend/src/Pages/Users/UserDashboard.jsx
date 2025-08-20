import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadialBarChart, RadialBar 
} from 'recharts';

const UserDashboard = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ff7300'];
  const CARDIO_COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#10B981', '#3B82F6'];

  useEffect(() => {
    const fetchUserActivity = async () => {
      try {
        const response = await axios.get('/api/v1/admin/getuseractivity', {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
          withCredentials: true,
        });
        setUserData(response.data.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserActivity();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your fitness data...</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300"
        >
          Try Again
        </button>
      </div>
    </div>
  );
  
  if (!userData.length) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
        <div className="text-gray-400 text-5xl mb-4">📊</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Activity Found</h2>
        <p className="text-gray-600">Get started with your first workout to see your progress here!</p>
      </div>
    </div>
  );

  // Process data for charts
  const workoutFrequency = userData.reduce((acc, item) => {
    const date = item.date;
    if (!acc[date]) acc[date] = { date, strength: 0, cardio: 0 };
    acc[date].strength += item.muscleGroup !== 'Cardio' ? item.sets * item.reps * item.weight : 0;
    acc[date].cardio += item.muscleGroup === 'Cardio' ? item.cardioMinutes : 0;
    return acc;
  }, {});
  const workoutFrequencyData = Object.values(workoutFrequency).reverse();

  const muscleGroupData = userData
    .filter(w => w.muscleGroup !== 'Cardio')
    .reduce((acc, w) => {
      const existing = acc.find(e => e.name === w.muscleGroup);
      if (existing) existing.value += w.sets * w.reps * w.weight;
      else acc.push({ name: w.muscleGroup, value: w.sets * w.reps * w.weight });
      return acc;
    }, []);

  // New data processing for additional charts
  const weeklyProgressData = userData.reduce((acc, item) => {
    const week = `Week ${Math.ceil(new Date(item.date).getDate() / 7)}`;
    if (!acc[week]) acc[week] = { week, volume: 0, cardio: 0 };
    acc[week].volume += item.sets * item.reps * item.weight;
    acc[week].cardio += item.cardioMinutes;
    return acc;
  }, {});
  const weeklyProgressChartData = Object.values(weeklyProgressData);

  const exerciseTypeData = userData.reduce((acc, item) => {
    const type = item.muscleGroup === 'Cardio' ? 'Cardio' : 'Strength';
    if (!acc[type]) acc[type] = { name: type, value: 0 };
    acc[type].value += 1;
    return acc;
  }, {});
  const exerciseTypeChartData = Object.values(exerciseTypeData);

  // const intensityData = userData
  //   .filter(w => w.muscleGroup !== 'Cardio')
  //   .map(w => ({
  //     name: w.exercise,
  //     intensity: (w.sets * w.reps * w.weight) / 1000,
  //     date: w.date
  //   }));

  // Calculate stats
  const totalWorkouts = userData.length;
  const totalCardio = userData.reduce((sum, w) => sum + w.cardioMinutes, 0);
  const totalVolume = userData.reduce((sum, w) => sum + (w.sets * w.reps * w.weight), 0);
  const avgIntensity = totalVolume / totalWorkouts || 0;
  const uniqueExercises = [...new Set(userData.map(item => item.exercise))].length;

  // Get recent workouts for the table
  const recentWorkouts = [...userData].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Fitness Dashboard</h1>
          <p className="text-gray-600">Track your progress and performance</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="rounded-lg bg-indigo-100 p-3 mr-4">
              <span className="text-indigo-600 text-xl">💪</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Workouts</p>
              <h3 className="text-2xl font-bold text-gray-800">{totalWorkouts}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="rounded-lg bg-green-100 p-3 mr-4">
              <span className="text-green-600 text-xl">🏃</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Cardio Minutes</p>
              <h3 className="text-2xl font-bold text-gray-800">{totalCardio}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="rounded-lg bg-amber-100 p-3 mr-4">
              <span className="text-amber-600 text-xl">🔥</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Total Volume</p>
              <h3 className="text-2xl font-bold text-gray-800">{totalVolume.toLocaleString()}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="rounded-lg bg-purple-100 p-3 mr-4">
              <span className="text-purple-600 text-xl">⭐</span>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Avg Intensity</p>
              <h3 className="text-2xl font-bold text-gray-800">{avgIntensity.toFixed(0)}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workout Frequency Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Workout Frequency</h2>
            <div className="text-sm text-gray-500">Strength vs Cardio</div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workoutFrequencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Legend />
                <Bar dataKey="strength" fill="#4F46E5" name="Strength Training" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cardio" fill="#10B981" name="Cardio" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Muscle Group Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">Muscle Group Distribution</h2>
            <div className="text-sm text-gray-500">Training Volume</div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={muscleGroupData} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={80} 
                  innerRadius={60}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={false}
                >
                  {muscleGroupData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value} lbs`, "Volume"]}
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Additional Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Workout Type Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Workout Type</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={exerciseTypeChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {exerciseTypeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CARDIO_COLORS[index % CARDIO_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Weekly Progress</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyProgressChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px', 
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Area type="monotone" dataKey="volume" stackId="1" stroke="#6366F1" fill="#818cf8" fillOpacity={0.5} />
                <Area type="monotone" dataKey="cardio" stackId="2" stroke="#10B981" fill="#34d399" fillOpacity={0.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Profile and Performance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Trainer Profile</h2>
          <div className="flex items-center space-x-4 mb-6">
            <img src={userData[0].trainerAvatar} alt="Trainer" className="w-16 h-16 rounded-full object-cover border-2 border-indigo-100" />
            <div>
              <h3 className="font-bold text-gray-800">{userData[0].trainerFullName}</h3>
              <p className="text-gray-500 text-sm">{userData[0].trainerEmail}</p>
              <p className="text-gray-500 text-sm">{userData[0].trainerPhone}</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Body Fat</span>
              <span className="font-medium text-gray-800">{userData[0].bodyFat}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Muscle Mass</span>
              <span className="font-medium text-gray-800">{userData[0].muscleMass}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Strength Progress</span>
              <span className="font-medium text-gray-800">{userData[0].strengthProgress}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Endurance Progress</span>
              <span className="font-medium text-gray-800">{userData[0].enduranceProgress}%</span>
            </div>
          </div>
        </div>

        {/* Focus Areas */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Focus Areas</h2>
          <div className="space-y-4">
            {userData.slice(0, 5).map((w, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg">
                <div className="font-medium text-gray-800">{w.exercise}</div>
                <div className="text-sm text-gray-600 mt-1">{w.focus}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Achievements</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="bg-amber-100 p-2 rounded-full">
                <span className="text-amber-600 text-sm">🏆</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Completed {totalWorkouts} workouts</h4>
                <p className="text-sm text-gray-600">Keep up the consistency!</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <span className="text-green-600 text-sm">🔥</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">{uniqueExercises} different exercises</h4>
                <p className="text-sm text-gray-600">Great exercise variety!</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-indigo-100 p-2 rounded-full">
                <span className="text-indigo-600 text-sm">💪</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Personal best volume</h4>
                <p className="text-sm text-gray-600">{totalVolume.toLocaleString()} lbs lifted</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Workouts Table */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Recent Workouts</h2>
  
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Muscle Group</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exercise</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sets x Reps</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cardio (min)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentWorkouts.map((w, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(w.date).toLocaleDateString()}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{w.muscleGroup}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-800">{w.exercise}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{w.sets} x {w.reps}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{w.weight}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{w.cardioMinutes || '-'}</td>
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