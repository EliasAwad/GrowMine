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

  const games = [
    {
      name: "Blackjack",
      image: "/blackjack.png",
      route: "/blackjack",
    },
    {
      name: "Roulette",
      image: "/roulette.png",
      route: "/roulette",
    },
    // Add more games here
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-neutral-950 text-white p-6 flex flex-col items-center">
      {/* Header Info */}
      <div className="text-center mb-10">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <img src="/diamond-lock.png" alt="DL" className="w-10 h-10" />
          <h2 className="text-3xl font-bold text-cyan-300">
            {balance} DiamondLocks
          </h2>
        </div>
        <h1 className="text-2xl font-semibold">Welcome, {username} 👋</h1>
        <p className="text-zinc-400 text-sm">Choose a game to start playing.</p>

        <button
          onClick={addDL}
          className="mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm"
        >
          +1 DiamondLock (Dev Test)
        </button>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
        {games.map((game) => (
          <div
            key={game.name}
            onClick={() => navigate(game.route)}
            className="cursor-pointer bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden shadow-lg hover:shadow-[0_0_25px_#00f0ff] transition duration-300"
          >
            <div className="w-full h-44 flex items-center justify-center bg-black">
              <img
                src={game.image}
                alt={game.name}
                className="max-h-full max-w-full object-contain p-2"
              />
            </div>
            <div className="p-4 text-center font-bold text-lg">{game.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MainGame;
