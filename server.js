require("dotenv").config(); // библиотека dotenv загружает переменные среды из файла .env
const express = require('express');
const session = require('express-session');
const passport = require('./passport');
const path = require('path');
const app = express();
const port = process.env.PORT || 3003;
const bcrypt = require('bcrypt');
const pool = require('./db');
const cookieParser = require("cookie-parser");

const queryRouter = require('./Routes/queryRouter');
const procedureRoutes = require("./Routes/procedureRouter");
const functionRoutes = require("./Routes/functionRouter");
const userRouter = require("./Routes/userRouter");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//app.get("/", (req, res)=> {
 //   res.send("Hello"); //метод get получает параметры: 1) url, 2) функцию collback с параметрами запрос и ответ
//});

app.get('/home', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Привет, ${req.user.username}!`);
  } else {
    res.send('Привет');
  }
});

app.get('/auth/yandex', passport.authenticate('yandex'));

app.get('/auth/yandex/callback', 
  passport.authenticate('yandex', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/');
  });

app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Привет, ${req.user.username}!`);
  } else {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  }
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Маршрут для регистрации
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *',
      [username, hashedPassword]
    );
    const user = result.rows[0];
    res.status(201).json(user);
  } catch (error) {
    console.error("Ошибка при регистрации", error);
    res.status(500).json({ error: error.message });
  }
});

// Маршрут для авторизации
app.post('/login', passport.authenticate('local', {
  successRedirect: '/home',
  failureRedirect: '/login',
  failureFlash: true
}));

// Используем маршрутизаторы
app.use('/api/query', queryRouter);
app.use("/api/procedure", procedureRoutes);
app.use("/api/function", functionRoutes);
app.use('/user', userRouter);

// Статические файлы
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});