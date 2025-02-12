"use client";

import { SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const { isSignedIn, isLoaded } = useUser(); // Check if the user is signed in and if Clerk is loaded
  const router = useRouter(); // Initialize the router
  const [isLoading, setIsLoading] = useState(false); // State to manage loading

  // Redirect to /chat if the user is already signed in
  useEffect(() => {
    if (isSignedIn) {
      setIsLoading(true); // Show loader
      router.push("/chat"); // Redirect to /chat
    }
  }, [isSignedIn, router]);

  // Show loader while Clerk is checking authentication or redirecting
  if (!isLoaded || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        <p className="mt-4 text-lg text-purple-600">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <title>Sign-in | Zyvora AI</title>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <h1 className="text-3xl lg:text-4xl md:text-4xl font-extrabold text-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Please Sign In to Access Zyvora AI 🤖
        </h1>
        <SignedOut>
          {/* Redirect to /c after signing in */}
          <SignInButton>
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all rounded-3xl px-6 py-2 shadow-md">
              Sign In
            </button>
          </SignInButton>
        </SignedOut>
      </div>
    </>
  );
}
