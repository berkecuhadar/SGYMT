import { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { useParams } from "react-router-dom";

export default function Profile() {
  const { userId } = useParams(); // Extract userId parameter directly from active route URL
  const [userName, setUserName] = useState(""); // State to store user name
  const [dates, setDates] = useState([]); // Array to host historical logged timeline dates
  const [selectedDate, setSelectedDate] = useState(null); // Track user's currently selected date
  const [workoutData, setWorkoutData] = useState([]); // Store specific movement performance logs
  const [gymCheckData, setGymCheckData] = useState(null); // Gym check validation data object
  const [measurementsData, setMeasurementsData] = useState(null); // Anthropometric structural measurements metrics
  const [totalSets, setTotalSets] = useState(0); // Aggregated set counter for selected training log
  const [totalReps, setTotalReps] = useState(0); // Aggregated rep counter for selected training log
  const [isDataVisible, setIsDataVisible] = useState(false); // Toggle flag to monitor view section layout state

  // Retrieve user baseline identification metrics from Firestore
  useEffect(() => {
    const fetchUserName = async () => {
      const userDocRef = doc(db, "users", userId);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        setUserName(userSnap.data().name); // Store matching username value inside local component state
      }
    };

    if (userId) {
      fetchUserName();
    }
  }, [userId]);

  // Fetch available workout timeline markers linked to the designated target userId
  useEffect(() => {
    const fetchDates = async () => {
      const workoutsRef = collection(db, "users", userId, "workouts");
      const querySnapshot = await getDocs(workoutsRef);
      const availableDates = [];
      querySnapshot.forEach((doc) => {
        availableDates.push(doc.id); // Save document path indices which represent logged dates
      });
      setDates(availableDates);
    };

    if (userId) {
      fetchDates();
    }
  }, [userId]);

  // Fetch and parse all cross-collection logs matching the user-selected date
  const fetchDataForDate = async (date) => {
    try {
      const workoutRef = doc(db, "users", userId, "workouts", date);
      const gymCheckRef = doc(db, "users", userId, "gymCheck", date);
      const measurementsRef = doc(db, "users", userId, "measurements", date);

      const workoutSnap = await getDoc(workoutRef);
      const gymCheckSnap = await getDoc(gymCheckRef);
      const measurementsSnap = await getDoc(measurementsRef);

      if (workoutSnap.exists()) {
        const exercises = workoutSnap.data().exercises;
        setWorkoutData(exercises); // Load mapped exercises directly into the data matrix

        // Calculate workload volume summaries safely
        let setsCount = 0;
        let repsCount = 0;

        exercises.forEach(exercise => {
          exercise.sets.forEach(set => {
            setsCount += 1;
            repsCount += parseInt(set.reps, 10) || 0; // Guard against potential NaN values during base-10 conversion
          });
        });

        setTotalSets(setsCount);
        setTotalReps(repsCount);
      } else {
        setWorkoutData([]);
        setTotalSets(0); // Clear totals if the active layout snapshot returns empty elements
        setTotalReps(0);
      }

      setGymCheckData(gymCheckSnap.exists() ? gymCheckSnap.data() : null);
      setMeasurementsData(measurementsSnap.exists() ? measurementsSnap.data() : null);
      setSelectedDate(date);
      setIsDataVisible(true); // Expose the active reporting dashboard UI layout wrapper
    } catch (error) {
      console.error("Error fetching historical profile metrics:", error);
    }
  };

  return (
    <div className="container text-light bg-dark p-4 d-flex min-vh-100">
      {/* Left Column: Profile Card Header */}
      <div className="d-flex flex-column align-items-center p-4" style={{ width: "300px", backgroundColor: "#2c2f38" }}>
        <img src={"/logo192.png"} alt="Profile" className="mb-3" width="150" />
        <h2>{userName || "User Profile"}</h2>
      </div>

      {/* Right Column: Date Navigation Hub & Log Analytics */}
      <div className="p-4 flex-grow-1">
        <h2 className="text-danger">History Logs</h2>
        <div className="d-flex flex-wrap gap-2 mb-4">
          {dates.map((date) => (
            <button
              key={date}
              className="btn btn-outline-light"
              onClick={() => fetchDataForDate(date)}
            >
              {date}
            </button>
          ))}
        </div>

        {/* Selected Log Visualizer Container */}
        {selectedDate && isDataVisible && (
          <div>
            <h4>Selected Date: {selectedDate}</h4>

            {/* Gym Check Summary */}
            {gymCheckData ? (
              <p>Attended Gym Today: {gymCheckData.gymCheck ? "Yes" : "No"}</p>
            ) : (
              <p className="text-muted">No gym attendance check record found for this date.</p>
            )}

            {/* Anthropometric Measurements Table */}
            {measurementsData ? (
              <div className="mt-4">
                <h5>Body Measurements</h5>
                <table className="table table-dark table-striped">
                  <thead>
                    <tr>
                      <th>Arm (cm)</th>
                      <th>Calf (cm)</th>
                      <th>Chest (cm)</th>
                      <th>Weight (kg)</th>
                      <th>Height (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{measurementsData.arm}</td>
                      <td>{measurementsData.calf}</td>
                      <td>{measurementsData.chest}</td>
                      <td>{measurementsData.weight}</td>
                      <td>{measurementsData.height}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted">No body measurements metrics recorded for this date.</p>
            )}

            {/* Resistance Training Breakdown Table */}
            {workoutData.length > 0 ? (
              <div className="mt-4">
                <h5>Logged Exercises</h5>
                <table className="table table-dark table-striped">
                  <thead>
                    <tr>
                      <th>Exercise Name</th>
                      <th>Sets</th>
                      <th>Weight</th>
                      <th>Reps</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workoutData.map((exercise, index) => (
                      <tr key={index}>
                        <td>{exercise.name}</td>
                        <td>
                          {exercise.sets.map((set, i) => (
                            <div key={i} className="small">
                              Set {i + 1}
                            </div>
                          ))}
                        </td>
                        <td>
                          {exercise.sets.map((set, i) => (
                            <div key={i} className="small">
                              {set.weight} kg
                            </div>
                          ))}
                        </td>
                        <td>
                          {exercise.sets.map((set, i) => (
                            <div key={i} className="small">
                              {set.reps} reps
                            </div>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Volumetric Training Metrics Summary */}
                <div className="p-3 bg-secondary rounded mt-3">
                  <h6 className="mb-2 text-warning">Volume Summary</h6>
                  <p className="mb-1">Total Sets Completed: <strong>{totalSets}</strong></p>
                  <p className="mb-0">Total Reps Logged: <strong>{totalReps}</strong></p>
                </div>
              </div>
            ) : (
              <p className="text-muted">No workout performance data logged for this date.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}