"use client"
import React, { useEffect, useState } from 'react';
import { auth, db } from '@/config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';


export default function Dashboard() {
  const [users, setUsers] = useState([]);


  // Fetch all users from Firestore 'users' collection

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = db.collection('users');
      const usersSnapshot = await usersCollection.get();
      const usersData = usersSnapshot.docs.map(doc => doc.data());
      setUsers(usersData);
      console.log(usersData);
    };

    fetchUsers();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin HR Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

        {users.map(user => (
          <div key={user.id} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">
              {user.name}
            </h2>
            <p className="text-gray-700">
              Email: <span className="text-gray-900">{user.email}</span>
            </p>
            <p className="text-gray-700">
              Age: <span className="text-gray-900">{user.age}</span>
            </p>
            <p className="text-gray-700">
              Location:
              <span className="text-gray-900">{user.location}</span>
            </p>
            <p className="text-gray-700">
              Department:
              <span className="text-gray-900">{user.department}</span>
            </p>
            <p className="text-gray-800">
              Salary:
              <span className="text-gray-900 font-bold">{user.salary}</span>
            </p>
          </div>
        ))}

      </div>
    
    </div>
  );
}