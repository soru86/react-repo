const { stationsSummary } = require("./initial-state.js");
const { charges } = require("./constants.js");

module.exports = {
    printStationSummary: () => {
        const stations = Object.keys(stationsSummary);
    
        stations.forEach((station) => {
            console.log("TOTAL_COLLECTION     %s  %i  %i", station, stationsSummary[station].totalAmtCollected, stationsSummary[station].totalDiscountGiven);
            console.log("PASSENGER_TYPE_SUMMARY");
            const passengerSummary = [];
            Object.keys(stationsSummary[station]).forEach((key) => {
                if (key in charges) {
                    passengerSummary.push([key, stationsSummary[station][key]]);
                }
            });
            passengerSummary.sort((a, b) => b[1] - a[1]);
            passengerSummary.forEach((e) => {
                console.log("%s  %i", e[0], e[1]);
            });
        });
    }
};