import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [gymCheck, setGymCheck] = useState(false);
  const [measurements, setMeasurements] = useState({ arm: "", calf: "", chest: "", weight: "", height: "" });
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState([{ reps: "", weight: "" }]);
  const [workouts, setWorkouts] = useState([]); // 💡 Keeping state to use below
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return navigate("/");

    const fetchTodayData = async () => {
      const today = new Date().toISOString().split("T")[0];
      
      // Fetch gym check status
      const gymCheckRef = doc(db, "users", user.uid, "gymCheck", today);
      const gymCheckSnap = await getDoc(gymCheckRef);
      if (gymCheckSnap.exists()) {
        setGymCheck(true);
      }

      // 💡 Fetch today's already logged workouts to populate the summary list
      const workoutRef = doc(db, "users", user.uid, "workouts", today);
      const workoutSnap = await getDoc(workoutRef);
      if (workoutSnap.exists()) {
        setWorkouts(workoutSnap.data().exercises || []);
      }
    };

    fetchTodayData();
  }, [user, navigate]);

  // 🏋️‍♂️ Save Gym Check Status
  const handleGymCheck = async () => {
    const today = new Date().toISOString().split("T")[0];
    await setDoc(doc(db, "users", user.uid, "gymCheck", today), {
      date: Timestamp.now(),
      gymCheck: true,
    });
    setGymCheck(true);
  };

  // 📏 Save Body Measurements to Firestore
  const handleSaveMeasurements = async () => {
    const today = new Date().toISOString().split("T")[0];
    await setDoc(doc(db, "users", user.uid, "measurements", today), {
      ...measurements,
      date: Timestamp.now(),
    });
    alert("Measurements saved successfully!");
  };

  // 🏋️‍♂️ Add and Save Workout Logs
  const handleAddWorkout = async () => {
    if (!exerciseName || sets.length === 0) {
      return alert("Exercise name and set details cannot be empty!");
    }
    
    const today = new Date().toISOString().split("T")[0];
    const workoutRef = doc(db, "users", user.uid, "workouts", today);
    const workoutSnap = await getDoc(workoutRef);

    let newExercises = [];
    if (workoutSnap.exists()) {
      newExercises = workoutSnap.data().exercises;
    }

    newExercises.push({
      name: exerciseName,
      sets,
    });

    await setDoc(workoutRef, { date: Timestamp.now(), exercises: newExercises });
    setWorkouts(newExercises); // 💡 Updating state to sync real-time UI render feed
    setExerciseName("");
    setSets([{ reps: "", weight: "" }]);
    alert("Exercise log saved successfully!");
  };

  return (
    <div className="container text-light bg-dark p-4">
      <h2 className="text-center mb-4 text-danger">🏋️‍♂️ Dashboard</h2>

      {/* Gym Check Section */}
      <div className="card bg-secondary p-3 mb-3 shadow rounded">
        <h4 className="mb-3">Gym Check</h4>
        {gymCheck ? (
          <p className="text-success">✅ You hit the gym today!</p>
        ) : (
          <button className="btn btn-danger w-100" onClick={handleGymCheck}>
            I Hit the Gym Today
          </button>
        )}
      </div>

      {/* Measurements Section */}
      <div className="card bg-secondary p-3 mb-3 shadow rounded">
        <h4 className="mb-3">📏 Measurements</h4>
        {["arm", "calf", "chest", "weight", "height"].map((key) => (
          <div className="mb-2" key={key}>
            <label className="form-label">{key.toUpperCase()}</label>
            <input
              type="number"
              className="form-control bg-dark text-light border-light"
              placeholder={`Enter ${key}`}
              value={measurements[key]}
              onChange={(e) => setMeasurements({ ...measurements, [key]: e.target.value })}
            />
          </div>
        ))}
        <button className="btn btn-danger w-100" onClick={handleSaveMeasurements}>
          Save Measurements
        </button>
      </div>

      {/* Workouts Section */}
      <div className="card bg-secondary p-3 mb-3 shadow rounded">
        <h4 className="mb-3">🏋️‍♂️ Exercises</h4>
        <input
          type="text"
          className="form-control mb-2 bg-dark text-light border-light"
          placeholder="Exercise Name"
          value={exerciseName}
          onChange={(e) => setExerciseName(e.target.value)}
        />
        {sets.map((set, index) => (
          <div className="d-flex gap-2 mb-2" key={index}>
            <input
              type="number"
              className="form-control bg-dark text-light border-light"
              placeholder="Reps"
              value={set.reps}
              onChange={(e) => {
                const newSets = [...sets];
                newSets[index] = { ...newSets[index], reps: e.target.value };
                setSets(newSets);
              }}
            />
            <input
              type="number"
              className="form-control bg-dark text-light border-light"
              placeholder="Weight (Kg)"
              value={set.weight}
              onChange={(e) => {
                const newSets = [...sets];
                newSets[index] = { ...newSets[index], weight: e.target.value };
                setSets(newSets);
              }}
            />
          </div>
        ))}
        <button className="btn btn-outline-light w-100 mb-2" onClick={() => setSets([...sets, { reps: "", weight: "" }])}>
          + Add Set
        </button>
        <button className="btn btn-danger w-100" onClick={handleAddWorkout}>
          Save Exercise
        </button>
      </div>

      {/* 💡 New Section: Today's Workout Summary Feed */}
      {workouts.length > 0 && (
        <div className="card bg-secondary p-3 shadow rounded">
          <h4 className="mb-3 text-warning">📝 Today's Exercises</h4>
          <ul className="list-group list-group-flush">
            {workouts.map((workout, idx) => (
              <li key={idx} className="list-group-item bg-dark text-light rounded mb-2 border-light">
                <h5 className="text-danger">{workout.name}</h5>
                <div className="d-flex flex-wrap gap-3">
                  {workout.sets.map((s, i) => (
                    <span key={i} className="badge bg-secondary p-2">
                      Set {i + 1}: {s.reps} reps @ {s.weight} kg
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}