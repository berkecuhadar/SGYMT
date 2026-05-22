import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  // 👤 Handle New User Registration
  const handleRegister = async () => {
    try {
      // Create authentication record in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Initialize and store the accompanying profile document inside Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        profilePhoto: "logo192.png",
        createdAt: serverTimestamp(),  
      });

      alert("Your account has been successfully created!");
      navigate("/dashboard"); // Redirect user to their fresh dashboard page
    } catch (error) {
      alert("Registration Error: " + error.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-dark vh-100">
      <div className="card p-4 shadow rounded text-light bg-secondary" style={{ width: "400px" }}>
        <h2 className="text-center mb-4 text-danger">Sign Up</h2>
        
        {/* Name Input */}
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-control bg-dark text-light border-light"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        {/* Email Input */}
        <div className="mb-3">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-control bg-dark text-light border-light"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        {/* Password Input */}
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control bg-dark text-light border-light"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        {/* Submit Registration Button */}
        <button className="btn btn-danger w-100 mb-2" onClick={handleRegister}>
          Sign Up
        </button>
        
        {/* Alternative Navigation back to Login */}
        <p className="text-center mt-3 mb-2">Already have an account?</p>
        <button className="btn btn-outline-light w-100" onClick={() => navigate("/")}>
          Sign In
        </button>
      </div>
    </div>
  );
}