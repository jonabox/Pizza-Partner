const storeID = 3748;

var pizzapi = require('dominos');
var myStore = new pizzapi.Store(storeID);
myStore.ID = storeID;

myStore.getInfo(
    function(storeData){
        console.log(storeData);
    }
);