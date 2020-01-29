const express = require('express');
const Schedule = require('../models/Schedule');

const router = express.Router();
const menu = require('../menu.json');
const bigMenu = require('../bigMenu.json');

const storeID = 3748; //1033 Mass. Ave
const stripe = require('stripe')('sk_test_UH5YHzDrRMdIO0VOW25KzBqh00ax8Rv8fU');

var pizzapi = require('dominos');
var myStore = new pizzapi.Store(storeID);
myStore.ID = 3748;

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

/* GET /api/dominos/pricing/:product page. */
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
/* GET /api/dominos/pricing page. */
router.get('/pricing/', function (req, res) {
  let cart = req.body;
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

/* POST /api/dominos/session page. MOCK*/
router.post('/charge/', function (req, res) {
  (async () => {
    let cart = req.body.cart;
    let customer = req.body.customer;
    let dorm = req.body.dorm;
    let token = req.body.token;
    Schedule.addOrder(cart, customer, dorm, token)
    res.json({ message: "Order has been placed!"})
  }
  )();
});

module.exports = router;