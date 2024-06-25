"use client";
import React, { useEffect, useState } from "react";
import { auth, db } from "@/config/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore"; // Import updateDoc
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

  // Function to increment attendance
const incrementAttendance = async () => {
  if (user) {
    const userRef = doc(db, "users", user.uid);
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

    // Fetch the latest user data to ensure it's up-to-date
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      const lastAttendanceDate = userData.lastAttendanceDate;

      // Check if the user has already marked attendance today
      if (lastAttendanceDate !== currentDate) {
        // User hasn't marked attendance today, so increment and update
        await updateDoc(userRef, {
          attendance: (userData.attendance || 0) + 1,
          lastAttendanceDate: currentDate, // Update the last attendance date
        }).then(() => {
          // Update local state to reflect the change
          setUserData({ ...userData, attendance: (userData.attendance || 0) + 1, lastAttendanceDate: currentDate });
        }).catch((error) => {
          console.error("Error updating document: ", error);
        });
      } else {
        console.log("Attendance already marked for today.");
      }
    } else {
      console.log("No such document!");
    }
  }
};
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {user ? (
        <>
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
            <p className="text-gray-800">
              Attendance:
              <span className="text-gray-900 font-bold">{userData?.attendance || 0}</span>
            </p>
          </div>
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={incrementAttendance}
          >
            Turn In
          </button>
        </>
      ) : (
        <p className="text-center text-gray-500">Loading...</p>
      )}
    </div>
  );
}