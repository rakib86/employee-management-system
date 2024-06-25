"use client";
import React, { useEffect, useState } from "react";
import { db } from "@/config/firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default function Dashboard() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const usersCollection = collection(db, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    };
    getUsers();
  }, []);

  const deleteUser = async (userId) => {
    await deleteDoc(doc(db, "users", userId));
    setUsers(users.filter(user => user.id !== userId));
  };

  const downloadReport = () => {
    const reportData = users.map(user => [
      { text: user.name, bold: true },
      user.email,
      user.attendance.toString(),
    ]);

    const docDefinition = {
      content: [
        { text: 'Employee Report', style: 'header' },
        {
          table: {
            body: [
              ['Name', 'Email', 'Attendance'],
              ...reportData
            ]
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        }
      }
    };

    pdfMake.createPdf(docDefinition).download('employee-report.pdf');
  };

  const downloadIndividualReport = (user) => {
    const userData = [
      { text: user.name, bold: true },
      { text: `Email: ${user.email}` },
      { text: `Department: ${user.department}` },
      { text: `Age: ${user.age}` },
      { text: `Salary: ${user.salary}` },
      { text: `Location: ${user.location}` },
      { text: `Last Attendance Date: ${user.lastAttendanceDate}` },
      { text: `Attendance: ${user.attendance}` },
    ];

    const docDefinition = {
      content: [
        { text: `${user.name}'s Report`, style: 'header' },
        ...userData
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        }
      }
    };

    pdfMake.createPdf(docDefinition).download(`${user.name}-report.pdf`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin HR Dashboard</h1>
      <p className="text-gray-500 mb-4">
        All Employees in the company
      </p>
      <Button onClick={downloadReport}>Download Report</Button>
      <div className="flex flex-col gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <div key={user.id} className="bg-white p-4 shadow rounded-lg flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-sm font-semibold text-gray-900">Total Attendance: {user.attendance}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="destructive" onClick={() => deleteUser(user.id)}>Delete</Button>
              <Button onClick={() => downloadIndividualReport(user)}>Download Individual Report</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}