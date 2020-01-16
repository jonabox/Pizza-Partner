const express = require('express');
const storeID = 3748; //1033 Mass. Ave

var pizzapi = require('dominos');
var myStore = new pizzapi.Store(storeID);
myStore.ID = storeID;

const router = express.Router();

/* GET /api/dominos page. */
router.get('/', function(req, res) {
  myStore.getFriendlyNames(
    function(storeData){
      res.send(storeData);
    }
);
});

module.exports = router;