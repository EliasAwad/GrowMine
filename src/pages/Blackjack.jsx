import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const SUITS = ["♠", "♥", "♦", "♣"];
const VALUES = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
const CHIP_VALUES = [1, 10, 50, 100, 500];
const STORAGE_KEY = "blackjack_game_state";

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
  const navigate = useNavigate();
  const dealTimeout = useRef(null);

  // States
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

  // Load balance and game state on mount
  useEffect(() => {
    // Load balance
    const storedBalance = localStorage.getItem(`balance_${username}`);
    if (storedBalance) setBalance(parseInt(storedBalance));

    // Load saved blackjack state
    const savedStateStr = localStorage.getItem(`${STORAGE_KEY}_${username}`);
    if (savedStateStr) {
      try {
        const savedState = JSON.parse(savedStateStr);
        setBet(savedState.bet || 0);
        setDeck(savedState.deck || []);
        setPlayerCards(savedState.playerCards || []);
        setDealerCards(savedState.dealerCards || []);
        setShowDealerHole(savedState.showDealerHole || false);
        setGameOver(savedState.gameOver || false);
        setMessage(savedState.message || "");
        setPlayerTurn(savedState.playerTurn || false);
        setIsDealing(savedState.isDealing || false);
        setDealerPlaying(savedState.dealerPlaying || false);
      } catch {
        // Corrupt state? Ignore
      }
    }
  }, [username]);

  // Save game state (excluding balance) whenever relevant state changes
  useEffect(() => {
    const stateToSave = {
      bet,
      deck,
      playerCards,
      dealerCards,
      showDealerHole,
      gameOver,
      message,
      playerTurn,
      isDealing,
      dealerPlaying,
    };
    localStorage.setItem(`${STORAGE_KEY}_${username}`, JSON.stringify(stateToSave));
  }, [
    bet,
    deck,
    playerCards,
    dealerCards,
    showDealerHole,
    gameOver,
    message,
    playerTurn,
    isDealing,
    dealerPlaying,
    username,
  ]);

  // Clear timeouts on unmount
  useEffect(() => {
    return () => {
      if (dealTimeout.current) clearTimeout(dealTimeout.current);
    };
  }, []);

  // Reset game state and clear saved game state & bet
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

    localStorage.removeItem(`${STORAGE_KEY}_${username}`);
  };

  // Betting logic
  const addChip = (value) => {
    if (gameOver || playerTurn) return;
    if (bet + value <= balance) setBet(bet + value);
  };

  const clearBet = () => {
    if (gameOver || playerTurn) return;
    setBet(0);
  };

  // Deduct bet immediately on game start
  const deductBetFromBalance = () => {
    if (bet > balance) {
      alert("Insufficient balance.");
      return false;
    }
    const newBalance = balance - bet;
    setBalance(newBalance);
    localStorage.setItem(`balance_${username}`, newBalance);
    return true;
  };

  // Start the game - deal cards and set states
  const startGame = () => {
    if (bet <= 0) {
      alert("Place a bet first!");
      return;
    }
    if (bet > balance) {
      alert("Insufficient DiamondLocks balance.");
      return;
    }

    if (!deductBetFromBalance()) return;

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

      setPlayerCards([...pCards]);
      setDealerCards([...dCards]);

      // Check for immediate blackjack after deal
      const playerVal = getHandValue(pCards);
      if (playerVal === 21) {
        setMessage("Blackjack! You win!");
        setGameOver(true);
        setPlayerTurn(false);
        updateBalance(true); // payout for blackjack win
        playSound("win");
      }
    }, 2600);
  };

  // Player hits - take a card
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
      playSound("lose");
      // No balance update needed; bet already deducted on start
    } else if (value === 21) {
      playerStand(); // auto-stand on 21
    }
  };

  // Player stands - dealer turn starts
  const playerStand = () => {
    if (gameOver || isDealing || !playerTurn) return;
    setPlayerTurn(false);
    setShowDealerHole(true);
    dealerTurn();
  };

  // Dealer plays according to rules
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
    } else if (playerVal > dealerVal) {
      result = "You win!";
      playSound("win");
      updateBalance(true);
    } else if (dealerVal > playerVal) {
      result = "Dealer wins! You lose.";
      playSound("lose");
      // Player lost; bet already deducted on start
    } else {
      result = "Push! It's a tie.";
      playSound("tie");
      updateBalance(null, true); // refund bet on tie
    }

    setMessage(result);
    setGameOver(true);
    setDealerPlaying(false);
  };

  // Update balance based on game outcome
  // won === true => payout (bet * 2)
  // refund === true => refund bet (tie)
  const updateBalance = (won, refund = false) => {
    if (won === true) {
      const newBalance = balance + bet * 2;
      setBalance(newBalance);
      localStorage.setItem(`balance_${username}`, newBalance);
    } else if (refund) {
      const newBalance = balance + bet;
      setBalance(newBalance);
      localStorage.setItem(`balance_${username}`, newBalance);
    }
  };

  // UI for chips
  const Chips = () => (
    <div className="flex space-x-4 mb-6 justify-center">
      {CHIP_VALUES.map((val) => (
        <button
          key={val}
          onClick={() => addChip(val)}
          disabled={bet + val > balance || playerTurn || gameOver}
          className={`w-14 h-14 rounded-full font-bold text-white shadow-lg
            ${
              bet + val > balance
                ? "opacity-50 cursor-not-allowed"
                : "bg-gradient-to-tr from-yellow-400 to-yellow-600 hover:scale-110 transform transition"
            }
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

              {/* 🧾 Game Log */}
              <div className="mt-6 bg-black bg-opacity-30 rounded-xl p-4 text-sm text-left text-white font-mono shadow-inner w-full max-w-xl mx-auto">
                <p>
                  🃏 <strong>Your Hand:</strong>{" "}
                  {playerCards.map((c) => `${c.value}${c.suit}`).join(", ")} (
                  {getHandValue(playerCards)})
                </p>
                <p>
                  🎲 <strong>Dealer's Hand:</strong>{" "}
                  {dealerCards.map((c) => `${c.value}${c.suit}`).join(", ")} (
                  {getHandValue(dealerCards)})
                </p>
                <p className="mt-2 text-yellow-300 font-bold">📣 Result: {message}</p>
              </div>

              <button
                onClick={resetGame}
                className="mt-6 px-10 py-3 bg-yellow-500 rounded-lg font-bold text-black shadow-lg hover:bg-yellow-600"
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
