const {
    stationsSummary,
    cardsBal
 } = require("./initial-state.js");
const { charges } = require("./constants.js");

module.exports = {
    updateTransaction: (card, passengerType, station, transaction, currentCardBal) => {
        stationsSummary[station].totalAmtCollected = stationsSummary[station].totalAmtCollected + parseInt(transaction?.amtCharged);
        currentCardBal = currentCardBal - (charges[passengerType] - parseInt(transaction?.discount));
        cardsBal.set(card, currentCardBal);
    },
    addOrUpdatePassengerCount: (station, passengerType) => {
        if (!stationsSummary[station][passengerType]) {
            stationsSummary[station][passengerType] = 1;
        } else {
            stationsSummary[station][passengerType] = stationsSummary[station][passengerType] + 1;
        }
    }
};