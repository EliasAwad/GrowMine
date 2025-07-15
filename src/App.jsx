import React from "react";
import { Routes, Route } from "react-router-dom";
import AppHome from "./AppHome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MainGame from "./pages/MainGame";
import Blackjack from "./pages/Blackjack"; // Keep Blackjack if you want it
import Roulette from "./pages/Roulette";


function App() {
  return (
    <Routes>
      <Route path="/roulette" element={<Roulette />} />

      <Route path="/" element={<AppHome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/maingame" element={<MainGame />} />
      {/* Remove Coinflip route */}
      {/* <Route path="/coinflip" element={<Coinflip />} /> */}
      <Route path="/blackjack" element={<Blackjack />} />
    </Routes>
  );
}

export default App;
