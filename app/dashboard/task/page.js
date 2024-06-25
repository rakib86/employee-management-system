"use client"

import React, { useState, useEffect } from 'react';
import { auth, db } from '@/config/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getDoc } from 'firebase/firestore';


export default function Page() {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {

      const userId = auth.currentUser.uid;
      const userDocRef = doc(db, "users", userId);

      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setTasks(userDoc.data().tasks || []);
      } else {
        console.log("No such document!");
      }
      
    };

    fetchTasks();
  }, []);

  const handleInputChange = (e) => {
    setTask(e.target.value);
  };

  const handleAddTask = async () => {
    const userId = auth.currentUser.uid;
    const userDocRef = doc(db, "users", userId);

    try {
      await updateDoc(userDocRef, {
        tasks: arrayUnion(task)
      });
      setTasks([...tasks, task]); // Update local state
      setTask(''); // Clear input after adding
      console.log('Task added successfully');
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  };

  const handleDeleteTask = async (taskToDelete) => {
    const userId = auth.currentUser.uid;
    const userDocRef = doc(db, "users", userId);

    try {
      await updateDoc(userDocRef, {
        tasks: arrayRemove(taskToDelete)
      });
      setTasks(tasks.filter(task => task !== taskToDelete)); // Update local state
      console.log('Task deleted successfully');
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  return (
    <div className="shadow-lg p-5">
      <div>Page</div>
      <Input
        type="text"
        value={task}
        onChange={handleInputChange}
        placeholder="Enter a task"
        className="mb-2"
      />
      <Button onClick={handleAddTask} className="mb-4" variant="secondary">Add Task</Button>
      {tasks.map((task, index) => (
        <div key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded shadow mb-2">
     <span>{`${index + 1}. ${task}`}</span>
          <div>
            <Button onClick={() => handleDeleteTask(task)} className="mr-2" variant="destructive">Delete</Button> 
          </div>
        </div>
      ))}
    </div>
  );
}