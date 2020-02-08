const express = require('express');

const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

require('./util/settings').load();

// TODO: Potentially add one router to house these paths
const inputRoutes = require('./api/routes/inputs');
const jobRoutes = require('./api/routes/jobs');
const specRoutes = require('./api/routes/specs');
const mlRoutes = require('./api/routes/ml');

if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
  origin: '*',
  allowedHeaders: '*',
  methods: 'PUT, POST, DELETE, GET',
}));

// TODO: Potentially fix
app.use('/inputs', inputRoutes);
app.use('/jobs', jobRoutes);
app.use('/specs', specRoutes);
app.use('/ml', mlRoutes);

app.get('/', (req, res) => {
  res.send("it's working");
})

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
