import React from 'react';
import { useNavigate } from 'react-router-dom';

function AppHome() {
  const navigate = useNavigate();

  const handleClick = () => {
    const audio = new Audio('/sounds/ring.mp3');
    audio.play();

    setTimeout(() => {
      const loggedInUser = localStorage.getItem('loggedInUser');
      if (loggedInUser) {
        navigate('/maingame');
      } else {
        navigate('/login');
      }
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-neutral-950 text-white">
      <h1 className="text-4xl md:text-6xl font-bold mb-8 font-orbitron drop-shadow-lg">
        Welcome to GrowMine
      </h1>

      <img
        src="/growmine-logo.png"
        alt="GrowMine Logo"
        onClick={handleClick}
        className="w-40 h-40 object-contain rounded-xl cursor-pointer hover:scale-105 transition-transform duration-300"
      />
    </div>
  );
}

export default AppHome;
