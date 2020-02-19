const express = require('express');

const router = express.Router();

router.put('/', async (req, res) => {
  res.status(200).json({ hello: 'world' });
});

module.exports = router;
