const express = require('express');
const storeID = 3748; //1033 Mass. Ave
const stripe = require('stripe')('sk_test_UH5YHzDrRMdIO0VOW25KzBqh00ax8Rv8fU');

var pizzapi = require('dominos');
var myStore = new pizzapi.Store(storeID);
myStore.ID = 3748;

var order = new pizzapi.Order(
  {
    "customer": {
      "firstName": "Jonathan",
      "lastName": "Esteban",
      "address": {
        "Street": "229 Vassar Street",
        "City": "Cambridge",
        "Region": "MA",
        "PostalCode": "02139"
      },
      "email": "jesteban@mit.edu",
      "phone": "7875480992"
    },
    "storeID": 3748,
    "deliveryMethod": "Delivery"
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

/* GET /api/dominos/session page. */
router.get('/session/:total', function (req, res) {
  (async () => {
    let total = req.params.total;
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        name: 'Pizza',
        description: 'Order from Pizza Partner',
        images: ['https://example.com/t-shirt.png'],
        amount: total,
        currency: 'usd',
        quantity: 1,
      }],
      success_url: 'https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://example.com/cancel',
    });
    console.log("session:");
    console.log(session);
  }
  )();
});

/* GET /api/dominos/session page. */
router.get('/charge/:token', function (req, res) {
  (async () => {
    let token = req.params.token;
    const charge = await stripe.charges.create({
      amount: 50 * 100,
      currency: 'usd',
      description: 'Example charge',
      source: token,
    });
    console.log(charge);
  }
  )();
});

module.exports = router;