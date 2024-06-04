// volatility_calculator.js
const VOLATILITY_THRESHOLD = 1.0;  // This can be adjusted based on your needs

function formatVolume(volume) {
    if (volume >= 1_000_000_000_000) {
        return `${(volume / 1_000_000_000_000).toFixed(1)}T`;
    } else if (volume >= 1_000_000_000) {
        return `${(volume / 1_000_000_000).toFixed(1)}B`;
    } else if (volume >= 1_000_000) {
        return `${(volume / 1_000_000).toFixed(1)}M`;
    } else if (volume >= 1_000) {
        return `${(volume / 1_000).toFixed(1)}k`;
    } else {
        return `${volume.toFixed(2)}`;
    }
}

function calculateVolatility(tradingData) {
    if (!tradingData || tradingData.length === 0) {
        return [];  // Return an empty array if no data
    }

    // Assuming tradingData is an array of objects where each object represents a trade
    let df = tradingData.map(trade => ({
        timestamp: new Date(trade.timestamp),
        p: Number(trade.P),  // Price change percentage
        v: Number(trade.v),  // Volume
        c: Number(trade.c),  // Current price
        b: Number(trade.b),  // Best bid price
        a: Number(trade.a),  // Best ask price
        o: Number(trade.o),  // Open price
        n: Number(trade.n),  // Number of trades
        q: Number(trade.q),  // Quote asset volume
        s: trade.s           // Symbol
    }));

    // Filter to include only USDT-based pairs
    df = df.filter(row => row.s.endsWith('USDT'));

    df.forEach(row => {
        row.direction = row.c > row.o ? 'up' : 'down';
        row.bidAskSpread = row.a - row.b;
    });

    // Group by symbol and calculate aggregates
    let grouped = {};
    df.forEach(row => {
        if (!grouped[row.s]) {
            grouped[row.s] = {
                s: row.s,
                p: row.p,
                v: row.v,
                c: row.c,
                b: row.b,
                a: row.a,
                n: row.n,
                direction: row.direction,
                bidAskSpread: row.bidAskSpread,
                q: row.q
            };
        } else {
            grouped[row.s].p = row.p;
            grouped[row.s].v += row.v;
            grouped[row.s].c = row.c;
            grouped[row.s].b = row.b;
            grouped[row.s].a = row.a;
            grouped[row.s].n += row.n;
            grouped[row.s].direction = row.direction;
            grouped[row.s].bidAskSpread += row.bidAskSpread;
            grouped[row.s].q += row.q;
        }
    });

    // Convert to array and calculate averages
    grouped = Object.values(grouped);
    grouped.forEach(row => {
        row.bidAskSpread /= df.length;
    });

    // Calculate normalization factors
    let maxPriceChange = Math.max(...grouped.map(row => Math.abs(row.p)));
    let maxVolume = Math.max(...grouped.map(row => row.v));
    let maxTradeCount = Math.max(...grouped.map(row => row.n));
    let maxBidAskSpread = Math.max(...grouped.map(row => row.bidAskSpread));

    let normalizationFactor = maxPriceChange + maxVolume + maxTradeCount + maxBidAskSpread;

    // Calculate volatility score
    grouped.forEach(row => {
        row.volatilityScore = (Math.abs(row.p) + row.v + row.n + row.bidAskSpread) / normalizationFactor;
    });

    grouped.forEach(row => {
        row.volatility = Math.abs(row.p);  // Absolute price change percentage
        row.formattedVolume = formatVolume(row.v);
        row.formattedQuoteVolume = formatVolume(row.q);
        row.c = row.c.toFixed(8);
        row.b = row.b.toFixed(8);
        row.a = row.a.toFixed(8);
    });

    // Filter tokens by volatility threshold
    grouped = grouped.filter(row => row.volatility > VOLATILITY_THRESHOLD);

    // Sort by volatility score and get the top 10 most volatile tokens
    grouped.sort((a, b) => b.volatilityScore - a.volatilityScore);
    grouped = grouped.slice(0, 10);
    grouped = grouped.map(row => ({
        'Symbol': row.s,
        'Price Change (%)': row.p,
        'Base Volume': row.v,
        'Current Price': row.c,
        'Best Bid': row.b,
        'Best Ask': row.a,
        'Direction': row.direction,
        'Number of Trades': row.n,
        'Bid-Ask Spread': row.bidAskSpread,
        'Quote Volume': row.q,
        'Formatted Base Volume': row.formattedVolume,
        'Formatted Quote Volume': row.formattedQuoteVolume,
        'Volatility Score': row.volatilityScore
    }));
    

    // console.log(`Calculated volatility: ${JSON.stringify(grouped, null, 2)}`);
    return grouped;
}

export default calculateVolatility;