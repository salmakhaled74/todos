const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const Todo = require('./models/todo');
const ejs = require('ejs');
const session = require('express-session')
const cookieParser = require('cookie-parser');
const user = require('./models/user');
const flatpickr = require('flatpickr');
const passport = require('passport');
require('dotenv').config();


app.engine('ejs', ejs.renderFile);
app.set('view engine', 'ejs');
app.use(cookieParser('secret'));

app.use('/public', express.static('public', {
  setHeaders: function (res, path, stat) {
    res.set('Content-Type', 'application/javascript')
  }
}))

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((err) => {
    console.error('Error connecting to the database', err);
  });


app.get('/home', (req, res) => {
  res.sendFile('home.html', { root: __dirname + '/public' });
});


// const GoogleStrategy = require('passport-google-oauth20').Strategy;

// passport.use(new GoogleStrategy({
//     clientID: '278958539991-5ri3gi8c1ab4t4eipu1d4pju6kje8aiv.apps.googleusercontent.com',
//     clientSecret: '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',
//     callbackURL: "http://localhost:3000/auth/google/callback"
//   },
//   function(accessToken, refreshToken, profile, done) {
//     // This function will be called when the user is authenticated with Google.
//     // You can use the information in the "profile" object to create a user account or log the user in.
//     // The "done" function should be called with the user object or an error.
//   }
// ));

// // Initiate the authentication flow with Google
// app.get('/auth/google',
//   passport.authenticate('google', { scope: ['profile'] }));

// // Handle the callback from Google
// app.get('/auth/google/callback',
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect to the "todo" page
//     res.redirect('/todo');
//   });



app.get('/register', (req, res) => {
  res.sendFile('index.html', { root: __dirname + '/public' });
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    res.status(404).send({ message: "Login failed! Check authentication credentials" });
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (validPassword) {
    const token = jwt.sign({ userId: user._id }, 'secret', { expiresIn: '24h' });
    console.log('Token:', token);
    res.cookie('token', token);
    res.redirect('/todo');
  } else {
    res.status(404).send({ message: "Login failed! Check authentication credentials" });
  }
});

app.get('/login', async (req, res) => {
  const token = req.cookies.token;
  console.log('Token:', token);
  if (!token) {
    res.sendFile('login.html', { root: __dirname + '/public' });
  }
  try {
    const playload = jwt.verify(token, 'secret');
    const userId = playload.userId;
    const todos = await Todo.find({ user: userId });
    res.render('todo.ejs', { todos: todos });
  } catch (err) {
    console.log(err);
  }
});

//new user
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  console.log('Username:', email);
  const hash = await bcrypt.hash(password, 12);
  const user = new User({ email, password: hash });
  await user.save();
  const token = jwt.sign({ userId: user._id }, 'secret');
  res.cookie('token', token);
  res.redirect('/todo');
});


app.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/home');
});


//add todo
app.post('/todo', async (req, res) => {
  const { task } = req.body;
  console.log('Task:', task);
  const token = req.cookies.token;
  const playload = jwt.verify(token, 'secret');
  const userId = playload.userId;
  if (!userId) {
    res.redirect('/login');
    return;
  }
  try {
    const todo = new Todo({
      task,
      user: userId,
      completed: false
    });
    let todos = await Todo.find({ user: userId });
    todos.push(todo);
    await todo.save();
    res.status(201).json({ newTodo: todo._id });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error creating todo');
  }
});

//get all todos
app.get('/todo', async (req, res) => {
  const token = req.cookies.token;
  const playload = jwt.verify(token, 'secret');
  const userId = playload.userId;
  console.log('UserId:', userId);
  if (!userId) {
    res.redirect('/login');
    return;
  }
  try {
    const todos = await Todo.find({ user: userId });
    console.log('Todos:', todos);
    res.render('todo', { todos });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error getting todos');
  }
});


//update todo
app.put('/todo/:id', async (req, res) => {
  const token = req.cookies.token;
  const playload = jwt.verify(token, 'secret');
  const userId = playload.userId;
  const { task } = req.body;
  const { id } = req.params;
  if (!userId) {
    res.redirect('/login');
    return;
  }
  try {
    const todo = await Todo.findByIdAndUpdate(id, { task });
    if (!todo) {
      res.status(404).send('Todo not found');
      return;
    }
    res.status(200).send('Todo updated');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating todo');
  }
});

//update todo status
app.put('/todo/:id/status', async (req, res) => {
  const token = req.cookies.token;
  const playload = jwt.verify(token, 'secret');
  const userId = playload.userId;
  if (!userId) {
    res.redirect('/login');
    return;
  }
  try {
    const todo = await Todo.findById({ _id: req.params.id });
    if (!todo) {
      res.status(404).send('Todo not found');
      return;
    }
    todo.completed = true;
    await todo.save();
    res.status(200).send('Todo updated');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating todo status');
  }
});

//delete todo
app.delete('/todo/:id', async (req, res) => {
  const token = req.cookies.token;
  const playload = jwt.verify(token, 'secret');
  const userId = playload.userId;
  if (!userId) {
    res.redirect('/login');
    return;
  }
  try {
    const result = await Todo.deleteOne({ _id: req.params.id });
    console.log('Result:', result);
    if (result.deletedCount === 0) {
      res.status(404).send('Todo not found');
      return;
    }
    res.status(200).send('Todo deleted');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting todo');
  }
});

// //date for todo
// app.put('/todo/:id/date', async (req, res) => {
//   const token = req.cookies.token;
//   const playload = jwt.verify(token, 'secret');
//   const userId = playload.userId;
//   if (!userId) {
//     res.redirect('/login');
//     return;
//   }
//   try {
//     const todo = await Todo.findById({ _id: req.params.id });
//     if (!todo) {
//       res.status(404).send('Todo not found');
//       return;
//     }
//     const newDueDate = req.body.date;
//     todo.date = newDueDate;
//     await todo.save();
//     res.status(200).send('Todo date updated');
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error updating todo date');
//   }
// });


//delete all todos
app.delete('/todo', async (req, res) => {
  const token = req.cookies.token;
  const playload = jwt.verify(token, 'secret');
  const userId = playload.userId;
  if (!userId) {
    res.redirect('/login');
    return;
  }
  try {
    const result = await Todo.deleteMany({ user: userId });
    console.log('Result:', result);
    if (result.deletedCount === 0) {
      res.status(404).send('Todo not found');
      return;
    }
    res.status(200).send('Todo deleted');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error deleting todo');
  }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
