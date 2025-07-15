import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function MainGame() {
  const username = localStorage.getItem("loggedInUser");
  const [balance, setBalance] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem(`balance_${username}`);
    if (stored) {
      setBalance(parseInt(stored));
    } else {
      localStorage.setItem(`balance_${username}`, 0);
    }
  }, [username]);

  const addDL = () => {
    const newBalance = balance + 1;
    setBalance(newBalance);
    localStorage.setItem(`balance_${username}`, newBalance);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-neutral-950 text-white p-4">
      <div className="bg-zinc-800/50 rounded-2xl p-8 w-full max-w-md shadow-[0_0_25px_#00f0ff] border border-cyan-500 mb-8">
        <div className="flex items-center justify-center mb-6">
          <img
            src="/diamond-lock.png"
            alt="Diamond Lock"
            className="w-12 h-12 object-contain mr-3"
          />
          <h2 className="text-3xl font-bold text-cyan-300">
            {balance} DiamondLocks
          </h2>
        </div>

        <h1 className="text-2xl font-bold text-center mb-2 drop-shadow-md">
          Welcome, {username} 👋
        </h1>
        <p className="text-center text-sm text-zinc-300 mb-6">
          This is your main GrowMine game page.
        </p>

        <button
          onClick={addDL}
          className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 rounded-xl text-white font-semibold transition duration-200 mb-6"
        >
          +1 DiamondLock (Dev Test)
        </button>

        {/* Blackjack Page Button */}
        <button
          onClick={() => navigate("/blackjack")}
          className="flex items-center justify-center space-x-3 bg-gradient-to-r from-green-400 to-green-600 text-black font-bold px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform w-full mb-4"
        >
          <span>Blackjack</span>
        </button>

        {/* Roulette Page Button */}
        <button
          onClick={() => navigate("/roulette")}
          className="flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform w-full"
        >
          <span>Roulette</span>
        </button>
      </div>
    </div>
  );
}

export default MainGame;
