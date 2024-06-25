
"use client"

import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/config/firebase";
import { doc, setDoc } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Signup() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        //show current user email if user is signed in


    });

    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const location = document.getElementById("location").value;
    const department = document.getElementById("department").value;
    const salary = document.getElementById("salary").value;



    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add a new document in collection "users" with additional information
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        name: name,
        age: age,
        location: location,
        department: department,
        salary: salary,
        id: user.uid,
      });

      alert("Account created successfully!");
        window.location.href = "/admin";
    } catch (error) {
      console.error("Error signing up:", error);
      alert("Error signing up. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <div className="grid gap-4 p-4 bg-background rounded-lg shadow-md w-96 mx-auto mt-20">
      <form onSubmit={handleSignUp}>
        <div className="grid gap-2">
          <h1 className="text-2xl font-bold">Sign Up</h1>

          {/* Additional input fields for new information */}
          <div className="grid gap-1">
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" disabled={isLoading} />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="age">Age</Label>
            <Input id="age" type="number" disabled={isLoading} />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="location">Location</Label>
            <Input id="location" type="text" disabled={isLoading} />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="department">Department</Label>
            <Input id="department" type="text" disabled={isLoading} />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="department">Salary</Label>
            <Input id="salary" type="text" disabled={isLoading} />
          </div>

          {/* Existing input fields for email and password */}
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="password">Password</Label>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              autoCapitalize="none"
              autoComplete="new-password"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading ? <p>Creating Account...</p> : <p>Sign Up</p>}
          </Button>
        </div>
      </form>
    </div>
  );
}
