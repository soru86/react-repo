import { markets } from "../../data/market-data";

export const getMarketInfo = (marketId) => {
    let filtered = markets.filter((m) => m.id === marketId);

    if (!filtered.length) {
        filtered = markets.filter((m) => m.id === 'crypto');
    }

    return filtered[0];
};