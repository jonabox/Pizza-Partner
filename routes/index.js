const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Pizza Partner' });
});

router.get('/whatever', function(req, res) {
  res.json({message: 'wow this works'})
});

module.exports = router;