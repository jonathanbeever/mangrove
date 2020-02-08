const express = require('express');

const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

require('./util/settings').load();

// TODO: Potentially add one router to house these paths
const router = require('./api/routes/router');

if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({
  origin: '*',
  allowedHeaders: '*',
  methods: 'PUT, POST, DELETE, GET',
}));

// API endpoints / routes
app.use('/', router);

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
