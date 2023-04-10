const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const jwt = require('jsonwebtoken');
const Todo = require('./models/todo');
const cookieParser = require('cookie-parser');

app.use(cookieParser('secret'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.connect("mongodb+srv://salma:Xdd2MhwNMUbNSyAL@todo.q0p66ec.mongodb.net/?retryWrites=true&w=majority")

app.get('/register', (req, res) => {
    res.sendFile('index.html', { root: __dirname + '/public' });
});

app.get('/login', (req, res) => {
    res.sendFile('login.html', { root: __dirname + '/public' });
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

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const validPassword = await bcrypt.compare(password, user.password);
    if (validPassword) {
        const token = jwt.sign({ userId: user._id }, 'secret');
        res.cookie('token', token);
        res.redirect('/todo');
    } else {
        res.send('try again');
    }
});

app.post('/todo.html', async (req, res) => {
    const { task } = req.body;
    const token = req.cookies.token;
    try {
        const playload = jwt.verify(token, 'secret');
        const userId = playload.userId;
        const todo = new Todo({ task, completed: false, user: userId });
        await todo.save();
        const todos = await Todo.find({ user: userId });
        res.json(todos);
    } catch (err) {
        res.status(401).send('unauthorized');
    }
});

app.get('/todo.html', async (req, res) => {
    const token = req.cookies.token;
    try {
        const playload = jwt.verify(token, 'secret');
        const userId = playload.userId;
        const todos = await Todo.find({ user: userId });
        res.json(todos);
    } catch (err) {
        res.status(401).send('unauthorized');
    }
});
app.get('/todo', (req, res) => {
    res.sendFile('todo.html', { root: __dirname + '/public' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});