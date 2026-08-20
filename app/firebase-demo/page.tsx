"use client";

import { useState } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function FirebaseDemoPage() {
  const [inputValue, setInputValue] = useState("");
  const [status, setStatus] = useState("");

  // Removed explicit deprecated FormEvent type so TypeScript handles it cleanly
  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    try {
      // Saves data into a collection called "submissions" in Firestore
      await addDoc(collection(db, "submissions"), {
        text: inputValue,
        createdAt: new Date(),
      });
      setStatus("Data successfully saved to Firebase!");
      setInputValue("");
    } catch (error) {
      console.error("Error adding document: ", error);
      setStatus("Error saving data. Check console.");
    }
  };

  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Firebase Database Test Page</h1>
      <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type something to save..."
          style={{ padding: "10px", width: "300px", marginRight: "10px" }}
        />
        <button type="submit" style={{ padding: "10px 20px" }}>
          Save to Firebase
        </button>
      </form>
      {status && <p style={{ marginTop: "15px", fontWeight: "bold" }}>{status}</p>}
    </main>
  );
}