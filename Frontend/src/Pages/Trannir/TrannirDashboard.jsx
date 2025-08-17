import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TrainerDashboard = () => {
  // State for user search and selection
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(true);

  // Workout form state
  const [workoutForm, setWorkoutForm] = useState({
    date: new Date().toISOString().split('T')[0],
    muscleGroup: '',
    exercise: '',
    sets: 3,
    reps: 10,
    weight: '',
    notes: ''
  });

  // Cardio form state
  const [cardioForm, setCardioForm] = useState({
    date: new Date().toISOString().split('T')[0],
    exercise: 'Treadmill running/walking',
    cardioMinutes: 30,
    caloriesBurned: '',
    notes: ''
  });

  // Activity history
  const [activityHistory, setActivityHistory] = useState([]);

  // Muscle groups and exercises
  const muscleGroups = {
    'Chest': ['Bench Press', 'Incline Press', 'Chest Fly', 'Push-ups'],
    'Back': ['Pull-ups', 'Lat Pulldown', 'Deadlift', 'Bent-over Rows'],
    'Legs': ['Squats', 'Lunges', 'Leg Press', 'Leg Curls'],
    'Shoulders': ['Overhead Press', 'Lateral Raises', 'Front Raises', 'Shrugs'],
    'Arms': ['Bicep Curls', 'Tricep Dips', 'Hammer Curls', 'Skull Crushers'],
    'Core': ['Plank', 'Sit-ups', 'Russian Twists', 'Leg Raises']
  };

  // Cardio exercises
  const cardioExercises = [
    'Treadmill running/walking',
    'Cycling',
    'Step mill',
    'Jump rope (skipping)',
    'Burpees',
    'Jump squats',
    'High knees',
    'Mountain climbers'
  ];

  // Weekly schedule
  const weeklySchedule = [
    { day: 'Sunday', focus: 'Chest & Triceps' },
    { day: 'Monday', focus: 'Back & Biceps' },
    { day: 'Tuesday', focus: 'Shoulders & Legs' },
    { day: 'Wednesday', focus: 'Core & Cardio' },
    { day: 'Thursday', focus: 'Full Body' },
    { day: 'Friday', focus: 'Active Recovery' },
    { day: 'Saturday', focus: 'Flexibility & Mobility' }
  ];

  // Search users
  const searchUsers = async () => {
    if (!searchTerm) return;
    setIsLoading(true);
    try {
      const response = await axios.get("api/v1/admin/getallusersfortrainer", {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        withCredentials: true
      });
      const filteredUsers = response.data.data.users.filter(user => 
        user.role === 'user' && 
        (user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
         user.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setUsers(filteredUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Select a user
  const selectUser = (user) => {
    setSelectedUser(user);
    setUsers([]);
    setSearchTerm('');
    setShowSearch(false);
    // Fetch user's activity history
    fetchActivityHistory(user.id);
  };

  // Clear selected user
  const clearSelectedUser = () => {
    setSelectedUser(null);
    setShowSearch(true);
    setActivityHistory([]);
  };

  // Fetch activity history
  const fetchActivityHistory = async (userId) => {
    try {
      const response = await axios.get('/activity-history', {
        params: { userId }
      });
      setActivityHistory(response.data);
    } catch (error) {
      console.error('Error fetching activity history:', error);
    }
  };

  // Handle workout form change
  const handleWorkoutChange = (e) => {
    const { name, value } = e.target;
    setWorkoutForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle cardio form change
  const handleCardioChange = (e) => {
    const { name, value } = e.target;
    setCardioForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit workout form
  const submitWorkout = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      await axios.post('/daily-activity', {
        type: 'workout',
        userId: selectedUser.id,
        ...workoutForm
      });
      alert('Workout logged successfully!');
      setWorkoutForm({
        date: new Date().toISOString().split('T')[0],
        muscleGroup: '',
        exercise: '',
        sets: 3,
        reps: 10,
        weight: '',
        notes: ''
      });
      fetchActivityHistory(selectedUser.id);
    } catch (error) {
      console.error('Error logging workout:', error);
      alert('Failed to log workout. Please try again.');
    }
  };

  // Submit cardio form
  const submitCardio = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      await axios.post('/daily-activity', {
        type: 'cardio',
        userId: selectedUser.id,
        ...cardioForm
      });
      alert('Cardio session logged successfully!');
      setCardioForm({
        date: new Date().toISOString().split('T')[0],
        exercise: 'Treadmill running/walking',
        cardioMinutes: 30,
        caloriesBurned: '',
        notes: ''
      });
      fetchActivityHistory(selectedUser.id);
    } catch (error) {
      console.error('Error logging cardio:', error);
      alert('Failed to log cardio session. Please try again.');
    }
  };

  // Auto-search when search term changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        searchUsers();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white p-6 shadow-lg">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">FitnessPro Trainer Dashboard</h1>
          <p className="text-blue-200">Manage your clients' fitness journey</p>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6">
        {/* User Search Section - Only shown when no user is selected */}
        {showSearch && (
          <div className="flex justify-center items-center min-h-96">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 mx-4">
              <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Search Clients</h2>
              <div className="flex flex-col space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by name or email..."
                    className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
                    autoFocus
                  />
                  {isLoading && (
                    <div className="absolute right-4 top-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                  {users.length > 0 && (
                    <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto">
                      {users.map(user => (
                        <div
                          key={user.id}
                          className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition duration-150"
                          onClick={() => selectUser(user)}
                        >
                          <div className="font-medium text-gray-800">{user.fullName}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={searchUsers}
                  disabled={!searchTerm}
                  className={`bg-blue-600 text-white font-medium py-3 px-6 rounded-xl shadow-md transition duration-200 transform hover:scale-[1.02] ${
                    !searchTerm ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                  }`}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Selected User Profile */}
        {selectedUser && (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                  {selectedUser.avatar ? (
                    <img src={selectedUser.avatar} alt={selectedUser.fullName} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-blue-600">
                      {selectedUser.fullName.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{selectedUser.fullName}</h2>
                      <p className="text-gray-600">{selectedUser.email}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Member since: {new Date(selectedUser.joinDate).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={clearSelectedUser}
                      className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                      Back to search
                    </button>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600">Last Activity</p>
                  <p className="font-semibold text-blue-700">
                    {activityHistory.length > 0
                      ? new Date(activityHistory[0].date).toLocaleDateString()
                      : 'No activities yet'}
                  </p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Forms */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Log Strength Training</h3>
                  <form onSubmit={submitWorkout}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                          type="date"
                          name="date"
                          value={workoutForm.date}
                          onChange={handleWorkoutChange}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Muscle Group</label>
                        <select
                          name="muscleGroup"
                          value={workoutForm.muscleGroup}
                          onChange={handleWorkoutChange}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          required
                        >
                          <option value="">Select muscle group</option>
                          {Object.keys(muscleGroups).map(group => (
                            <option key={group} value={group}>{group}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {workoutForm.muscleGroup && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Exercise</label>
                        <select
                          name="exercise"
                          value={workoutForm.exercise}
                          onChange={handleWorkoutChange}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          required
                        >
                          <option value="">Select exercise</option>
                          {muscleGroups[workoutForm.muscleGroup].map(exercise => (
                            <option key={exercise} value={exercise}>{exercise}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Sets</label>
                        <input
                          type="number"
                          name="sets"
                          min="1"
                          value={workoutForm.sets}
                          onChange={handleWorkoutChange}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Reps</label>
                        <input
                          type="number"
                          name="reps"
                          min="1"
                          value={workoutForm.reps}
                          onChange={handleWorkoutChange}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Weight (lbs)</label>
                        <input
                          type="number"
                          name="weight"
                          min="0"
                          step="0.5"
                          value={workoutForm.weight}
                          onChange={handleWorkoutChange}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <textarea
                        name="notes"
                        value={workoutForm.notes}
                        onChange={handleWorkoutChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        rows="2"
                        placeholder="Any additional notes..."
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200"
                    >
                      Log Workout
                    </button>
                  </form>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Log Cardio Session</h3>
                  <form onSubmit={submitCardio}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                          type="date"
                          name="date"
                          value={cardioForm.date}
                          onChange={handleCardioChange}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Exercise</label>
                        <select
                          name="exercise"
                          value={cardioForm.exercise}
                          onChange={handleCardioChange}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          required
                        >
                          {cardioExercises.map(exercise => (
                            <option key={exercise} value={exercise}>{exercise}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                        <input
                          type="number"
                          name="cardioMinutes"
                          min="1"
                          value={cardioForm.cardioMinutes}
                          onChange={handleCardioChange}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Calories Burned</label>
                        <input
                          type="number"
                          name="caloriesBurned"
                          min="1"
                          value={cardioForm.caloriesBurned}
                          onChange={handleCardioChange}
                          className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                      <textarea
                        name="notes"
                        value={cardioForm.notes}
                        onChange={handleCardioChange}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        rows="3"
                        placeholder="Any additional notes..."
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition duration-200"
                    >
                      Log Cardio Session
                    </button>
                  </form>
                </div>
              </div>

              <div className="space-y-6">
                {/* Weekly Schedule */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Weekly Training Schedule</h3>
                  <div className="space-y-3">
                    {weeklySchedule.map((day, index) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <div className="w-16 font-medium text-gray-700">{day.day}</div>
                        <div className="flex-grow text-gray-600">{day.focus}</div>
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                          Assign
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Activity Summary */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Recent Activities</h3>
                  {activityHistory.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No activities logged yet</p>
                  ) : (
                    <div className="space-y-4">
                      {activityHistory.slice(0, 5).map((activity, index) => (
                        <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">
                                {activity.type === 'workout' ? activity.exercise : activity.exercise}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(activity.date).toLocaleDateString()}
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              activity.type === 'workout'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {activity.type}
                            </span>
                          </div>
                          <div className="mt-2 text-sm text-gray-600">
                            {activity.type === 'workout' ? (
                              <p>{activity.sets} sets × {activity.reps} reps @ {activity.weight}lbs</p>
                            ) : (
                              <p>{activity.cardioMinutes} minutes • {activity.caloriesBurned || '--'} calories</p>
                            )}
                            {activity.notes && (
                              <p className="text-gray-500 italic mt-1">"{activity.notes}"</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Progress Visualization */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Progress Overview</h3>
                  <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                    [Workout Volume Chart Placeholder]
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Total Workouts</p>
                      <p className="text-xl font-bold text-blue-700">
                        {activityHistory.filter(a => a.type === 'workout').length}
                      </p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Total Cardio</p>
                      <p className="text-xl font-bold text-green-700">
                        {activityHistory.filter(a => a.type === 'cardio').length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default TrainerDashboard;