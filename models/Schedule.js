'use strict';
const stripe = require('stripe')('sk_test_UH5YHzDrRMdIO0VOW25KzBqh00ax8Rv8fU');
const prices = require('../prices.json');

const storeID = 3748; //1033 Mass. Ave
var pizzapi = require('dominos');
var myStore = new pizzapi.Store(storeID);
myStore.ID = storeID;

let order1 = {
    customer: "Jona",
    token: null,
    items: [{ name: "pizza", count: 2 }, { name: "wings", count: 3 }]
}
let order2 = {
    customer: "Andy",
    token: null,
    items: [{ name: "pasta", count: 3 }, { name: "breadsticks", count: 3 }]
}
let order3 = {
    customer: "Hector",
    token: null,
    items: [{ name: "pizza", count: 1 }, { name: "diet-pepsi", count: 1 }]
}
let order4 = {
    customer: "Nina",
    token: null,
    items: [{ name: "salad", count: 1 }, { name: "diet-pepsi", count: 1 }]
}
let order5 = {
    customer: "Angel",
    token: null,
    items: [{ name: "wings", count: 3 }, { name: "pizza", count: 1 }, { name: "pepsi", count: 1 }]
}
let partnership1 = {
    orders: [order1, order2],
    status: "order placed"
}
let partnership2 = {
    orders: [order3],
    status: "partner needed"
}
let partnership3 = {
    orders: [order4, order5],
    status: "order placed"
}
let schedule = {
    "Simmons Hall": {
        openPartnerships: [],
        closedPartnerships: [partnership1, partnership3]
    },
    "Maseeh Hall": {
        openPartnerships: [partnership2],
        closedPartnerships: []
    },
    "Baker House": {
        openPartnerships: [],
        closedPartnerships: []
    },
    "Burton Conner": {
        openPartnerships: [],
        closedPartnerships: []
    },
    "East Campus": {
        openPartnerships: [],
        closedPartnerships: []
    },
    "MacGregor House": {
        openPartnerships: [],
        closedPartnerships: []
    },
    "McCormick Hall": {
        openPartnerships: [],
        closedPartnerships: []
    },
    "New House": {
        openPartnerships: [],
        closedPartnerships: []
    },
    "Next House": {
        openPartnerships: [],
        closedPartnerships: []
    },
    "Random Hall": {
        openPartnerships: [],
        closedPartnerships: []
    }

};
//rep invariant: open and closed partnerships are disjoint
class Schedule {
    static getOrders(dorm) { }
    static getOpenPartnerships(dorm) {
        return schedule[dorm].openPartnerships;
    }
    static getClosedPartnerships(dorm) {
        return schedule[dorm].closedPartnerships;
    }
    static getAllPartnerships(dorm) {
        return this.getOpenPartnerships(dorm).concat(this.getClosedPartnerships(dorm));
    }
    static addOrder(cart, customer, dorm, token) {
        let items = this.parseCart(cart);
        let order = {
            customer: customer,
            token: token,
            items: items
        }
        let openPartnership = this.getOpenPartnerships(dorm).pop();
        //if no open partnerships, create a new one
        if (!openPartnership) {
            let newPartnership = {
                orders: [order],
                status: "looking for partner"
            }
            schedule[dorm].openPartnerships = [newPartnership];
        }
        //fill open partnership and close it
        else {

            var today = new Date();
            var time = this.formatAMPM(today);
            openPartnership.orders.push(order);
            openPartnership.status = "order placed at " + time + " on " + (today.getMonth() + 1) + "/" + (today.getDate());
            this.placeOrder(openPartnership);
            schedule[dorm].closedPartnerships.push(openPartnership);
            schedule[dorm].openPartnerships = [];
        }
    }
    //returns items that have a count of >0 through items object
    static formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
    }

    //returns items that have a count of >0 through items object
    static parseCart(cart) {
        let items = []
        for (let item in cart) {
            if (cart[item].count > 0) {
                items.push({
                    name: cart[item].name,
                    code: cart[item].code,
                    count: cart[item].count
                })
            }
        }
        return items
    }
    static async placeOrder(partnership) {
        let token0 = partnership.orders[0].token;
        let token1 = partnership.orders[1].token;

        let total0 = 0;
        let total1 = 0;

        let order = this.makeNewOrder();

        // console.log(partnership.orders[0].items);
        for (let item of partnership.orders[0].items) {
            // console.log(item.code);
            // console.log(prices[item.code]);
            // console.log(prices[item.code].price);
            total0 += prices[item.code].price * item.count;
            order.addItem(new pizzapi.Item(
                {
                    code: prices[item.code].variant,
                    options: [],
                    quantity: item.count
                }));
        }
        for (let item of partnership.orders[1].items) {
            total1 += prices[item.code].price * item.count;
            order.addItem(new pizzapi.Item(
                {
                    code: prices[item.code].variant,
                    options: [],
                    quantity: item.count
                }));
        }

        let charge0 = (async () => {
            const charge0 = await stripe.charges.create({
                amount: total0 * 100,
                currency: 'usd',
                description: JSON.stringify(partnership.orders[0].items),
                source: token0
            });
            return charge0;
        }
        )();
        let charge1 = (async () => {
            const charge1 = await stripe.charges.create({
                amount: total1 * 100,
                currency: 'usd',
                description: JSON.stringify(partnership.orders[1].items),
                source: token1
            });
            return charge1;
        }
        )();

        Promise.all([charge0, charge1]).then(function (values) {
            let status0 = values[0].status
            let status1 = values[1].status
            if (status0 == 'succeeded' && status1 == 'succeeded') {
                order.place(
                    function (result) {
                        console.log(result);
                        console.log(JSON.stringify(result));
                    }
                );
            }
        });
    }

    static makeNewOrder() {
        var order = new pizzapi.Order(
            {
                customer: {
                    firstName: "Jonathan",
                    lastName: "Esteban",
                    address: {
                        Street: "77 Mass Ave", //MIT address
                        City: "Cambridge",
                        Region: "MA",
                        PostalCode: "02139"
                    },
                    email: "blah@mit.edu",
                    phone: "555-555-5555"
                },
                storeID: 3748,
                deliveryMethod: "Delivery"
            }
        );
        order.StoreID = 3748;
        order.StoreOrderID = order.storeID;
        var cardNumber = '9999999999999999';
        var cardInfo = new order.PaymentObject();
        cardInfo.Amount = order.Amounts.Customer;
        cardInfo.Number = cardNumber;
        cardInfo.CardType = order.validateCC(cardNumber);
        cardInfo.Expiration = '0101';//  01/15 just the numbers "01/15".replace(/\D/g,'');
        cardInfo.SecurityCode = '777';
        cardInfo.PostalCode = '02139'; // Billing Zipcode
        order.Payments.push(cardInfo);
        return order;
    }
}

// Schedule.addOrder("Simmons", order1);
console.log(schedule);
module.exports = Schedule;
