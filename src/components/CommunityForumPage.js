import React, { useState, useEffect } from "react";
import { db } from "../services/firebase"; // Firestore instance
import { collection, addDoc, onSnapshot, orderBy, query } from "firebase/firestore";
import "../styles/CommunityForum.css"; // ✅ Ensure this file exists

const CommunityForum = () => {
  const [selectedDisease, setSelectedDisease] = useState("");
  const [message, setMessage] = useState("");
  const [posts, setPosts] = useState([]);
  const [facebookCommunityLinks] = useState({
    "Rare Syndrome": "https://www.facebook.com/groups/raresyndrome",
    "Autoimmune Disorder": "https://www.facebook.com/groups/autoimmune",
    "Neurological Disease": "https://www.facebook.com/groups/neurologicaldisease",
  });

  // ✅ Fetch existing posts from Firestore in real-time
  useEffect(() => {
    if (!selectedDisease) return;

    const q = query(collection(db, `forums/${selectedDisease}/posts`), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(fetchedPosts);
    });

    return () => unsubscribe();
  }, [selectedDisease]);

  // ✅ Handle new post submission
  const submitPost = async () => {
    if (!message.trim() || !selectedDisease) return;

    try {
      await addDoc(collection(db, `forums/${selectedDisease}/posts`), {
        text: message,
        timestamp: new Date(),
      });
      setMessage(""); // Clear input after submission
    } catch (error) {
      console.error("❌ Error posting message:", error);
    }
  };

  return (
    <div className="community-forum-container">
      <h2>🌍 Community Forum</h2>

      {/* Select Disease */}
      <label>Select Your Disease:</label>
      <select value={selectedDisease} onChange={(e) => setSelectedDisease(e.target.value)}>
        <option value="">-- Choose Your Condition --</option>
        {Object.keys(facebookCommunityLinks).map((disease) => (
          <option key={disease} value={disease}>
            {disease}
          </option>
        ))}
      </select>

      {/* Post a Message */}
      <textarea
        placeholder="Share your thoughts, questions, or support..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>
      <button onClick={submitPost} disabled={!message.trim() || !selectedDisease}>
        📢 Post Message
      </button>

      {/* Posts List */}
      <h3>📋 Forum Posts</h3>
      {posts.length === 0 ? (
        <p>No discussions yet. Start one now!</p>
      ) : (
        <ul className="forum-posts">
          {posts.map((post) => (
            <li key={post.id} className="forum-post">
              <p>{post.text}</p>
              <small>🕒 {new Date(post.timestamp.toDate()).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      )}

      {/* Facebook Community Links */}
      {selectedDisease && facebookCommunityLinks[selectedDisease] && (
        <div className="fb-community">
          <p>🔗 Connect with {selectedDisease} community on Facebook:</p>
          <a href={facebookCommunityLinks[selectedDisease]} target="_blank" rel="noopener noreferrer">
            Join Facebook Group 📲
          </a>
        </div>
      )}

      {/* Emergency Help */}
      <button className="emergency-btn" onClick={() => alert("Contacting support...")}>
        🚨 Emergency Support
      </button>
    </div>
  );
};

export default CommunityForum;
