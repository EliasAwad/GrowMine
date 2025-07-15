import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const numbers = [
  { num: 0, color: "green" },
  { num: 1, color: "red" },
  { num: 2, color: "black" },
  { num: 3, color: "red" },
  { num: 4, color: "black" },
  { num: 5, color: "red" },
  { num: 6, color: "black" },
  { num: 7, color: "red" },
  { num: 8, color: "black" },
  { num: 9, color: "red" },
  { num: 10, color: "black" },
  // Add up to 36 as you like...
];

function Roulette() {
  const username = localStorage.getItem("loggedInUser");
  const [balance, setBalance] = useState(0);
  const [betAmount, setBetAmount] = useState("");
  const [betType, setBetType] = useState(null); // "red", "black", "green", or number
  const [result, setResult] = useState(null);
  const [spinning, setSpinning] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem(`balance_${username}`);
    if (stored) setBalance(parseInt(stored));
  }, [username]);

  const placeBet = () => {
    const bet = parseInt(betAmount);
    if (!betType) return alert("Please select a bet (color or number)");
    if (isNaN(bet) || bet <= 0) return alert("Enter a valid bet amount");
    if (bet > balance) return alert("Not enough DiamondLocks");

    setSpinning(true);
    setResult(null);

    setTimeout(() => {
      const spinResult = numbers[Math.floor(Math.random() * numbers.length)];
      setResult(spinResult);
      setSpinning(false);

      let won = false;
      let payout = 0;

      // Check if bet matches
      if (typeof betType === "number") {
        if (spinResult.num === betType) {
          won = true;
          payout = bet * 35; // typical roulette payout for exact number
        }
      } else if (betType === spinResult.color) {
        if (spinResult.color === "green") {
          won = false; // betting green only wins exact 0
        } else {
          won = true;
          payout = bet * 2; // 1:1 payout for color
        }
      } else if (betType === "green" && spinResult.num === 0) {
        won = true;
        payout = bet * 35;
      }

      const newBalance = won ? balance + payout : balance - bet;
      setBalance(newBalance);
      localStorage.setItem(`balance_${username}`, newBalance);
    }, 3000); // 3 seconds spinning delay
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <h1 className="text-4xl font-bold mb-6 text-yellow-400">🎡 Roulette</h1>
      <p className="mb-4 text-cyan-300">Balance: {balance} DiamondLocks</p>

      <input
        type="number"
        placeholder="Bet amount"
        value={betAmount}
        onChange={(e) => setBetAmount(e.target.value)}
        className="p-2 mb-4 rounded text-black"
        min="1"
      />

      <div className="mb-4 flex space-x-4 flex-wrap justify-center max-w-md">
        <button
          className={`px-4 py-2 rounded ${
            betType === "red" ? "bg-red-600" : "bg-red-900"
          }`}
          onClick={() => setBetType("red")}
        >
          Red
        </button>
        <button
          className={`px-4 py-2 rounded ${
            betType === "black" ? "bg-gray-300 text-black" : "bg-gray-700"
          }`}
          onClick={() => setBetType("black")}
        >
          Black
        </button>
        <button
          className={`px-4 py-2 rounded ${
            betType === "green" ? "bg-green-600" : "bg-green-900"
          }`}
          onClick={() => setBetType("green")}
        >
          Green (0)
        </button>
      </div>

      <div className="mb-4 flex flex-wrap justify-center max-w-md gap-2">
        {/* Number buttons 0-10 (add more if you want) */}
        {[...Array(11).keys()].map((num) => (
          <button
            key={num}
            className={`w-10 h-10 rounded-full ${
              betType === num
                ? "bg-yellow-400 text-black font-bold"
                : "bg-zinc-700"
            }`}
            onClick={() => setBetType(num)}
          >
            {num}
          </button>
        ))}
      </div>

      <button
        onClick={placeBet}
        disabled={spinning}
        className="px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg shadow hover:bg-yellow-600 disabled:opacity-50"
      >
        {spinning ? "Spinning..." : "Spin"}
      </button>

      {result && !spinning && (
        <div className="mt-6 text-center">
          <p>
            Result:{" "}
            <span
              className={`font-bold ${
                result.color === "red"
                  ? "text-red-500"
                  : result.color === "black"
                  ? "text-gray-400"
                  : "text-green-500"
              }`}
            >
              {result.num} ({result.color})
            </span>
          </p>
          {(() => {
            const won =
              (typeof betType === "number" && betType === result.num) ||
              (betType === "green" && result.num === 0) ||
              (betType === result.color && result.color !== "green");

            return won ? (
              <p className="text-green-400 font-bold mt-2">You Win!</p>
            ) : (
              <p className="text-red-500 font-bold mt-2">You Lose!</p>
            );
          })()}
        </div>
      )}

      <button
        onClick={() => navigate("/maingame")}
        className="mt-8 underline text-zinc-400 hover:text-white"
      >
        ← Back to Main Game
      </button>
    </div>
  );
}

export default Roulette;
