const menu = require("./menu copy.json");
let realMenu = {};
for (category in menu) {
  let items = menu[category];
  realMenu[category] = [];
  for (item of items) {
    realItem = {};
    let name = Object.keys(item)[0];
    let code = item[name];
    let url =
      "../assets/pictures/" +
      code +
      ".jpg";
    realMenu[category].push({"name": name, "code": code, "imageURL": url }); //use this for menu.json
    // urls.push(url); //use this for menu.json
    // realMenu[code] = { name: name, price: 5.99, variant: "code" }; //use this for cart.json
  }
}

console.log(JSON.stringify(realMenu));
