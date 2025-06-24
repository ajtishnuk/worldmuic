const express = require('express');
const router = express.Router();
const db = require('../db'); // Підключення до PostgreSQL

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.status(401).json({ error: 'Unauthorized' });
}

router.post('/rate', isAuthenticated, async (req, res) => {
  const { videoId, rating } = req.body;
  const user = req.user;

  if (!videoId || typeof rating !== 'number' || rating < 1 || rating > 10) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    await db.query(
      `INSERT INTO ratings (video_id, user_email, rating, created_at)
       VALUES ($1, $2, $3, NOW())`,
      [videoId, user.email, rating]
    );
    res.status(201).json({ message: 'Rating saved' });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to save rating' });
  }
});
router.get('/rating/:videoId', async (req, res) => {
  const { videoId } = req.params;

  try {
    const result = await db.query(
      `SELECT AVG(rating)::numeric(4,2) AS average, COUNT(*) AS total
       FROM ratings
       WHERE video_id = $1`,
      [videoId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Failed to fetch rating' });
  }
});

module.exports = router;

