import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SUITS = ["♠", "♥", "♦", "♣"];
const VALUES = [
  "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"
];

// Helper to create and shuffle deck
function createDeck() {
  let deck = [];
  for (let suit of SUITS) {
    for (let value of VALUES) {
      deck.push({ suit, value });
    }
  }
  // Shuffle deck
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

// Calculate blackjack hand score
function getHandValue(cards) {
  let value = 0;
  let aceCount = 0;

  for (let card of cards) {
    if (card.value === "A") {
      aceCount++;
      value += 11;
    } else if (["K", "Q", "J"].includes(card.value)) {
      value += 10;
    } else {
      value += parseInt(card.value);
    }
  }

  // Adjust for aces if busted
  while (value > 21 && aceCount > 0) {
    value -= 10;
    aceCount--;
  }

  return value;
}

export default function Blackjack() {
  const username = localStorage.getItem("loggedInUser");
  const [balance, setBalance] = useState(0);
  const [bet, setBet] = useState("");
  const [deck, setDeck] = useState([]);
  const [playerCards, setPlayerCards] = useState([]);
  const [dealerCards, setDealerCards] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [playerTurn, setPlayerTurn] = useState(false);
  const [dealerTurn, setDealerTurn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem(`balance_${username}`);
    if (stored) setBalance(parseInt(stored));
  }, [username]);

  // Start new game and deal cards
  const startGame = () => {
    const betAmount = parseInt(bet);
    if (!bet || isNaN(betAmount) || betAmount <= 0) {
      alert("Enter a valid bet amount");
      return;
    }
    if (betAmount > balance) {
      alert("You don't have enough DiamondLocks");
      return;
    }
    const newDeck = createDeck();
    const pCards = [newDeck.pop(), newDeck.pop()];
    const dCards = [newDeck.pop(), newDeck.pop()];

    setDeck(newDeck);
    setPlayerCards(pCards);
    setDealerCards(dCards);
    setGameOver(false);
    setMessage("");
    setPlayerTurn(true);
    setDealerTurn(false);
  };

  // Player hits: add a card
  const playerHit = () => {
    if (!playerTurn) return;
    if (deck.length === 0) return alert("Deck empty!");
    const newCard = deck.pop();
    setPlayerCards([...playerCards, newCard]);
    setDeck(deck);
  };

  // Player stands: dealer turn starts
  const playerStand = () => {
    setPlayerTurn(false);
    setDealerTurn(true);
  };

  // Dealer auto play logic
  useEffect(() => {
    if (dealerTurn) {
      const dealerValue = getHandValue(dealerCards);
      if (dealerValue < 17) {
        if (deck.length === 0) return alert("Deck empty!");
        const newCard = deck.pop();
        setDealerCards([...dealerCards, newCard]);
        setDeck(deck);
      } else {
        setDealerTurn(false);
        setGameOver(true);
        determineWinner();
      }
    }
  }, [dealerTurn, dealerCards, deck]);

  // Check for bust or blackjack during player turn
  useEffect(() => {
    if (!playerTurn) return;
    const playerValue = getHandValue(playerCards);
    if (playerValue > 21) {
      setMessage("Bust! You lose.");
      setGameOver(true);
      setPlayerTurn(false);
      setDealerTurn(false);
      updateBalance(false);
    } else if (playerValue === 21) {
      setMessage("Blackjack! You win!");
      setGameOver(true);
      setPlayerTurn(false);
      setDealerTurn(false);
      updateBalance(true);
    }
  }, [playerCards]);

  // Determine winner after dealer turn ends
  const determineWinner = () => {
    const playerValue = getHandValue(playerCards);
    const dealerValue = getHandValue(dealerCards);

    if (dealerValue > 21) {
      setMessage("Dealer busts! You win!");
      updateBalance(true);
    } else if (dealerValue === playerValue) {
      setMessage("Push! It's a tie.");
      // balance unchanged
    } else if (dealerValue > playerValue) {
      setMessage("Dealer wins! You lose.");
      updateBalance(false);
    } else {
      setMessage("You win!");
      updateBalance(true);
    }
  };

  // Update balance depending on win/lose
  const updateBalance = (won) => {
    const betAmount = parseInt(bet);
    let newBalance = balance;
    if (won) newBalance += betAmount;
    else newBalance -= betAmount;
    setBalance(newBalance);
    localStorage.setItem(`balance_${username}`, newBalance);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6 flex flex-col items-center">
      <h1 className="text-yellow-400 text-4xl mb-6 font-bold">Blackjack</h1>

      <p className="mb-4">Balance: {balance} DiamondLocks</p>

      {!playerTurn && !dealerTurn && !gameOver && (
        <div className="mb-4 w-full max-w-sm">
          <input
            type="number"
            min="1"
            placeholder="Enter your bet"
            value={bet}
            onChange={(e) => setBet(e.target.value)}
            className="w-full p-2 rounded text-black"
          />
          <button
            onClick={startGame}
            className="mt-2 w-full py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded"
          >
            Start Game
          </button>
        </div>
      )}

      {(playerTurn || dealerTurn || gameOver) && (
        <>
          <div className="mb-6 w-full max-w-xl flex justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-2">Player's Hand ({getHandValue(playerCards)})</h2>
              <div className="flex space-x-2">
                {playerCards.map((c, i) => (
                  <Card key={i} card={c} />
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Dealer's Hand ({dealerTurn ? "?" : getHandValue(dealerCards)})</h2>
              <div className="flex space-x-2">
                {dealerCards.map((c, i) => (
                  <Card
                    key={i}
                    card={c}
                    hidden={dealerTurn && i === 1} // hide dealer's 2nd card during dealerTurn
                  />
                ))}
              </div>
            </div>
          </div>

          {!gameOver && playerTurn && (
            <div className="flex space-x-4">
              <button
                onClick={playerHit}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded font-bold"
              >
                Hit
              </button>
              <button
                onClick={playerStand}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded font-bold"
              >
                Stand
              </button>
            </div>
          )}

          {gameOver && (
            <>
              <p className="mt-6 text-xl font-semibold">{message}</p>
              <button
                onClick={() => {
                  setBet("");
                  setPlayerCards([]);
                  setDealerCards([]);
                  setMessage("");
                  setGameOver(false);
                }}
                className="mt-4 px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded"
              >
                Play Again
              </button>
            </>
          )}
        </>
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

// Card component to display card
function Card({ card, hidden }) {
  return (
    <div
      className={`w-12 h-16 rounded-md flex items-center justify-center text-xl font-bold ${
        hidden ? "bg-zinc-700" : "bg-yellow-400 text-black"
      }`}
    >
      {hidden ? "?" : `${card.value}${card.suit}`}
    </div>
  );
}
