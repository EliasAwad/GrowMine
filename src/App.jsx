import React from "react";
import { Routes, Route } from "react-router-dom";
import AppHome from "./AppHome"; // renamed to avoid circular name clash
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import MainGame from "./pages/MainGame";
import Coinflip from "./pages/coinflip";
import Blackjack from "./pages/Blackjack";


function App() {
  return (
    <Routes>
      <Route path="/" element={<AppHome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/maingame" element={<MainGame />} />
      <Route path="/coinflip" element={<Coinflip />} />
      <Route path="/blackjack" element={<Blackjack />} />

    </Routes>
  );
}

export default App;
