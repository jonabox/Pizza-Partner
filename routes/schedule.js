const express = require('express');

const router = express.Router();
const Schedule = require('../models/Schedule')

const validDorms = ["Simmons Hall", "Masseeh Hall", "Baker House", "East Campus", "MacGregor House", "McCormick Hall", "Burton Conner", "New House", "Next House", "Random Hall"]

/* GET /api/schedule/ page. */
router.get('/all/:dorm', function (req, res) {
  let dorm = req.params.dorm;
  if (!validDorms.includes(dorm)) {
    res.status(400).send('Not a valid dorm.')
  }
  else {
    res.send(Schedule.getAllPartnerships(dorm));
  }
});
/* GET /api/schedule/closed page. */
router.get('/closed/:dorm', function (req, res) {
  let dorm = req.params.dorm;
  if (!validDorms.includes(dorm)) {
    res.status(400).send('Not a valid dorm.')
  }
  else {
    res.send(Schedule.getClosedPartnerships(dorm));
  }
});

/* GET /api/schedule/open page. */
router.get('/open/:dorm', function (req, res) {
  let dorm = req.params.dorm;
  if (!validDorms.includes(dorm)) {
    res.status(400).send('Not a valid dorm.')
  }
  else {
    res.send(Schedule.getOpenPartnerships(dorm));
  }
});

module.exports = router;