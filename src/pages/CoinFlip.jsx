import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./coinflip.css";

function Coinflip() {
  const username = localStorage.getItem("loggedInUser");
  const [balance, setBalance] = useState(0);
  const [bet, setBet] = useState("");
  const [choice, setChoice] = useState(null);
  const [result, setResult] = useState(null);
  const [flipping, setFlipping] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem(`balance_${username}`);
    if (stored) setBalance(parseInt(stored));
  }, [username]);

  const handleFlip = () => {
    const betAmount = parseInt(bet);
    if (!choice) return alert("Choose Heads or Tails");
    if (!bet || isNaN(betAmount) || betAmount <= 0)
      return alert("Enter a valid bet");
    if (betAmount > balance) return alert("Not enough DiamondLocks");

    setFlipping(true);
    setResult(null);

    setTimeout(() => {
      const flip = Math.random() < 0.5 ? "heads" : "tails";
      setResult(flip);
      setFlipping(false);

      const won = flip === choice;
      const newBalance = won ? balance + betAmount : balance - betAmount;
      setBalance(newBalance);
      localStorage.setItem(`balance_${username}`, newBalance);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <h1 className="text-3xl font-bold mb-4 text-yellow-400">🎲 Coinflip Game</h1>
      <p className="mb-2 text-cyan-300">{balance} DiamondLocks</p>

      <div className="flex space-x-4 my-4">
        <button
          onClick={() => setChoice("heads")}
          className={`px-4 py-2 rounded-md ${
            choice === "heads" ? "bg-yellow-400 text-black" : "bg-zinc-700"
          }`}
        >
          Heads
        </button>
        <button
          onClick={() => setChoice("tails")}
          className={`px-4 py-2 rounded-md ${
            choice === "tails" ? "bg-yellow-400 text-black" : "bg-zinc-700"
          }`}
        >
          Tails
        </button>
      </div>

      <input
        type="number"
        placeholder="Bet amount"
        value={bet}
        onChange={(e) => setBet(e.target.value)}
        className="p-2 rounded-md text-black mb-4"
        min="1"
      />

      <button
        onClick={handleFlip}
        disabled={flipping}
        className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-xl"
      >
        {flipping ? "Flipping..." : "Flip Coin"}
      </button>

      {flipping && (
        <div className="coin mt-6">
          <div className="flip-animation" />
        </div>
      )}

      {result && (
        <p className="mt-6 text-xl">
          Coin landed on: <strong className="capitalize">{result}</strong> —{" "}
          {result === choice ? (
            <span className="text-green-400">You Win!</span>
          ) : (
            <span className="text-red-500">You Lose!</span>
          )}
        </p>
      )}

      <button
        onClick={() => navigate("/maingame")}
        className="mt-8 text-sm underline text-zinc-400 hover:text-white"
      >
        ← Back to Main Game
      </button>
    </div>
  );
}

export default Coinflip;
