import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "./firebase";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MyProfile from "./pages/MyProfile";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import { Spinner } from "react-bootstrap"; // Bootstrap Spinner
import Header from "./components/Header";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-dark text-light">
        <Spinner animation="border" variant="light" />
      </div>
    );
  }

  return (
    <BrowserRouter>
        <Header />
        <Routes>
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/profile" element={user ? <MyProfile /> : <Navigate to="/" />} />
        <Route path="/search" element={user ? <Search /> : <Navigate to="/" />} /> {/* Find User Page */}
        <Route path="/profile/:userId" element={user ? <Profile /> : <Navigate to="/" />} /> {/* Dynamic Profile */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
