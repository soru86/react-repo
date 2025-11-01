const fs = require("fs");
const { charges, CMD_BALANCE, CMD_CHECK_IN
} = require("./constants.js");
const { isRoundTrip, isCardBalanceSufficient, getCurrentCardBalance
} = require("./utils-module.js");
const { processDiscount } = require("./discount-module.js");
const { processRechargeWithDiscount, processRechargeWithoutDiscount
} = require("./recharge-module.js");
const { mapCardsToBalance, mapCardsToTrips
} = require("./cards-module.js");
const { updateTransaction, addOrUpdatePassengerCount
} = require("./station-module.js");
const { printStationSummary } = require("./print-module.js");

const filename = process.argv[2];

fs.readFile(filename, "utf8", (err, data) => {
    if (err) throw err;
    let inputLines = data.toString().split("\r\n");
    if (!inputLines.length) return;

    inputLines.forEach((line) => {
        if (line) {
            let cols = line.split(" ");
            if (!cols.length) return;
            const command = cols[0];
            const card = cols[1];

            if (command === CMD_BALANCE) {
                const balance = parseInt(cols[2]);
                mapCardsToBalance(card, balance);
            }
            if (command === CMD_CHECK_IN) {
                const passengerType = cols[2];
                const station = cols[3];
                let currentCardBal = getCurrentCardBalance(card);
                mapCardsToTrips(card, station);
                let amtCharged = 0;
                let transaction;

                if (isCardBalanceSufficient(currentCardBal, passengerType)) {
                    if (isRoundTrip(card)) {
                        transaction = processDiscount(passengerType, station);
                    } else {
                        amtCharged = charges[passengerType];
                        transaction = {
                            discount: 0,
                            amtCharged
                        };
                    }
                } else {
                    if (isRoundTrip(card)) {
                        transaction = processRechargeWithDiscount(card, passengerType, station);
                        currentCardBal = getCurrentCardBalance(card);
                    } else {
                        transaction = processRechargeWithoutDiscount(card, passengerType);
                        currentCardBal = getCurrentCardBalance(card);
                    }
                }
                updateTransaction(card, passengerType, station, transaction, currentCardBal);
                addOrUpdatePassengerCount(station, passengerType);
            }
        }
    });
    printStationSummary();
})
