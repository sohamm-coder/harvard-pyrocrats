// src/pages/SleepTrackerPage.js
import React, { useState, useEffect, useRef, useCallback } from "react";
import { db } from "../services/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { Chart } from "chart.js/auto";
import "../styles/SleepTrackerPage.css";

const SleepTrackerPage = () => {
  const [date, setDate] = useState("");
  const [hours, setHours] = useState("");
  const [sleepData, setSleepData] = useState([]);
  const [averageSleepHours, setAverageSleepHours] = useState(0); // ✅ Store Average Sleep Hours
  const [sleepQuality, setSleepQuality] = useState("Unknown"); // ✅ Store Sleep Quality
  const chartRef = useRef(null);

  // ✅ Fetch Sleep Data from Firestore
  const fetchSleepData = useCallback(async () => {
    try {
      const snapshot = await getDocs(collection(db, "sleepTracker"));
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(entry => typeof entry.hours === "number" && !isNaN(entry.hours)); // ✅ Filter valid numbers

      setSleepData(data);

      // ✅ Calculate Average Sleep Hours (Avoid NaN)
      if (data.length > 0) {
        const total = data.reduce((sum, entry) => sum + entry.hours, 0);
        const average = total / data.length;
        setAverageSleepHours(average.toFixed(1)); // ✅ Round to 1 decimal place
        analyzeSleepQuality(average); // ✅ Update Sleep Quality
      } else {
        setAverageSleepHours(0);
        setSleepQuality("Unknown"); // ✅ Reset if no data
      }

      console.log("📊 Fetched Sleep Data:", data);
      drawChart(data); // ✅ Update Chart

    } catch (error) {
      console.error("❌ Error fetching sleep data:", error);
    }
  }, []);

  useEffect(() => {
    fetchSleepData();
  }, [fetchSleepData]); // ✅ Fix Dependency Warning

  // ✅ Analyze Sleep Quality
  const analyzeSleepQuality = (avgSleep) => {
    if (avgSleep >= 7) setSleepQuality("Good 🟢");
    else if (avgSleep >= 5) setSleepQuality("Moderate 🟡");
    else setSleepQuality("Poor 🔴");
  };

  // ✅ Submit New Sleep Entry
  const submitSleepData = async () => {
    if (!date || !hours || isNaN(hours) || parseInt(hours) <= 0) {
      alert("⚠️ Enter a valid sleep hour!");
      return;
    }

    try {
      await addDoc(collection(db, "sleepTracker"), {
        date,
        hours: parseInt(hours),
        timestamp: new Date().toISOString()
      });

      setDate("");
      setHours("");
      console.log("✅ Data saved successfully!");
      fetchSleepData(); // ✅ Refresh sleep data (including chart)
    } catch (error) {
      console.error("❌ Error saving data:", error);
    }
  };

  // ✅ Render Sleep Chart
  const drawChart = (data) => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext("2d");

    // Destroy previous chart instance before rendering a new one
    if (window.sleepChart) {
      window.sleepChart.destroy();
    }

    window.sleepChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.map(entry => entry.date),
        datasets: [{
          label: "Hours Slept",
          data: data.map(entry => entry.hours),
          borderColor: "#4A90E2",
          borderWidth: 2,
          fill: false
        }]
      },
      options: { responsive: true }
    });
  };

  return (
    <div className="sleep-tracker-container">
      <h2>😴 Sleep Tracker</h2>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <input type="number" placeholder="Hours Slept" value={hours} onChange={(e) => setHours(e.target.value)} />
      <button onClick={submitSleepData}>Save Sleep Data</button>

      <h3>📊 Sleep History</h3>
      <ul className="sleep-history">
        {sleepData.length > 0 ? (
          <>
            {sleepData.map((entry, index) => (
              <li key={entry.id || index}>
                {entry.date}: {entry.hours} hours
              </li>
            ))}
            <li className="average-hours"><strong>⏳ Average Sleep: {averageSleepHours} hours/night</strong></li>
            <li className="sleep-quality"><strong>🛏️ Sleep Quality: {sleepQuality}</strong></li>
          </>
        ) : (
          <p>No sleep data available.</p>
        )}
      </ul>

      {/* ✅ Sleep Chart */}
      <h3>📈 Sleep Pattern</h3>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default SleepTrackerPage;
