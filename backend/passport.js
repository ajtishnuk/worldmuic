const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const db = require('./db');
require('dotenv').config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      done(null, result.rows[0]);
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BASE_URL}/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const googleId = profile.id;
    const displayName = profile.displayName;
    const email = profile.emails && profile.emails[0] && profile.emails[0].value;

    const result = await db.query('SELECT * FROM users WHERE google_id = $1', [googleId]);

    if (result.rows.length > 0) {
      await db.query('UPDATE users SET last_login = now() WHERE google_id = $1', [googleId]);
      return done(null, result.rows[0]);
    } else {
      const insertResult = await db.query(
        'INSERT INTO users (google_id, display_name, email, last_login) VALUES ($1, $2, $3, now()) RETURNING *',
        [googleId, displayName, email]
      );
      return done(null, insertResult.rows[0]);
    }
  } catch (err) {
    return done(err);
  }
}));

