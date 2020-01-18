'use strict';

let order1 = {
    customer: "Jona",
    items: ["pizza"]
}
let order2 = {
    customer: "Andy",
    items: ["wings"]
}
let order3 = {
    customer: "Hector",
    items: ["wings"]
}
let partnership1 = {
    orders: [order1,order2],
    status: "order placed"
}
let partnership2 = {
    orders: [order3],
    status: "partner needed"
}
let schedule = {
    Simmons: {
        openPartnership: null,
        closedPartnerships: [partnership1]
    },
    Masseeh: {
        openPartnership: partnership2,
        closedPartnerships: []
    },
    Baker: {
        openPartnership: null,
        closedPartnerships: []
    }
};
//rep invariant: open and closed partnerships are disjoint
class Schedule {
    static getOrders(dorm){}
    static getOpenPartnerships(dorm){
        return schedule[dorm].openPartnerships;
    }
    static addOrder(dorm, order){
        openPartnership = schedule[dorm].openPartnership;
        //if no open partnerships, create a new one
        if(!openPartnership){
            let newPartnership = {
                orders: [order],
                status: "looking for partner"
            } 
            schedule[dorm].openPartnership = newPartnership;
        }
        //fill open partnership and close it
        else {
            openPartnership.orders.push(order);
            schedule[dorm].closedPartnerships.push(openPartnership);
            schedule[dorm].openPartnership = null;
        }
    }
    static checkPairs(){}
    static placeOrder(){}
}

Schedule.addOrder("Simmons", order1);
console.log(schedule);
module.exports = Schedule;