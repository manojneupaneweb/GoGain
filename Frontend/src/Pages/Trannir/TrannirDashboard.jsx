import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TrainerDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showProgressMetrics, setShowProgressMetrics] = useState(false);
  const [notesHistory, setNotesHistory] = useState([]);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    muscleGroup: "",
    exercise: "",
    sets: "",
    reps: "",
    weight: "",
    cardioMinutes: "",
    notes: "",
    strengthProgress: "",
    enduranceProgress: "",
    bodyFat: "",
    muscleMass: "",
    focus: "",
  });

  const muscleGroups = {
    Chest: ["Bench Press", "Incline Press", "Chest Fly", "Push-ups"],
    Back: ["Pull-ups", "Lat Pulldown", "Deadlift", "Rows"],
    Legs: ["Squats", "Lunges", "Leg Press", "Leg Curls"],
    Shoulders: ["Overhead Press", "Lateral Raises", "Shrugs"],
    Arms: ["Bicep Curls", "Tricep Dips", "Hammer Curls"],
    Core: ["Plank", "Sit-ups", "Russian Twists"],
    FullBody: ["CrossFit WOD", "Circuit Training", "Functional Training"],
    Other: ["Stretching", "Mobility Work", "Recovery"],
  };

  const focusOptions = [
    "Strength Building",
    "Muscle Hypertrophy",
    "Endurance",
    "Fat Loss",
    "Rehabilitation",
    "Sports Specific",
    "General Fitness",
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) searchUsers();
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const searchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("api/v1/admin/getallusersfortrainer", {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });
      const filtered = res.data.data.users.filter(
        (u) =>
          u.role === "user" &&
          (u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setUsers(filtered);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  const selectUser = (user) => {
    setSelectedUser(user);
    setUsers([]);
    setSearchTerm("");
    const trainerName = localStorage.getItem("trainerName") || "";
    setFormData((prev) => ({ ...prev, trainer: trainerName }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberInput = (e) => {
    const { name, value } = e.target;
    if (value === "" || isNaN(value)) return;

    let num = parseFloat(value);

    switch (name) {
      case "sets":
      case "reps":
        if (num > 50) {
          toast.warning("Sets/Reps cannot exceed 50");
          return;
        }
        break;
      case "weight":
        if (num > 999) {
          toast.warning("Weight limit is 999 kg");
          return;
        }
        break;
      case "cardioMinutes":
        if (num > 300) {
          toast.warning("Cardio limit is 300 minutes");
          return;
        }
        break;
      case "strengthProgress":
      case "enduranceProgress":
        if (num > 100) {
          toast.warning("Progress cannot exceed 100%");
          return;
        }
        break;
      case "bodyFat":
        if (num > 60) {
          toast.warning("Body fat limit is 60%");
          return;
        }
        break;
      case "muscleMass":
        if (num > 150) {
          toast.warning("Muscle mass limit is 150 kg");
          return;
        }
        break;
      default:
        break;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!selectedUser) {
      toast.warning("Please select a user first!");
      return;
    }

    try {
      const payload = {
        userId: selectedUser.id,
        ...formData,
        sets: formData.sets || null,
        reps: formData.reps || null,
        weight: formData.weight || null,
        cardioMinutes: formData.cardioMinutes || null,
        strengthProgress: formData.strengthProgress || null,
        enduranceProgress: formData.enduranceProgress || null,
        bodyFat: formData.bodyFat || null,
        muscleMass: formData.muscleMass || null,
      };

      await axios.post("api/v1/admin/daily-activity", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
      });

      toast.success("Activity logged successfully!");

      // Update notes history
      setNotesHistory((prev) => {
        const updated = [formData.notes, ...prev].filter(Boolean).slice(0, 5);
        return updated;
      });

      setFormData({
        ...formData,
        muscleGroup: "",
        exercise: "",
        sets: "",
        reps: "",
        weight: "",
        cardioMinutes: "",
        notes: "",
        strengthProgress: "",
        enduranceProgress: "",
        bodyFat: "",
        muscleMass: "",
      });
    } catch (err) {
      console.error("Error while sending:", err);
      toast.error(err.response?.data?.message || "Failed to log activity");
    }
  };

  const clearSelection = () => {
    setSelectedUser(null);
    setFormData({
      date: new Date().toISOString().split("T")[0],
      muscleGroup: "",
      exercise: "",
      sets: "",
      reps: "",
      weight: "",
      cardioMinutes: "",
      notes: "",
      strengthProgress: "",
      enduranceProgress: "",
      bodyFat: "",
      muscleMass: "",
      focus: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <ToastContainer position="top-right" autoClose={3000} />
      <header className="bg-indigo-700 text-white p-6 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="space-y-3">
            <h1 className="text-3xl font-bold">🏋️ Trainer Dashboard</h1>
            <p className="text-indigo-200">
              Track, log, and manage your clients’ fitness activities with ease.
              Monitor progress, set goals, and keep everything organized in one place.
            </p>
          </div>

          {selectedUser && (
            <button
              onClick={clearSelection}
              className="bg-white text-indigo-700 px-4 py-2 rounded-lg font-medium hover:bg-indigo-100 transition"
            >
              Change Client
            </button>
          )}
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6">
        <p className="text-center italic py-4 text-indigo-800">
          "Your client’s progress is your success."
        </p>

        {!selectedUser && (
          <div className="max-w-2xl mx-auto bg-white rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-bold mb-4 text-center text-indigo-700">Find Client</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                autoFocus
              />
              {isLoading && (
                <div className="absolute right-3 top-3.5">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-700"></div>
                </div>
              )}
            </div>
            {users.length > 0 && (
              <div className="mt-3 bg-white rounded-lg shadow-lg divide-y divide-gray-200 max-h-80 overflow-y-auto">
                {users.map((u) => (
                  <div
                    key={u.id}
                    onClick={() => selectUser(u)}
                    className="p-3 hover:bg-indigo-50 cursor-pointer transition"
                  >
                    <p className="font-medium text-gray-900">{u.fullName}</p>
                    <p className="text-sm text-gray-600">{u.email}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {selectedUser && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6 bg-indigo-700 text-white">
              <h2 className="text-2xl text-center font-bold">Log Activity for</h2>
              <div className="flex justify-center gap-5  items-center mt-4">
                <div>
                  <img src={selectedUser.avatar} alt="" className="w-12 h-12 rounded-full" />
                </div>
                <div>
                  <h4 className="text-indigo-200">{selectedUser.fullName}</h4>
                  <p className="text-indigo-200">{selectedUser.email}</p>
                </div>
              </div>
            </div>

            <form onSubmit={submitForm} className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Strength Training */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-indigo-700">Strength Training</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Muscle Group</label>
                    <select
                      name="muscleGroup"
                      value={formData.muscleGroup}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select Muscle Group</option>
                      {Object.keys(muscleGroups).map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>

                  {formData.muscleGroup && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Exercise</label>
                      <select
                        name="exercise"
                        value={formData.exercise}
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select Exercise</option>
                        {muscleGroups[formData.muscleGroup].map((ex) => (
                          <option key={ex} value={ex}>
                            {ex}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sets</label>
                    <input
                      type="text"
                      name="sets"
                      value={formData.sets}
                      onChange={handleNumberInput}
                      className="w-full p-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Number of sets"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reps</label>
                    <input
                      type="text"
                      name="reps"
                      value={formData.reps}
                      onChange={handleNumberInput}
                      className="w-full p-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Reps per set"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                    <input
                      type="text"
                      name="weight"
                      value={formData.weight}
                      onChange={handleNumberInput}
                      className="w-full p-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Weight used"
                    />
                  </div>
                </div>
              </div>

              {/* Cardio */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-indigo-700">Cardio Training</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cardio Minutes</label>
                    <input
                      type="text"
                      name="cardioMinutes"
                      value={formData.cardioMinutes}
                      onChange={handleNumberInput}
                      className="w-full p-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Minutes of cardio"
                    />
                  </div>
                </div>
              </div>

              {/* Progress Metrics */}
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowProgressMetrics(!showProgressMetrics)}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  {showProgressMetrics ? "Hide Progress Metrics" : "Show Progress Metrics"}
                </button>
              </div>

              {showProgressMetrics && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-indigo-700">Progress Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Strength Progress (%)</label>
                      <input
                        type="text"
                        name="strengthProgress"
                        value={formData.strengthProgress}
                        onChange={handleNumberInput}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="0-100%"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Endurance Progress (%)</label>
                      <input
                        type="text"
                        name="enduranceProgress"
                        value={formData.enduranceProgress}
                        onChange={handleNumberInput}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="0-100%"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Body Fat (%)</label>
                      <input
                        type="text"
                        name="bodyFat"
                        value={formData.bodyFat}
                        onChange={handleNumberInput}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="0-60%"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Muscle Mass (kg)</label>
                      <input
                        type="text"
                        name="muscleMass"
                        value={formData.muscleMass}
                        onChange={handleNumberInput}
                        className="w-full p-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Muscle mass in kg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Upcoming Session */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-indigo-700">Next Session</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Focus Area</label>
                    <select
                      name="focus"
                      value={formData.focus}
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="">Select Focus Area</option>
                      {focusOptions.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full p-3 rounded-lg border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Additional notes about the session, progress or observations"
                ></textarea>

                {notesHistory.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {notesHistory.map((note, idx) => (
                      <span
                        key={idx}
                        onClick={() => setFormData((prev) => ({ ...prev, notes: note }))}
                        className="cursor-pointer bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg text-sm hover:bg-indigo-200"
                      >
                        {note}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-700 hover:bg-indigo-800 text-white p-3 rounded-lg font-medium transition"
              >
                Log Activity
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default TrainerDashboard;
