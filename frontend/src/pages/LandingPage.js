import React from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  let navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/home");
  };

  return (
    <div className="bg-[#2B2B2B] text-white min-h-screen flex flex-col">
      <header className="w-full px-10 py-5 flex justify-between items-center">
        <div className="text-lg font-semibold">LinguaStream</div>
        <div>
          <button
            onClick={() => navigate("/signup")}
            className="mr-4 bg-transparent hover:bg-gray-700 text-white py-2 px-4 rounded"
          >
            Sign up
          </button>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => navigate("/login")}
          >
            Log in
          </button>
        </div>
      </header>
      <main className="flex flex-col items-center justify-center flex-grow mt-[-10vh]">
        <div className="flex flex-row items-center justify-center w-full">
          <div className="flex flex-col mr-40">
            <h1 className="text-5xl font-bold mb-4">Not a fan of subtitles?</h1>
            <p className="mb-8 text-sm text-lightgrey">
              LinguaStream translates audio from YouTube videos into desired
              languages and accents
            </p>
            <button
              onClick={handleGetStarted}
              className="bg-yellow-500 hover:bg-yellow-600 text-black py-3 w-40 rounded-lg"
            >
              Get started
            </button>
          </div>
          <img
            src="./landing-page.png"
            alt="Translate"
            style={{ width: "500px", height: "500px" }}
          />
        </div>
      </main>
    </div>
  );
}
