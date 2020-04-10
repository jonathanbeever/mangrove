const express = require('express');

const config = require('config');

const DaAnnotations = require('../../../data_access/results/daAnnotations');
const logger = require('../../../util/logger');
const { verify } = require('../../../util/verify');
// const { ParseAnnotationJson } = require('../../models/results/utils');

const error = config.get('error');

const router = express.Router();

// Add annotation
router.put('/', async (req, res) => {
  const token = req.get('Authorization');

  const isAllowed = verify(token);
  if (!isAllowed) return res.status(401).json({ error: 'Invalid login' });

  try {
    // const parsedJson = ParseAnnotationJson(req.body);
    const parsedJson = req.body;
    console.log(req.body);
    const annotation = await DaAnnotations.AddAnnotation(parsedJson);

    return res.status(201).json(annotation);
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ error: error.internal });
  }
});

// Get all annotations associated with a given job
router.get('/:jobId', async (req, res) => {
  let { jobId } = req.params;
  const token = req.get('Authorization');
  const { jobIds, annotationType, author } = req.query;

  try {
    const isAllowed = verify(token);
    if (!isAllowed) {
      return res.status(401).json({ error: 'Invalid login' });
    }

    let searchResult;

    // ADI and AEI have specific requirements when displaying annotations.
    // Only annotations that include the exact job ids selected in the frontend
    // Can be displayed because the analysis is calculated using multiple jobs
    if (jobIds !== undefined
      && (annotationType === 'adiAnnotation' || annotationType === 'aeiAnnotation')) {
      jobId = jobIds;
      const query = {
        jobId: {
          $size: jobId.length,
          $in: jobId,
        },
        author,
      };

      searchResult = await DaAnnotations.GetAnnotationsByJobArray(jobId[0], query);
    } else {
      searchResult = await DaAnnotations.GetAnnotationsByJob(jobId, author);
    }


    return res.status(200).json(searchResult);
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ error: error.internal });
  }
});

// Delete annotation
router.delete('/:annotationId', async (req, res) => {
  const { annotationId } = req.params;
  const token = req.get('Authorization');
  const { author } = req.query;

  try {
    const isAllowed = verify(token);

    if (!isAllowed) return res.status(401).json({ error: 'Invalid login' });

    if (author === 'undefined') return res.status(400).json({ error: 'Missing Parameter: Author' });

    const deleteAnnotation = await DaAnnotations.DeleteAnnotation(annotationId, author);

    return res.status(200).json({
      success: true,
      message: deleteAnnotation
        ? `Successfully deleted Annotation with annotationId: ${annotationId}.`
        : `No valid entry found for annotationId: ${annotationId}.`,
    });
  } catch (err) {
    logger.error(err);
    return res.status(500).json({ error: error.internal });
  }
});

module.exports = router;
