import React from "react";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";

const Logout = () => {
  const handleLogout = async () => {
    await signOut(auth);
    alert("🚪 Logged Out Successfully!");
  };

  return <button onClick={handleLogout}>🚪 Logout</button>;
};

export default Logout;
