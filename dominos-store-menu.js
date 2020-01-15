const storeID = 3748; //1033 Mass. Ave

var pizzapi = require('dominos');
var myStore = new pizzapi.Store(storeID);
myStore.ID = storeID;

myStore.getInfo(
    function(storeData){
        console.log(storeData);
    }
);