const storeID = 3748; //1033 Mass. Ave

var pizzapi = require("dominos");
//Get stores by postal code, distance is not as accurate this way
pizzapi.Track.byId(
  "P6bBiyZL2hAj8zDtfSsX",
  3748,
  function(pizzaData){
      console.log(pizzaData)
  }
);
