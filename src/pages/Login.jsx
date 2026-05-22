import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 🔐 Handle User Login
  const handleLogin = async () => {
    try {
      // Set session persistence to keep user logged in across tabs/reboots
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      
      alert("Login successful!");
      navigate("/dashboard"); // Redirect to dashboard after successful authentication
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center bg-dark vh-100">
      <div className="card p-4 shadow rounded text-light bg-secondary" style={{ width: "400px" }}>
        <h2 className="text-center mb-4 text-danger">Sign In</h2>
        
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
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        {/* Submit Button */}
        <button className="btn btn-danger w-100 mb-2" onClick={handleLogin}>
          Sign In
        </button>
        
        {/* Redirect to Register */}
        <p className="text-center mt-3 mb-2">Don't have an account?</p>
        <button className="btn btn-outline-light w-100" onClick={() => navigate("/register")}>
          Sign Up
        </button>
      </div>
    </div>
  );
}