import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const found = users.find(user => user.username === username && user.password === password);
    if (found) {
      localStorage.setItem('loggedInUser', username);
      alert('Login successful!');
      navigate('/');
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Login</h1>

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
        onClick={handleLogin}
        className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded text-white transition">
        Sign In
      </button>

      <p className="mt-4">
        Don’t have an account? <Link to="/signup" className="text-blue-400 underline">Sign up</Link>
      </p>
    </div>
  );
}

export default Login;
