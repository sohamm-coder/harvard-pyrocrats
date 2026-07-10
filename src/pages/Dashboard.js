import React, { useState, useEffect } from "react";
import { auth, db } from "../services/firebase";
import { getDoc, doc, collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Chart } from "react-google-charts";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bmi, setBmi] = useState(null);
  const [sleepData, setSleepData] = useState([]);
  const [averageSleep, setAverageSleep] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) {
        setError("⚠️ No user logged in.");
        setLoading(false);
        navigate("/login");
        return;
      }

      try {
        console.log("🔍 Fetching user data for:", auth.currentUser.uid);
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const user = userSnap.data();
          setUserData(user);

          // ✅ BMI Calculation
          const heightInMeters = user.height / 100;
          const calculatedBmi = (user.weight / (heightInMeters * heightInMeters)).toFixed(2);
          setBmi(calculatedBmi);

          // ✅ Fetch Sleep Data
          const sleepRef = collection(db, `users/${auth.currentUser.uid}/sleepTracker`);
          const sleepSnap = await getDocs(sleepRef);
          const sleepRecords = sleepSnap.docs.map((doc) => doc.data());

          if (sleepRecords.length > 0) {
            const totalSleep = sleepRecords.reduce((sum, record) => sum + record.hours, 0);
            setAverageSleep((totalSleep / sleepRecords.length).toFixed(1));
          }
          setSleepData(sleepRecords);
        } else {
          console.warn("⚠️ No user data found in Firestore.");
          setError("⚠️ No user data found.");
        }
      } catch (err) {
        console.error("❌ Error fetching user data:", err);
        setError("❌ Error fetching user data: " + err.message);
      }

      setLoading(false);
    };

    fetchUserData();
  }, [navigate]);

  // ✅ Chart Data for Weight & Height
  const weightHeightChartData = [
    ["Metric", "Value"],
    ["Weight (kg)", userData?.weight || 0],
    ["Height (cm)", userData?.height || 0],
  ];

  return (
    <div className="dashboard-container">
      <h2>👤 Patient Dashboard</h2>

      {loading && <p>⏳ Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      
      {userData ? (
        <div className="dashboard-content">
          {/* ✅ User Info Section */}
          <div className="user-info">
            <h3>👤 Personal Information</h3>
            <p><strong>Name:</strong> {userData.firstName} {userData.lastName}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Date of Birth:</strong> {userData.dob}</p>
            <p><strong>Blood Group:</strong> {userData.bloodGroup}</p>
          </div>

          {/* ✅ BMI Section */}
          <div className="bmi-section">
            <h3>⚖️ Body Mass Index (BMI)</h3>
            <p><strong>Height:</strong> {userData.height} cm</p>
            <p><strong>Weight:</strong> {userData.weight} kg</p>
            <p><strong>BMI:</strong> {bmi}</p>
            <p><strong>Status:</strong> {bmi < 18.5 ? "Underweight" : bmi >= 25 ? "Overweight" : "Normal"}</p>
          </div>

          {/* ✅ Weight & Height Chart */}
          <div className="chart-section">
            <h3>📊 Weight & Height Overview</h3>
            <Chart
              chartType="ColumnChart"
              width="100%"
              height="300px"
              data={weightHeightChartData}
              options={{ legend: { position: "none" }, colors: ["#4285F4"] }}
            />
          </div>

          {/* ✅ Sleep Tracker */}
          <div className="sleep-section">
            <h3>😴 Sleep Tracking</h3>
            <p><strong>Average Sleep (hrs):</strong> {averageSleep}</p>

            {sleepData.length > 0 && (
              <Chart
                chartType="LineChart"
                width="100%"
                height="300px"
                data={[["Day", "Hours"], ...sleepData.map((d, i) => [i + 1, d.hours])]}
                options={{ hAxis: { title: "Days" }, vAxis: { title: "Sleep Hours" } }}
              />
            )}
          </div>
        </div>
      ) : (
        !loading && <p>No user data found.</p>
      )}
    </div>
  );
};

export default Dashboard;
