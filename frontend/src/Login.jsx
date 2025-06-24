
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://16.171.149.32.nip.io:4000/auth/user", {
      credentials: "include"
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.name) navigate("/home");
      });
  }, []);

  return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <h1>Welcome to WorldMusic</h1>
      <a href="http://16.171.149.32.nip.io:4000/auth/google">
        <button style={{ marginTop: 20, padding: 10 }}>Sign in with Google</button>
      </a>
    </div>
  );
};

export default Login;
