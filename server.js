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

app.use('/public', express.static('public', {
  setHeaders: function (res, path, stat) {
    res.set('Content-Type', 'application/javascript')
  }
}))

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://salma:Xdd2MhwNMUbNSyAL@todo.q0p66ec.mongodb.net/?retryWrites=true&w=majority")
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((err) => {
    console.error('Error connecting to the database', err);
  });

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

//new user
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
    await todo.save();
    res.status(201).send('Todo created');
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
    const todos = await Todo.find();
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
  if (!userId) {
    res.redirect('/login');
    return;
  }
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      res.status(404).send('Todo not found');
      return;
    }
    todo.task = req.body.title;
    await todo.save();
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
    const todo = await Todo.findById({_id: req.params.id});
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
    const result = await Todo.deleteOne({_id: req.params.id});
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
