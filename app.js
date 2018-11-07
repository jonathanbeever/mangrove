const express = require('express');

const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('config');
const cors = require('cors');

const dbConfig = config.get('dbConfig');
const corsConfig = {
  origin: '*',
  allowedHeaders: '*',
  methods: 'PUT, POST, DELETE, GET',
};

const jobRoutes = require('./api/routes/jobs');

mongoose.connect(`mongodb://${dbConfig.host}:${dbConfig.port}/${dbConfig.dbName}`, {
  useNewUrlParser: true,
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors(corsConfig));

app.use('/jobs', jobRoutes);

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
