import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const UserDashboard = () => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

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

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-center text-red-500 p-8">{error}</div>;
  if (!userData.length) return <div className="text-center text-gray-500 p-8">No activity found.</div>;

  // Charts data
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

  const totalWorkouts = userData.length;
  const totalCardio = userData.reduce((sum, w) => sum + w.cardioMinutes, 0);
  const totalVolume = userData.reduce((sum, w) => sum + (w.sets * w.reps * w.weight), 0);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 space-y-6">
      {/* Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Profile</h2>
          <div className="flex items-center space-x-4 mb-4">
            <img src={userData[0].trainerAvatar} alt="Trainer" className="w-16 h-16 rounded-full" />
            <div>
              <h3 className="font-bold">{userData[0].trainerFullName}</h3>
              <p className="text-gray-500">{userData[0].trainerEmail}</p>
              <p className="text-gray-500">{userData[0].trainerPhone}</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div>Body Fat: {userData[0].bodyFat}</div>
            <div>Muscle Mass: {userData[0].muscleMass}</div>
            <div>Strength Progress: {userData[0].strengthProgress}</div>
            <div>Endurance Progress: {userData[0].enduranceProgress}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Workout Stats</h2>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-3xl font-bold">{totalWorkouts}</div>
              <div className="text-gray-500">Workouts</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-3xl font-bold">{totalCardio} min</div>
              <div className="text-gray-500">Cardio</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-3xl font-bold">{totalVolume}</div>
              <div className="text-gray-500">Total Volume</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Focus Areas</h2>
          {userData.slice(0, 5).map((w, i) => (
            <div key={i} className="text-sm mb-2">
              <span className="font-medium">{w.exercise}</span> - {w.focus}
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Workout Frequency</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workoutFrequencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="strength" fill="#4F46E5" name="Strength" />
                <Bar dataKey="cardio" fill="#10B981" name="Cardio" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Muscle Group Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={muscleGroupData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {muscleGroupData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Workouts */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Recent Workouts</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th>Date</th>
                <th>Muscle</th>
                <th>Exercise</th>
                <th>Sets x Reps</th>
                <th>Weight</th>
                <th>Cardio</th>
              </tr>
            </thead>
            <tbody>
              {userData.map((w, i) => (
                <tr key={i}>
                  <td>{new Date(w.date).toLocaleDateString()}</td>
                  <td>{w.muscleGroup}</td>
                  <td>{w.exercise}</td>
                  <td>{w.sets} x {w.reps}</td>
                  <td>{w.weight}</td>
                  <td>{w.cardioMinutes}</td>
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
