const express = require('express');
const storeID = 3748; //1033 Mass. Ave

var pizzapi = require('dominos');
var myStore = new pizzapi.Store(storeID);
myStore.ID = storeID;

const router = express.Router();
const Schedule = require('../models/Schedule')

const validDorms = ['Simmons', 'Masseeh', 'Baker']

/* GET /api/schedule/closed page. */
router.get('/closed/:dorm', function(req, res) {
  let dorm = req.params.dorm;
  if(!validDorms.includes(dorm)){
    res.status(400).send('Not a valid dorm.')
  }
  else {
    res.send(Schedule.getClosedPartnerships(dorm));
  }
});

/* GET /api/schedule/open page. */
router.get('/open/:dorm', function(req, res) {
  res.send(Schedule.getOpenPartnership(req.params.dorm));
});

module.exports = router;