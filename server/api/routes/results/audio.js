const express = require('express');

const config = require('config');
const fs = require('fs');
const path = require('path');

const Input = require('../../models/input');
const logger = require('../../../util/logger');
const { verify } = require('../../../util/verify');

const error = config.get('error');

const router = express.Router();

// Retrieve Audio File
// Get Input
// router.get('/', async (req, res) => {
//   const token = req.get('Authorization');
//   let { src } = req.query;
//   // src = src.split(':');
//   // console.log(src[1]);

//   try {
//     // const isAllowed = await verify(token);
//     // if (!isAllowed) {
//     //   return res.status(401).json({ error: 'Invalid login' });
//     // }

//     // const stat = fs.statSync(src[1]);
//     // console.log(stat);

//     // // Set response header
//     // res.writeHead(200, {
//     //   'Content-Type': 'audio/mpeg',
//     //   'Content-Length': stat.size,
//     // });

//     // // Create read stream
//     // const readStream = fs.createReadStream(src[1]);
//     // // Attach stream with response stream
//     // readStream.pipe(res);
//   } catch (err) {
//     logger.error(err);
//     return res.status(500).json({ error: error.internal });
//   }
// });

// Get Input
router.get('/:inputId', async (req, res) => {
  const { inputId } = req.params;

  try {
    const input = await Input.findById(inputId).exec();
    const filepath = input.path;

    const stat = fs.statSync(filepath);

    // Set response header
    res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-Length': stat.size,
    });

    // Create read stream
    const readStream = fs.createReadStream(filepath);
    // Attach stream with response stream
    readStream.pipe(res);
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ error: error.internal });
  }
});

module.exports = router;
