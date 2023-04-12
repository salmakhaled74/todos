const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const Todo = require('./models/todo');
const ejs = require('ejs');
const cookieParser = require('cookie-parser');

app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');
app.use(cookieParser('secret'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.connect("mongodb+srv://salma:Xdd2MhwNMUbNSyAL@todo.q0p66ec.mongodb.net/?retryWrites=true&w=majority")

app.get('/register', (req, res) => {
  res.sendFile('index.html', { root: __dirname + '/public' });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.json({ loginFailed: true });
    return;
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (validPassword) {
    const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '1h' });
    res.cookie('token', token);
    const todos = await Todo.find({ user: user._id });
    res.redirect('/todo');
  } else {
    res.json({ loginFailed: true });
  }
});

app.get('/login', async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect('/login');
  }
  try {
    const playload = jwt.verify(token, 'secret');
    const userId = playload.userId;
    const todos = await Todo.find({ user: userId });
    res.render('todo.ejs', { todos: todos });
  } catch (err) {
    res.redirect('/login');
  }
});

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hash = await bcrypt.hash(password, 12);
  const user = new User({ email, password: hash });
  await user.save();
  const token = jwt.sign({ userId: user._id }, 'secret');
  res.cookie('token', token);
  res.redirect('/');
});


app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/login');
});


app.get('/todo', async (req, res) => {
  const token = req.cookies.token;
  const playload = jwt.verify(token, 'secret');
  const userId = playload.userId;
  if (!userId) {
    res.redirect('/login');
    return;
  }
  try {
    const todos = await Todo.find();
    res.render('todo', { todos });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
