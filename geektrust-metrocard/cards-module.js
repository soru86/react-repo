const {
    cardsBal,
    trips 
 } = require("./initial-state.js");

module.exports = {
    mapCardsToBalance: (card, balance) => cardsBal.set(card, balance),
    mapCardsToTrips: (card, startStation) => {
        if (!trips.get(card)) {
            const stations = [startStation];
            trips.set(card, stations);
        } else {
            const existingTrips = trips.get(card);
            existingTrips.push(startStation);
            trips.set(card, existingTrips);
        }
    }
};