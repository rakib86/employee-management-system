/* eslint-disable react-hooks/rules-of-hooks */

"use client"

import React from 'react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { onAuthStateChanged } from 'firebase/auth';
import {signInWithEmailAndPassword} from "firebase/auth";
import { auth, db } from '@/config/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';



export default function page() {

  const [isLoading, setIsLoading] = useState(false)


const handleSignIn = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    
    const email = e.target.email.value;
    const password = e.target.password.value;

    


    const q = query(collection(db, "admin"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      alert("You are not an admin");
      return;
    }
  
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "/dashboard";
    } catch (error) {
      console.error(error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        //go to dashboard
        window.location.href = "/dashboard";
      } else {
        console.log("User is signed out");
      }
    });
    return unsubscribe;
  }, []);

  return (
    <div className='grid gap-4 p-4 bg-background rounded-lg shadow-md w-96 mx-auto mt-20'>
      <form onSubmit={handleSignIn}>
        <div className="grid gap-2">
          <h1 className="text-2xl font-bold">Sign In</h1>
          
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
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
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              autoCapitalize="none"
              autoComplete="current-password"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading ? (
              <p>Loading....</p>
            ) : (
              <p>Sign In</p>
            )}
          </Button>
        </div>
      </form>
   
    </div>
  )
}
