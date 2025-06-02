import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const UserDashboard = () => {
  // Sample data for charts
  const workoutData = [
    { name: 'Jan', strength: 65, cardio: 45 },
    { name: 'Feb', strength: 70, cardio: 50 },
    { name: 'Mar', strength: 80, cardio: 55 },
    { name: 'Apr', strength: 85, cardio: 60 },
    { name: 'May', strength: 90, cardio: 65 },
    { name: 'Jun', strength: 95, cardio: 70 },
  ];

  const progressData = [
    { name: 'Week 1', weight: 180, bodyFat: 22 },
    { name: 'Week 2', weight: 178, bodyFat: 21.5 },
    { name: 'Week 3', weight: 176, bodyFat: 21 },
    { name: 'Week 4', weight: 174, bodyFat: 20.5 },
    { name: 'Week 5', weight: 172, bodyFat: 20 },
    { name: 'Week 6', weight: 170, bodyFat: 19.5 },
  ];

  const recentWorkouts = [
    { exercise: 'Bench Press', sets: 4, reps: 10, weight: '185 lbs', date: '2023-06-10' },
    { exercise: 'Squats', sets: 4, reps: 8, weight: '225 lbs', date: '2023-06-09' },
    { exercise: 'Deadlifts', sets: 3, reps: 6, weight: '275 lbs', date: '2023-06-08' },
    { exercise: 'Pull-ups', sets: 3, reps: 12, weight: 'Bodyweight', date: '2023-06-07' },
  ];

  const upcomingClasses = [
    { name: 'HIIT Blast', time: '7:00 AM', trainer: 'Sarah J.', day: 'Tomorrow' },
    { name: 'Yoga Flow', time: '6:00 PM', trainer: 'Mike T.', day: 'Wednesday' },
    { name: 'Spin Class', time: '5:30 AM', trainer: 'Lisa K.', day: 'Friday' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome Back, Alex!</h1>
        <p className="text-gray-600">Track your fitness journey and progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Current Weight</h3>
          <p className="text-2xl font-bold text-indigo-600">170 lbs</p>
          <p className="text-green-500 text-sm">↓ 10 lbs last month</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Body Fat %</h3>
          <p className="text-2xl font-bold text-indigo-600">19.5%</p>
          <p className="text-green-500 text-sm">↓ 2.5% last month</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Workouts This Month</h3>
          <p className="text-2xl font-bold text-indigo-600">18</p>
          <p className="text-green-500 text-sm">↑ 3 from last month</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm font-medium">Gym Streak</h3>
          <p className="text-2xl font-bold text-indigo-600">12 days</p>
          <p className="text-green-500 text-sm">Keep it up!</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Workout Performance Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Workout Performance</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={workoutData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="strength" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="cardio" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Progress Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Body Composition Progress</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="weight" fill="#8884d8" name="Weight (lbs)" />
                  <Bar yAxisId="right" dataKey="bodyFat" fill="#82ca9d" name="Body Fat %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Recent Workouts */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Workouts</h2>
            <div className="space-y-4">
              {recentWorkouts.map((workout, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-800">{workout.exercise}</h3>
                      <p className="text-sm text-gray-500">{workout.sets} sets × {workout.reps} reps</p>
                    </div>
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {workout.weight}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{workout.date}</p>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800">
              View All Workouts →
            </button>
          </div>

          {/* Upcoming Classes */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Upcoming Classes</h2>
            <div className="space-y-4">
              {upcomingClasses.map((cls, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <h3 className="font-medium text-gray-800">{cls.name}</h3>
                  <div className="flex justify-between text-sm text-gray-600 mt-1">
                    <span>{cls.trainer}</span>
                    <span>{cls.time}</span>
                  </div>
                  <p className="text-xs text-indigo-600 font-medium mt-1">{cls.day}</p>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800">
              Browse All Classes →
            </button>
          </div>

          {/* Goals */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Goals</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Lose 5 more lbs</span>
                  <span className="text-sm font-medium text-gray-700">60%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Bench Press 200 lbs</span>
                  <span className="text-sm font-medium text-gray-700">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Attend 20 classes</span>
                  <span className="text-sm font-medium text-gray-700">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
            <button className="mt-4 w-full py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800">
              Set New Goals →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Trainer Notes */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Trainer's Notes</h2>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <p className="text-yellow-700">"Great progress on your squats this week! Let's work on increasing your range of motion next session."</p>
            <p className="text-sm text-yellow-600 mt-2">- Coach Sarah, June 8</p>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
            <p className="text-blue-700">"Your cardio endurance has improved significantly. Try adding one more HIIT session per week."</p>
            <p className="text-sm text-blue-600 mt-2">- Trainer Mike, June 1</p>
          </div>
        </div>

        {/* Nutrition Summary */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Nutrition Summary</h2>
          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>
              <p className="text-2xl font-bold text-indigo-600">1,850</p>
              <p className="text-sm text-gray-500">Calories</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">158g</p>
              <p className="text-sm text-gray-500">Protein</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">185g</p>
              <p className="text-sm text-gray-500">Carbs</p>
            </div>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">Today's Macros</h3>
            <div className="flex items-center mb-2">
              <span className="w-20 text-sm text-gray-600">Protein</span>
              <div className="flex-1 bg-gray-300 rounded-full h-2.5">
                <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '34%' }}></div>
              </div>
              <span className="w-10 text-right text-sm font-medium ml-2">34%</span>
            </div>
            <div className="flex items-center mb-2">
              <span className="w-20 text-sm text-gray-600">Carbs</span>
              <div className="flex-1 bg-gray-300 rounded-full h-2.5">
                <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '40%' }}></div>
              </div>
              <span className="w-10 text-right text-sm font-medium ml-2">40%</span>
            </div>
            <div className="flex items-center">
              <span className="w-20 text-sm text-gray-600">Fats</span>
              <div className="flex-1 bg-gray-300 rounded-full h-2.5">
                <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: '26%' }}></div>
              </div>
              <span className="w-10 text-right text-sm font-medium ml-2">26%</span>
            </div>
          </div>
          <button className="mt-4 w-full py-2 text-sm font-medium text-indigo-600 hover:text-indigo-800">
            View Meal Plan →
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;