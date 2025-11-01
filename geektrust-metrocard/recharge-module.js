const {
    stationsSummary,
    cardsBal
 } = require("./initial-state.js");
const {
    charges,
    DISCOUNT_FACTOR,
    SERVICE_FEE_FACTOR,
    NO_DISCOUNT_IND
} = require("./constants.js");

module.exports = {
    processRechargeWithDiscount: (
        card,
        passengerType,
        station
    ) => {
        let discount = charges[passengerType] * DISCOUNT_FACTOR;
        let amtLess = discount - parseInt(cardsBal.get(card));
        let serviceFee = amtLess * SERVICE_FEE_FACTOR;
        cardsBal.set(card, (cardsBal.get(card) + amtLess));
        let amtCharged = discount + serviceFee;
        stationsSummary[station].totalDiscountGiven = stationsSummary[station].totalDiscountGiven + discount;
    
        return {
            discount,
            amtCharged
        };
    },
    processRechargeWithoutDiscount: (
        card,
        passengerType
    ) => {
        let amtLess = charges[passengerType] - parseInt(cardsBal.get(card));
        let serviceFee = amtLess * SERVICE_FEE_FACTOR;
        cardsBal.set(card, charges[passengerType]);
        amtCharged = charges[passengerType] + serviceFee;
    
        return {
            discount: NO_DISCOUNT_IND,
            amtCharged
        };
    }
};