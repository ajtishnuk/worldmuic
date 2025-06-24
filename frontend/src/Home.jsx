import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './App';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [country, setCountry] = useState('US');
  const [authChecked, setAuthChecked] = useState(false);
  const [ratings, setRatings] = useState({});
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    fetch("http://16.171.149.32.nip.io:4000/auth/user", { credentials: "include" })
      .then(res => {
        if (res.status === 401) {
          setUser(null);
          navigate("/login");
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) setUser(data);
        setAuthChecked(true);
      })
      .catch(err => {
        console.error("Auth check error:", err);
        setUser(null);
        navigate("/login");
      });
  }, [navigate, setUser]);

  useEffect(() => {
    if (!authChecked) return;

    fetch(`http://16.171.149.32.nip.io:4000/api/videos?country=${country}`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        setVideos(data);

        const fetchRatings = async () => {
          const ratingMap = {};
          for (const video of data) {
            try {
              const res = await fetch(`http://16.171.149.32.nip.io:4000/api/rating/${video.videoId}`);
              const result = await res.json();
              ratingMap[video.videoId] = result.average || null;
            } catch (err) {
              console.error("Rating fetch error:", err);
            }
          }
          setRatings(ratingMap);
        };

        fetchRatings();
      })
      .catch(err => {
        console.error("Failed to fetch videos:", err);
      });
  }, [country, authChecked]);

  const handleRating = async (videoId, rating) => {
    try {
      await fetch("http://16.171.149.32.nip.io:4000/api/rate", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ videoId, rating })
      });
      alert("Оцінку збережено!");
    } catch (err) {
      console.error("Помилка збереження оцінки:", err);
      alert("Помилка збереження оцінки");
    }
  };

  const logout = () => {
    fetch("http://16.171.149.32.nip.io:4000/auth/logout", {
      method: "POST",
      credentials: "include"
    })
      .then(res => {
        if (!res.ok) throw new Error("Logout failed");
        setUser(null);
        navigate("/login");
      })
      .catch(err => {
        console.error("Logout error:", err);
        alert("Logout failed. Try again.");
      });
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '10px 20px', background: '#f2f2f2', borderBottom: '1px solid #ccc'
      }}>
        <div style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>🎵 WorldMusic</div>
        {user && (
          <div>
            <span style={{ marginRight: 10 }}>
              Welcome, {user.name}<br />
              <small>Last login: {new Date(user.lastLogin).toLocaleString()}</small>
            </span>
            <button
              onClick={logout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ff4d4f',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Logout
            </button>
          </div>
        )}
      </header>

      <main style={{ textAlign: 'center', marginTop: 40 }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>Top Music Videos in {country}</h1>
        <select
          onChange={e => setCountry(e.target.value)}
          value={country}
          style={{
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #ccc',
            marginBottom: '30px',
            fontSize: '16px'
          }}
        >
          <option value="US">USA</option>
          <option value="GB">UK</option>
          <option value="UA">Ukraine</option>
          <option value="JP">Japan</option>
          <option value="KR">South Korea</option>
          <option value="IN">India</option>
        </select>

        <ul style={{
          listStyle: 'none',
          padding: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '40px',
          justifyContent: 'center',
          marginTop: '30px'
        }}>
          {videos.map((video, index) => (
            <li key={index} style={{
              backgroundColor: '#f9f9f9',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}>
              <h3>{video.title}</h3>
              <iframe
                width="320"
                height="180"
                src={`https://www.youtube.com/embed/${video.videoId}`}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>

              {ratings[video.videoId] !== null && (
                <div style={{ marginTop: 10, fontSize: '14px', color: '#555' }}>
                  ⭐ Середній бал: <strong>{ratings[video.videoId]}</strong>
                </div>
              )}

              <div style={{ marginTop: 10 }}>
                <label style={{ marginRight: 8 }}>Оцініть відео (1-10):</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  onChange={(e) => handleRating(video.videoId, parseInt(e.target.value))}
                  style={{
                    width: '60px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc'
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default Home;

