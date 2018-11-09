const express = require('express');

const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const config = require('config');
const cors = require('cors');

const corsConfig = {
  origin: '*',
  allowedHeaders: '*',
  methods: 'PUT, POST, DELETE, GET',
};

const jobRoutes = require('./api/routes/jobs');
const specRoutes = require('./api/routes/specs');

if (config.util.getEnv('NODE_ENV') !== 'test') app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsConfig));

app.use('/jobs', jobRoutes);
app.use('/specs', specRoutes);

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
