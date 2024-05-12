import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  let navigate = useNavigate(); // Get the navigate function from the hook

  const handleGetStarted = () => {
    navigate("/home"); // Navigate to the HomePage
  };

  return (
    <div className="bg-[#2B2B2B] text-white min-h-screen flex flex-col items-start justify-center pl-10">
      <header className="absolute top-0 left-0 right-0 flex justify-between items-center px-10 py-5 w-full">
        <div className="text-lg font-semibold">LinguaStream</div>
        <div>
          <button className="mr-6">Sign up</button>
          <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg text-sm">
            Log in
          </button>
        </div>
      </header>
      <main className="flex flex-col items-start justify-center px-6 py-8">
        <h1 className="text-5xl font-bold mb-4">Not a fan of subtitles?</h1>
        <p className="mb-8 text-sm text-lightgrey">
          LinguaStream translates audio from YouTube videos into desired
          languages and accents
        </p>
        <button
          onClick={handleGetStarted}
          className="bg-yellow-500 hover:bg-yellow-600 text-black py-3 px-10 rounded-lg"
        >
          Get started
        </button>
      </main>
    </div>
  );
}
