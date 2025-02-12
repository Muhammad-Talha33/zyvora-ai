"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Chat from "@/components/Chat";

export default function ChatPage() {
  const { isSignedIn, isLoaded } = useUser(); // Check if the user is signed in
  const router = useRouter(); 
  const [isLoading, setIsLoading] = useState(true);

  // Redirect to sign-in if the user is not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in"); // Redirect to sign-in page
    } else if (isLoaded && isSignedIn) {
      setIsLoading(false); // Hide loader
    }
  }, [isLoaded, isSignedIn, router]);

  // Show loader while checking authentication
  if (!isLoaded || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        <p className="mt-4 text-lg text-purple-600">Loading...</p>
      </div>
    );
  }

  // Render the Chat component if the user is signed in
  return <Chat />;
}