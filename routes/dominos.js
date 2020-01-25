const express = require('express');
const storeID = 3748; //1033 Mass. Ave

var pizzapi = require('dominos');
var myStore = new pizzapi.Store(storeID);
myStore.ID = 3748;

var order = new pizzapi.Order(
  {
    "customer":{
      "firstName":"Jonathan",
      "lastName":"Esteban",
      "address":{
        "Street": "229 Vassar Street",
        "City": "Cambridge",
        "Region": "MA",
        "PostalCode": "02139"
      },
      "email":"jesteban@mit.edu",
      "phone":"7875480992"
    },
    "storeID":3748,
    "deliveryMethod":"Delivery"
  }
);

order.StoreID = 3748;
order.StoreOrderID = order.storeID;

const router = express.Router();
const menu = require('../menu.json');
const bigMenu = require('../bigMenu.json');

/* GET /api/dominos page. */
router.get('/', function (req, res) {
  myStore.getFriendlyNames(
    function (storeData) {
      res.send(storeData);
    }
  );
});
/* GET /api/dominos/menu page. */
router.get('/menu', function (req, res) {
  myStore.getFriendlyNames(
    function (storeData) {
      res.json(menu);
    }
  );
});

/* GET /api/dominos/pricing page. */
router.get('/pricing/:product', function (req, res) {
  let productCode = req.params.product;
  let variantCode = bigMenu.result.Products[productCode].Variants[0];

  order.addItem(
    new pizzapi.Item(
      {
        code: variantCode,
        options: [],
        quantity: 1
      }
    )
  );
  order.price(
    function (response) {
      res.send("$" + response.result.Order.Amounts.Payment);
    }
  );
});

module.exports = router;