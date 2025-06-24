const express = require('express');
const router = express.Router();
const axios = require('axios');

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const countryQueries = {
  US: 'Top music USA',
  GB: 'Top music UK',
  UA: 'Українська музика',
  JP: 'J-Pop',
  KR: 'K-Pop',
  IN: 'Indian top music'
};

router.get('/videos', async (req, res) => {
  const country = req.query.country || 'US';
  const query = countryQueries[country] || 'Top music';

  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        regionCode: country,
        maxResults: 25, 
        relevanceLanguage: country === 'UA' ? 'uk' : undefined,
        order: 'viewCount',
        key: YOUTUBE_API_KEY
      }
    });

    const musicKeywords = [
      'music', 'official', 'song', 'track',
      'музика', 'відео', 'пісня', 'кліп', 'офіційне'
    ];

    const filtered = response.data.items.filter(item =>
      item.snippet.title &&
      musicKeywords.some(keyword =>
        item.snippet.title.toLowerCase().includes(keyword.toLowerCase())
      )
    );

    const selectedItems = filtered.length >= 10
      ? filtered
      : [...filtered, ...response.data.items.filter(i => !filtered.includes(i))];

    const videos = selectedItems.slice(0, 10).map(item => ({
      title: item.snippet.title,
      videoId: item.id.videoId
    }));

    res.json(videos);
  } catch (error) {
    console.error('YouTube API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

module.exports = router;

