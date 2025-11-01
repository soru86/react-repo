const {
    stationsSummary
 } = require("./initial-state.js");
const {
    charges,
    DISCOUNT_FACTOR
} = require("./constants.js");

module.exports = {
    "processDiscount": (passengerType, station) => {
        let discount = charges[passengerType] * DISCOUNT_FACTOR;
        let amtCharged = discount;
        stationsSummary[station].totalDiscountGiven = stationsSummary[station].totalDiscountGiven + discount;
    
        return {
            discount,
            amtCharged           
        }
    }
};