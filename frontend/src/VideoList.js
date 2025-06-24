
import React, { useEffect, useState } from "react";

function VideoList({ country }) {
  const [videos, setVideos] = useState([]);
  const [ratings, setRatings] = useState({});
  const [scores, setScores] = useState({});

  useEffect(() => {
    fetch(`http://16.171.149.32.nip.io:4000/api/youtube/videos?country=${country}`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        setVideos(data);
        data.forEach(video => {
          fetch(`http://16.171.149.32.nip.io:4000/api/rating/${video.videoId}`, {
            credentials: "include"
          })
            .then(res => res.json())
            .then(r => {
              setRatings(prev => ({ ...prev, [video.videoId]: r }));
            });
        });
      });
  }, [country]);

  const handleRate = (videoId) => {
    const score = parseInt(scores[videoId]);
    if (!score || score < 1 || score > 10) return;

    fetch("http://16.171.149.32.nip.io:4000/api/rating/rate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ videoId, score })
    })
      .then(res => res.json())
      .then(() => {
        fetch(`http://16.171.149.32.nip.io:4000/api/rating/${videoId}`, {
          credentials: "include"
        })
          .then(res => res.json())
          .then(r => {
            setRatings(prev => ({ ...prev, [videoId]: r }));
          });
      });
  };

  return (
    <div>
      {videos.map(video => (
        <div key={video.videoId}>
          <h4>{video.title}</h4>
          <iframe
            width="420"
            height="315"
            src={`https://www.youtube.com/embed/${video.videoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={video.title}
          ></iframe>
          <div>
            <input
              type="number"
              min="1"
              max="10"
              value={scores[video.videoId] || ""}
              onChange={(e) =>
                setScores(prev => ({ ...prev, [video.videoId]: e.target.value }))
              }
            />
            <button onClick={() => handleRate(video.videoId)}>Rate</button>
            {ratings[video.videoId] && (
              <p>Average rating: {ratings[video.videoId].average || "N/A"} ({ratings[video.videoId].total} votes)</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default VideoList;
