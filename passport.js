const passport = require('passport');
const YandexStrategy = require('passport-yandex').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const pool = require('./db');
const bcrypt = require('bcrypt');

require('dotenv').config();

passport.use(new YandexStrategy({
  clientID: process.env.YANDEX_CLIENT_ID,
  clientSecret: process.env.YANDEX_CLIENT_SECRET,
  callbackURL: process.env.YANDEX_CALLBACK_URL
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE yandex_id = $1', [profile.id]);
    let user = result.rows[0];

    if (!user) {
      const username = profile.displayName || profile.id;
      const insertResult = await pool.query(
        'INSERT INTO users (yandex_id, username, email) VALUES ($1, $2, $3) RETURNING *',
        [profile.id, username, profile.emails[0].value]
      );
      user = insertResult.rows[0];
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.use(new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password'
  },
  async (username, password, done) => {
    try {
      const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
      const user = result.rows[0];

      if (!user) {
        return done(null, false, { message: 'Неверный логин или пароль' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return done(null, false, { message: 'Неверный логин или пароль' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    done(null, result.rows[0]);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;