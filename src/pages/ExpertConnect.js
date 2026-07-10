import React, { useState, useEffect } from "react";
import { db } from "../services/firebase"; // Firestore instance
import { collection, addDoc, getDocs } from "firebase/firestore";
import "../styles/ExpertConnect.css";

const ExpertConnect = () => {
  const [experts, setExperts] = useState([]);
  const [selectedExpert, setSelectedExpert] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [googleMeetLink, setGoogleMeetLink] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [appointments, setAppointments] = useState([]);

  // ✅ Fetch list of experts from Firestore
  useEffect(() => {
    const fetchExperts = async () => {
      try {
        console.log("🔍 Fetching medical experts from Firestore...");
        const querySnapshot = await getDocs(collection(db, "medical_experts"));
        const expertList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("✅ Experts fetched:", expertList);
        setExperts(expertList);
      } catch (error) {
        console.error("❌ Error fetching experts:", error);
      }
    };

    fetchExperts();
  }, []);

  // ✅ Fetch user's booked appointments from Firestore
  const fetchAppointments = async () => {
    try {
      console.log("🔍 Fetching appointments from Firestore...");
      const querySnapshot = await getDocs(collection(db, "appointments"));
      const appointmentList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("✅ Appointments fetched:", appointmentList);
      setAppointments(appointmentList);
    } catch (error) {
      console.error("❌ Error fetching appointments:", error);
    }
  };

  // ✅ Fetch appointments on load
  useEffect(() => {
    fetchAppointments();
  }, []);

  // ✅ Function to confirm appointment
  const confirmAppointment = async () => {
    if (!selectedExpert || !appointmentDate) return;

    // Generate Google Meet link
    const meetUrl = "https://meet.google.com/new";
    setGoogleMeetLink(meetUrl);

    try {
      console.log("📌 Saving appointment:", { selectedExpert, appointmentDate, meetUrl });

      await addDoc(collection(db, "appointments"), {
        expert: selectedExpert,
        date: appointmentDate,
        meetLink: meetUrl,
      });

      console.log("✅ Appointment saved successfully!");

      // ✅ Update local state
      setAppointments((prev) => [
        ...prev,
        { expert: selectedExpert, date: appointmentDate, meetLink: meetUrl },
      ]);

      // ✅ Show confirmation popup
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000);

      // ✅ Refresh the appointments list
      fetchAppointments();
    } catch (error) {
      console.error("❌ Error saving appointment:", error);
    }
  };

  // ✅ Emergency Connect Function
  const emergencyConnect = () => {
    window.open("https://meet.google.com/new", "_blank");
  };

  return (
    <div className="expert-connect-container">
      <h2>🔬 Expert Connect - Rare Disease Specialists</h2>

      {/* Select Expert */}
      <label>Select Medical Expert:</label>
      <select value={selectedExpert} onChange={(e) => setSelectedExpert(e.target.value)}>
        <option value="">-- Choose an Expert --</option>
        {experts.map((expert) => (
          <option key={expert.id} value={expert.name}>
            {expert.name} - {expert.specialization}
          </option>
        ))}
      </select>

      {/* Select Date */}
      <label>Select Date & Time:</label>
      <input
        type="datetime-local"
        value={appointmentDate}
        onChange={(e) => setAppointmentDate(e.target.value)}
      />

      {/* Book Appointment Button */}
      <button className="book-appointment-btn" onClick={confirmAppointment} disabled={!selectedExpert || !appointmentDate}>
        📅 Book Appointment
      </button>

      {/* ✅ Confirmation Popup */}
      {showConfirmation && (
        <div className="confirmation-popup">
          <p>✅ Appointment Confirmed!</p>
        </div>
      )}

      {/* ✅ Show Google Meet Link After Confirmation */}
      {googleMeetLink && (
        <div className="meet-link">
          <p>✅ Appointment Scheduled!</p>
          <a href={googleMeetLink} target="_blank" rel="noopener noreferrer">
            Join Google Meet 📹
          </a>
        </div>
      )}

      {/* Emergency Connect */}
      <button className="emergency-btn" onClick={emergencyConnect}>
        🚨 Emergency Connect
      </button>

      {/* ✅ Display Past Appointments */}
      <h3>📋 Your Appointments</h3>
      {appointments.length === 0 ? (
        <p>No appointments booked yet.</p>
      ) : (
        <ul className="appointments-list">
          {appointments.map((appt, index) => (
            <li key={index} className="appointment-item">
              <strong>{appt.expert}</strong> - {new Date(appt.date).toLocaleString()}
              <br />
              <a href={appt.meetLink} target="_blank" rel="noopener noreferrer">
                Join Meeting 📹
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExpertConnect;
