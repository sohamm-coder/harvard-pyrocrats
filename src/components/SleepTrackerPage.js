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
  const [sleepQuality, setSleepQuality] = useState(null);
  const chartRef = useRef(null);

  // Fetch stored sleep records
  const fetchSleepData = useCallback(async () => {
    try {
      const snapshot = await getDocs(collection(db, "sleepTracker"));
      const data = snapshot.docs.map(doc => doc.data());
      setSleepData(data);
      analyzeSleepQuality(data);
      drawChart(data);
    } catch (error) {
      console.error("Error fetching sleep data:", error);
    }
  }, []);

  useEffect(() => {
    fetchSleepData();
  }, [fetchSleepData]);

  // Analyze Sleep Quality
  const analyzeSleepQuality = (data) => {
    if (data.length > 0) {
      const avgSleep = data.reduce((sum, entry) => sum + entry.hours, 0) / data.length;
      if (avgSleep >= 7) setSleepQuality("Good");
      else if (avgSleep >= 5) setSleepQuality("Moderate");
      else setSleepQuality("Poor");
    }
  };

  // Submit New Sleep Entry
  const submitSleepData = async () => {
    if (!date || !hours) return alert("⚠️ Enter valid sleep data!");
    try {
      await addDoc(collection(db, "sleepTracker"), {
        date,
        hours: parseInt(hours)
      });
      setDate("");
      setHours("");
      fetchSleepData(); // Refresh data
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  // Render Sleep Chart
  const drawChart = (data) => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext("2d");
    if (window.sleepChart) window.sleepChart.destroy(); // Destroy previous instance

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
      <h2>😴 Child Sleep Tracker</h2>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      <input type="number" placeholder="Hours Slept" value={hours} onChange={(e) => setHours(e.target.value)} />
      <button onClick={submitSleepData}>Save Sleep Data</button>
      
      <h3>📊 Sleep History</h3>
      <canvas ref={chartRef}></canvas>
      {sleepQuality && <p className="sleep-quality">🛏️ Sleep Quality: <strong>{sleepQuality}</strong></p>}
    </div>
  );
};

export default SleepTrackerPage;
