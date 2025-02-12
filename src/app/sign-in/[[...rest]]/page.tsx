"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <>
    <title>Sign-in | Zyvora AI</title>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <SignIn />
    </div>
    </>
  );
}