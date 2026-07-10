// src/pages/MultilingualHub.js
import React, { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import "../styles/MultilingualHub.css";

const MultilingualHub = () => {
  const [diseases, setDiseases] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState("");
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [translation, setTranslation] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch all diseases from Firestore on mount
  useEffect(() => {
    fetchDiseases();
  }, []);
 

  const testFirestore = async () => {
    try {
      console.log("🔍 Testing Firestore connection...");
      const querySnapshot = await getDocs(collection(db, "diseases"));
  
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          console.log(`📝 Found document: ${doc.id}`, doc.data());
        });
      } else {
        console.warn("⚠️ No documents found in Firestore!");
      }
    } catch (error) {
      console.error("❌ Firestore Error:", error);
    }
  };
  
  testFirestore();
  


  const fetchDiseases = async () => {
    try {
        console.log("🛠 Fetching diseases from Firestore...");
        const querySnapshot = await getDocs(collection(db, "diseases"));

        if (querySnapshot.empty) {
            console.warn("⚠️ No diseases found in Firestore!");
            return;
        }

        const diseaseList = querySnapshot.docs.map((doc) => {
            console.log("✅ Found disease:", doc.id, "Data:", doc.data());
            return doc.id; // Ensure IDs are correctly fetched
        });

        setDiseases(diseaseList);
    } catch (error) {
        console.error("❌ Firestore fetch error:", error.message);
    }
};




  // ✅ Fetch available languages when disease is selected
  useEffect(() => {
    if (!selectedDisease) return;

    const fetchLanguages = async () => {
      setLoading(true);
      try {
        const diseaseDoc = await getDoc(doc(db, "diseases", selectedDisease));
        if (diseaseDoc.exists()) {
          const languageList = Object.keys(diseaseDoc.data()).map(lang => lang.trim()); // ✅ Trim spaces
          console.log(`📖 Languages for ${selectedDisease}:`, languageList);
          setLanguages(languageList);
        } else {
          setLanguages([]);
        }
      } catch (error) {
        console.error("❌ Error fetching languages:", error);
      }
      setLoading(false);
    };

    fetchLanguages();
  }, [selectedDisease]);

  // ✅ Fetch translation when language is selected
  useEffect(() => {
    if (!selectedDisease || !selectedLanguage) return;

    const fetchTranslation = async () => {
      setLoading(true);
      try {
        const diseaseDoc = await getDoc(doc(db, "diseases", selectedDisease));
        if (diseaseDoc.exists() && diseaseDoc.data()[selectedLanguage]) {
          setTranslation(diseaseDoc.data()[selectedLanguage]);
        } else {
          setTranslation("⚠️ Translation not available in this language.");
        }
      } catch (error) {
        console.error("❌ Error fetching translation:", error);
      }
      setLoading(false);
    };

    fetchTranslation();
  }, [selectedDisease, selectedLanguage]);

  return (
    <div className="multilingual-hub-container">
      <h2>🌍 Multilingual Disease Information</h2>

      {/* Disease Selection */}
      <label>Select Disease:</label>
      <select
  value={selectedDisease}
  onChange={(e) => {
    console.log("📌 Selected Disease:", e.target.value);
    setSelectedDisease(e.target.value);
    setSelectedLanguage("");
    setTranslation("");
  }}
>
  <option value="">-- Choose Disease --</option>
  {diseases.length > 0 ? (
    diseases.map((disease, index) => {
      console.log(`📌 Rendering Disease Option [${index}]:`, disease);
      return (
        <option key={disease} value={disease}>
          {disease}
        </option>
      );
    })
  ) : (
    <option disabled>⚠️ No diseases available</option>
  )}
</select>



      {/* Language Selection */}
      <label>Select Language:</label>
      <select
        value={selectedLanguage}
        disabled={!selectedDisease || languages.length === 0}
        onChange={(e) => setSelectedLanguage(e.target.value)}
      >
        <option value="">-- Choose Language --</option>
        {languages.map((lang) => (
          <option key={lang} value={lang}>
            {lang}
          </option>
        ))}
      </select>

      {/* Display Translation */}
      <div className="article-content">
        {loading ? <p>⏳ Loading...</p> : null}
        {selectedLanguage && <h3>📖 {selectedLanguage} Translation</h3>}
        {translation ? <p>{translation}</p> : <p>📝 Select a disease and language to view information.</p>}
      </div>
    </div>
  );
};

export default MultilingualHub;
