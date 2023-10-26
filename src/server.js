const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('./passport-config');

const app = express();

app.use(express.json());
app.use(cors());
app.use(passport.initialize());

// MongoDBに接続
mongoose.connect('mongodb://localhost/todo-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Passportの設定
require('./passport-config')(passport);
app.use(passport.initialize());

// ルートの設定
app.use('/api/todos', require('./routes/todos'));
app.use('/api/users', require('./routes/users'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

