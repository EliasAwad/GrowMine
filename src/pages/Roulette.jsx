import React from "react";
import { useNavigate } from "react-router-dom";

function Roulette() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-6">
      <h1 className="text-4xl font-bold mb-6 text-pink-500">🎡 Roulette Game</h1>
      <p className="mb-6">This is where you will build the Roulette game.</p>
      
      {/* Back button */}
      <button
        onClick={() => navigate("/maingame")}
        className="px-6 py-3 bg-pink-600 rounded-lg hover:bg-pink-700 transition"
      >
        ← Back to Main Game
      </button>
    </div>
  );
}

export default Roulette;
