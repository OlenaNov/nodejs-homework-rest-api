const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config({ path: './.env' });

const contactsRouter = require('./routes/api/contactsRoutes');
const usersRouter = require('./routes/api/userRoutes');

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

const { DB_HOST } = process.env;
mongoose.connect(DB_HOST)
.then(() => {
  console.log('MONGO DB SUCCESS CONNECTED');
})
.catch((err) => {
  console.log(err.message);
  process.exit(1);
})

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use(express.static('public'));

app.use('/api/contacts', contactsRouter);
app.use('/api/users', usersRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message })
})

module.exports = app
