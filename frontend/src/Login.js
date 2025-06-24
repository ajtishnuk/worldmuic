import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './App';

const Login = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/home");
  }, [user, navigate]);

  const handleLogin = () => {
    window.location.href = "http://16.171.149.32.nip.io:4000/auth/google";
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to right, #6a11cb, #2575fc)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: '40px',
        borderRadius: '15px',
        textAlign: 'center',
        boxShadow: '0 0 15px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{ marginBottom: '20px' }}>Welcome to WorldMusic 🎵</h1>
        <p style={{ marginBottom: '30px' }}>Log in to discover top music by country.</p>
        <button
          onClick={handleLogin}
          style={{
            padding: '12px 25px',
            fontSize: '16px',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: '#fff',
            color: '#2575fc',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;

