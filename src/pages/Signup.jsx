import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];

    const exists = users.find(user => user.username === username);
    if (exists) {
      alert('Username already taken');
      return;
    }

    users.push({ username, password });
    localStorage.setItem('users', JSON.stringify(users));
    alert('Account created!');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Sign Up</h1>

      <input
        className="mb-4 p-2 rounded bg-zinc-800 w-64"
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
      />
      <input
        className="mb-4 p-2 rounded bg-zinc-800 w-64"
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />

      <button
        onClick={handleSignup}
        className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white transition">
        Sign Up
      </button>

      <p className="mt-4">
        Already have an account? <Link to="/login" className="text-green-400 underline">Login</Link>
      </p>
    </div>
  );
}

export default Signup;
