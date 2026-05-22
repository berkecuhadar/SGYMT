import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Search() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // 🔍 Fetch all registered users from Firestore on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = collection(db, "users");
        const querySnapshot = await getDocs(usersRef);
        const usersList = [];
        
        querySnapshot.forEach((doc) => {
          usersList.push({ id: doc.id, ...doc.data() });
        });
        
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching user list:", error);
      }
    };

    fetchUsers();
  }, []);

  // 🎯 Redirect to the selected user's public profile page
  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`); 
  };

  return (
    <div className="container p-4 text-light bg-dark min-vh-100">
      <h2 className="text-danger mb-4">Search Users</h2>
      
      {/* User Selection Feed List */}
      <div className="list-group shadow">
        {users.length > 0 ? (
          users.map((user) => (
            <button
              key={user.id}
              className="list-group-item list-group-item-action bg-secondary text-light border-dark py-3"
              onClick={() => handleUserClick(user.id)}
            >
              <div className="d-flex align-items-center">
                <span className="fw-bold">🏋️‍♂️ {user.name || "Anonymous Athlete"}</span>
              </div>
            </button>
          ))
        ) : (
          <p className="text-muted">No registered users found...</p>
        )}
      </div>
    </div>
  );
}