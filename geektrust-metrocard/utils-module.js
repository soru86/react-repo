const {
    cardsBal,
    trips
 } = require("./initial-state.js");
const {
    charges,
    ROUND_TRIP_IND
 } = require("./constants.js");

module.exports = {
    isRoundTrip: (card) => trips.get(card)?.length === ROUND_TRIP_IND,
    isCardBalanceSufficient: (currentCardBal, passengerType) => currentCardBal > charges[passengerType],
    getCurrentCardBalance: (card) => parseInt(cardsBal.get(card) || 0)
};
