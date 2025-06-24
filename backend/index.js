require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');

require('./passport');

const authRoutes = require('./routes/auth');
const youtubeRoutes = require('./routes/youtube');
const ratingRoutes = require('./routes/rating');

const app = express();

app.use(cors({
  origin: 'http://16.171.149.32.nip.io:3000',
  credentials: true
}));

app.use(express.json()); 

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: 'lax'
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRoutes);
app.use('/api', youtubeRoutes);
app.use('/api', ratingRoutes); 

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

