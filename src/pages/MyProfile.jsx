import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, query, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function MyProfile() {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState(""); // State to store user name
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [workoutData, setWorkoutData] = useState([]);
  const [gymCheckData, setGymCheckData] = useState(null);
  const [measurementsData, setMeasurementsData] = useState(null);
  const [totalSets, setTotalSets] = useState(0); // State to store total sets performed
  const [totalReps, setTotalReps] = useState(0); // State to store total reps performed
  const [isDataVisible, setIsDataVisible] = useState(false); // Controls historical data visibility Toggle
  const navigate = useNavigate();

  // Fetch authenticated user profile data
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);

      // Fetch additional user profile data from Firestore
      const fetchUserName = async () => {
        const userDocRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          setUserName(userSnap.data().name); // Save database name record to local state
        }
      };

      fetchUserName();
    } else {
      navigate("/"); // Redirect unauthenticated users to login root
    }
  }, [navigate]);

  // Fetch available workout history dates for the authenticated user
  useEffect(() => {
    if (user) {
      const fetchDates = async () => {
        const workoutsRef = collection(db, "users", user.uid, "workouts");
        const q = query(workoutsRef);
        const querySnapshot = await getDocs(q);
        const availableDates = [];
        querySnapshot.forEach((doc) => {
          availableDates.push(doc.id); // Collect document IDs representing dates
        });
        setDates(availableDates);
      };

      fetchDates();
    }
  }, [user]);

  // Fetch all logged health & fitness data for a specific date selected by user
  const fetchDataForDate = async (date) => {
    const workoutRef = doc(db, "users", user.uid, "workouts", date);
    const gymCheckRef = doc(db, "users", user.uid, "gymCheck", date);
    const measurementsRef = doc(db, "users", user.uid, "measurements", date);
    
    const workoutSnap = await getDoc(workoutRef);
    const gymCheckSnap = await getDoc(gymCheckRef);
    const measurementsSnap = await getDoc(measurementsRef);

    if (workoutSnap.exists()) {
      const exercises = workoutSnap.data().exercises;
      setWorkoutData(exercises);

      // Compute aggregates for total sets and reps
      let setsCount = 0;
      let repsCount = 0;

      exercises.forEach(exercise => {
        exercise.sets.forEach(set => {
          setsCount += 1;
          repsCount += parseInt(set.reps, 10) || 0; // Guard against NaN values during base-10 conversion
        });
      });

      setTotalSets(setsCount);
      setTotalReps(repsCount);
    } else {
      setWorkoutData([]);
      setTotalSets(0); // Reset totals if no workout document matches the snapshot
      setTotalReps(0);
    }

    setGymCheckData(gymCheckSnap.exists() ? gymCheckSnap.data() : null);
    setMeasurementsData(measurementsSnap.exists() ? measurementsSnap.data() : null);
    setSelectedDate(date);
    setIsDataVisible(!isDataVisible); // Toggle the targeted container state visibility
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
        <h2 className="text-danger">History Log Logs</h2>
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
                
                {/* Volumetric Training Metrics summary */}
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