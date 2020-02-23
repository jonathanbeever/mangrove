const express = require('express');

const router = express.Router();

const DaSpecs = require('../../../data_access/specs/daSpecs');

const { verify } = require('../../../util/verify');

// Create Spec
router.put('/', async (req, res) => {
  const token = req.get('Authorization');

  const isAllowed = verify(token);
  if (!isAllowed) {
    return res.status(401).json({ error: 'Invalid login' });
  }

  const result = await DaSpecs.CreateSpec(req.body);

  // Check if there are any errors and return appropriate status code
  // Default is successful completion of the task
  switch (result.errorType) {
    case 'MissingKeys':
      return res.status(400).json(result);
    case 'InvalidType':
      return res.status(400).json(result);
    case 'InvalidKeys':
      return res.status(400).json(result);
    case 'Validation':
      return res.status(400).json(result);
    case 'Other':
      return res.status(500).json(result);
    default:
      return res.status(200).json(result);
  }
});

// Get Spec
router.get('/:specId', async (req, res) => {
  const { specId } = req.params;
  const token = req.get('Authorization');

  const isAllowed = verify(token);
  if (!isAllowed) {
    return res.status(401).json({ error: 'Invalid login' });
  }

  const result = await DaSpecs.GetSpecById(specId);

  // Check if there are any errors and return appropriate status code
  // Default is successful completion of the task
  switch (result.errorType) {
    case 'EmptySearchResult':
      return res.status(404).json(result);
    case 'Other':
      return res.status(500).json(result);
    default:
      return res.status(200).json(result);
  }
});

// Get All Specs
router.get('/', async (req, res) => {
  const token = req.get('Authorization');

  const isAllowed = verify(token);
  if (!isAllowed) {
    return res.status(401).json({ error: 'Invalid login' });
  }
  const result = await DaSpecs.GetSpecs();

  // Check if there are any errors and return appropriate status code
  // Default is successful completion of the task
  switch (result.errorType) {
    case 'Other':
      return res.status(500).json(result);
    default:
      return res.status(200).json(result);
  }
});

// Delete Spec
router.delete('/:specId', async (req, res) => {
  const { specId } = req.params;
  const token = req.get('Authorization');

  const isAllowed = verify(token);
  if (!isAllowed) {
    return res.status(401).json({ error: 'Invalid login' });
  }

  const result = await DaSpecs.DeleteSpec(specId);

  // Check if there are any errors and return appropriate status code
  // Default is successful completion of the task
  switch (result.errorType) {
    case 'Other':
      return res.status(500).json(result);
    default:
      return res.status(200).json(result);
  }
});

module.exports = router;
