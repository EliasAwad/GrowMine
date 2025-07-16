import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const SUITS = ["♠", "♥", "♦", "♣"];
const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

// Added 1 chip to the list here:
const CHIP_VALUES = [1, 10, 50, 100, 500];

function createDeck() {
  let deck = [];
  for (let suit of SUITS) {
    for (let value of VALUES) {
      deck.push({ suit, value });
    }
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

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
  while (value > 21 && aceCount > 0) {
    value -= 10;
    aceCount--;
  }
  return value;
}

function playSound(type) {
  const sounds = {
    shuffle: "/sounds/shuffle.mp3",
    deal: "/sounds/deal.mp3",
    win: "/sounds/win.mp3",
    lose: "/sounds/lose.mp3",
    tie: "/sounds/tie.mp3",
  };
  new Audio(sounds[type]).play().catch(() => {});
}

export default function Blackjack() {
  const username = localStorage.getItem("loggedInUser");
  const [balance, setBalance] = useState(0);
  const [bet, setBet] = useState(0);
  const [deck, setDeck] = useState([]);
  const [playerCards, setPlayerCards] = useState([]);
  const [dealerCards, setDealerCards] = useState([]);
  const [showDealerHole, setShowDealerHole] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const [playerTurn, setPlayerTurn] = useState(false);
  const [isDealing, setIsDealing] = useState(false);
  const [dealerPlaying, setDealerPlaying] = useState(false);

  const navigate = useNavigate();
  const dealTimeout = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem(`balance_${username}`);
    if (stored) setBalance(parseInt(stored));
  }, [username]);

  useEffect(() => {
    return () => {
      if (dealTimeout.current) clearTimeout(dealTimeout.current);
    };
  }, []);

  const resetGame = () => {
    setBet(0);
    setDeck([]);
    setPlayerCards([]);
    setDealerCards([]);
    setShowDealerHole(false);
    setGameOver(false);
    setMessage("");
    setPlayerTurn(false);
    setIsDealing(false);
    setDealerPlaying(false);
  };

  const addChip = (value) => {
    if (gameOver || playerTurn) return;
    if (bet + value <= balance) setBet(bet + value);
  };

  const clearBet = () => {
    if (gameOver || playerTurn) return;
    setBet(0);
  };

  const startGame = () => {
    if (bet <= 0) {
      alert("Place a bet first!");
      return;
    }
    if (bet > balance) {
      alert("Insufficient DiamondLocks balance.");
      return;
    }

    setIsDealing(true);
    playSound("shuffle");

    const newDeck = createDeck();
    let pCards = [];
    let dCards = [];

    setTimeout(() => {
      pCards.push(newDeck.pop());
      playSound("deal");
      setPlayerCards([...pCards]);
      setDealerCards([...dCards]);
    }, 300);

    setTimeout(() => {
      dCards.push(newDeck.pop());
      playSound("deal");
      setPlayerCards([...pCards]);
      setDealerCards([...dCards]);
    }, 900);

    setTimeout(() => {
      pCards.push(newDeck.pop());
      playSound("deal");
      setPlayerCards([...pCards]);
      setDealerCards([...dCards]);
    }, 1500);

    setTimeout(() => {
      dCards.push(newDeck.pop());
      playSound("deal");
      setPlayerCards([...pCards]);
      setDealerCards([...dCards]);
    }, 2100);

    dealTimeout.current = setTimeout(() => {
      setDeck(newDeck);
      setShowDealerHole(false);
      setGameOver(false);
      setMessage("");
      setPlayerTurn(true);
      setIsDealing(false);

      const playerVal = getHandValue(pCards);
      if (playerVal === 21) {
        setMessage("Blackjack! You win!");
        setGameOver(true);
        setPlayerTurn(false);
        updateBalance(true);
        playSound("win");
      }
    }, 2600);
  };

  const playerHit = () => {
    if (!playerTurn || isDealing || gameOver) return;
    if (deck.length === 0) {
      alert("Deck is empty!");
      return;
    }
    const newCard = deck.pop();
    const newPlayerCards = [...playerCards, newCard];
    setPlayerCards(newPlayerCards);
    setDeck(deck);
    playSound("deal");

    const value = getHandValue(newPlayerCards);
    if (value > 21) {
      setMessage("Bust! You lose.");
      setGameOver(true);
      setPlayerTurn(false);
      updateBalance(false);
      playSound("lose");
    } else if (value === 21) {
      playerStand();
    }
  };

  const playerStand = () => {
    if (gameOver || isDealing || !playerTurn) return;
    setPlayerTurn(false);
    setShowDealerHole(true);
    dealerTurn();
  };

  const dealerTurn = async () => {
    setDealerPlaying(true);
    let currentDealerCards = [...dealerCards];
    let currentDeck = [...deck];

    while (getHandValue(currentDealerCards) < 17) {
      await new Promise((r) => setTimeout(r, 1200));
      if (currentDeck.length === 0) break;
      const card = currentDeck.pop();
      currentDealerCards.push(card);
      setDealerCards([...currentDealerCards]);
      setDeck(currentDeck);
      playSound("deal");
    }

    await new Promise((r) => setTimeout(r, 800));

    const playerVal = getHandValue(playerCards);
    const dealerVal = getHandValue(currentDealerCards);
    let result = "";

    if (dealerVal > 21) {
      result = "Dealer busts! You win!";
      playSound("win");
      updateBalance(true);
    } else if (dealerVal > playerVal) {
      result = "Dealer wins! You lose.";
      playSound("lose");
      updateBalance(false);
    } else if (dealerVal < playerVal) {
      result = "You win!";
      playSound("win");
      updateBalance(true);
    } else {
      result = "Push! It's a tie.";
      playSound("tie");
    }

    setMessage(result);
    setGameOver(true);
    setDealerPlaying(false);
  };

  const updateBalance = (won) => {
    const betAmount = bet;
    const newBalance = won ? balance + betAmount : balance - betAmount;
    setBalance(newBalance);
    localStorage.setItem(`balance_${username}`, newBalance);
  };

  const Chips = () => (
    <div className="flex space-x-4 mb-6 justify-center">
      {CHIP_VALUES.map((val) => (
        <button
          key={val}
          onClick={() => addChip(val)}
          disabled={bet + val > balance || playerTurn || gameOver}
          className={`w-14 h-14 rounded-full font-bold text-white shadow-lg
            ${bet + val > balance ? "opacity-50 cursor-not-allowed" : "bg-gradient-to-tr from-yellow-400 to-yellow-600 hover:scale-110 transform transition"}
            flex items-center justify-center`}
          title={`${val} DiamondLocks`}
        >
          {val}
        </button>
      ))}
      <button
        onClick={clearBet}
        disabled={playerTurn || gameOver || bet === 0}
        className="w-14 h-14 rounded-full bg-red-600 text-white font-bold hover:bg-red-700"
        title="Clear Bet"
      >
        ✕
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-green-900 bg-gradient-to-b from-green-800 via-green-900 to-black p-6 flex flex-col items-center font-sans select-none">
      <h1 className="text-yellow-400 text-5xl mb-4 font-extrabold drop-shadow-lg">
        Casino Blackjack
      </h1>
      <p className="mb-2 text-white font-semibold text-lg">
        Balance:{" "}
        <span className="text-yellow-400">{balance.toLocaleString()}</span>{" "}
        DiamondLocks
      </p>

      {!playerTurn && !gameOver && (
        <>
          <Chips />
          <div className="mb-6">
            <button
              disabled={bet === 0 || isDealing}
              onClick={startGame}
              className={`px-10 py-3 rounded bg-yellow-500 text-black font-bold shadow-lg
              hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isDealing ? "Dealing..." : `Start Game (${bet})`}
            </button>
          </div>
        </>
      )}

      {(playerCards.length > 0 || dealerCards.length > 0) && (
        <div className="max-w-5xl w-full bg-green-700 rounded-lg p-6 shadow-xl border-4 border-yellow-400">
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-3 text-center">
              Dealer's Hand{" "}
              {showDealerHole ? `(${getHandValue(dealerCards)})` : "(?)"}
            </h2>
            <div className="flex justify-center space-x-6">
              {dealerCards.map((card, i) => (
                <Card
                  key={i}
                  card={card}
                  hidden={!showDealerHole && i === 1}
                  large
                />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-3 text-center">
              Your Hand ({getHandValue(playerCards)})
            </h2>
            <div className="flex justify-center space-x-6">
              {playerCards.map((card, i) => (
                <Card key={i} card={card} large />
              ))}
            </div>
          </div>

          {playerTurn && (
            <div className="mt-12 flex justify-center space-x-10">
              <button
                onClick={playerHit}
                disabled={isDealing}
                className="px-10 py-3 bg-green-600 rounded-lg font-bold text-white shadow-lg hover:bg-green-700"
              >
                Hit
              </button>
              <button
                onClick={playerStand}
                disabled={isDealing}
                className="px-10 py-3 bg-red-600 rounded-lg font-bold text-white shadow-lg hover:bg-red-700"
              >
                Stand
              </button>
            </div>
          )}

          {gameOver && (
            <div className="mt-12 text-center">
              <p className="text-3xl font-extrabold mb-6 text-yellow-300 drop-shadow-lg">
                {message}
              </p>
              <button
                onClick={resetGame}
                className="px-10 py-3 bg-yellow-500 rounded-lg font-bold text-black shadow-lg hover:bg-yellow-600"
              >
                Play Again
              </button>
            </div>
          )}

          {dealerPlaying && (
            <p className="mt-8 text-center text-white italic text-lg animate-pulse">
              Dealer is playing...
            </p>
          )}
        </div>
      )}

      <button
        onClick={() => navigate("/maingame")}
        className="mt-10 underline text-zinc-400 hover:text-white"
      >
        ← Back to Main Game
      </button>
    </div>
  );
}

function Card({ card, hidden = false, large = false }) {
  const sizeClasses = large
    ? "w-20 h-28 sm:w-24 sm:h-36 text-4xl"
    : "w-12 h-16 text-xl";

  const isRed = card.suit === "♥" || card.suit === "♦";

  return (
    <div
      className={`rounded-lg shadow-md flex items-center justify-center font-bold border-2 border-yellow-400 select-none
      ${sizeClasses} ${
        hidden
          ? "bg-zinc-800 border-zinc-700 text-zinc-800 cursor-default"
          : isRed
          ? "bg-white text-red-600"
          : "bg-white text-black"
      }`}
    >
      {hidden ? "🂠" : `${card.value}${card.suit}`}
    </div>
  );
}
