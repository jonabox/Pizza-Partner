const express = require('express');
const storeID = 3748; //1033 Mass. Ave

var pizzapi = require('dominos');
var myStore = new pizzapi.Store(storeID);
myStore.ID = storeID;

const router = express.Router();
const menu = require('../menu.json');


/* GET /api/dominos page. */
router.get('/', function(req, res) {
  myStore.getFriendlyNames(
    function(storeData){
      res.send(storeData);
    }
);
});
/* GET /api/dominos/menu page. */
router.get('/menu', function(req, res) {
  myStore.getFriendlyNames(
    function(storeData){
      res.json(menu);
    }
);
});

module.exports = router;