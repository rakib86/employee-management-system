"use client";
import React, { useEffect, useState } from "react";
import { auth, db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        } else {
          console.log("No such document!");
        }
      } else {
        setUser(null);
        setUserData(null);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {user ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">
            Welcome, {userData?.name || "User"}!
          </h2>
          <p className="text-gray-700">
            Email: <span className="text-gray-900">{userData?.email}</span>
          </p>
          <p className="text-gray-700">
            Age: <span className="text-gray-900">{userData?.age}</span>
          </p>
          <p className="text-gray-700">
            Location:
            <span className="text-gray-900">{userData?.location}</span>
          </p>
          <p className="text-gray-700">
            Department:
            <span className="text-gray-900">{userData?.department}</span>
          </p>
          <p className="text-gray-800">
            Salary:
            <span className="text-gray-900 font-bold">{userData?.salary}</span>
          </p>
        </div>
      ) : (
        <p className="text-center  text-gray-500">Loading...</p>
      )}
    </div>
  );
}
