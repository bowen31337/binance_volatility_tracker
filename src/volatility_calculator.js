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
    return volume.toFixed(2);
  }
}

export default function calculateVolatility(tradingData) {
  if (!tradingData || tradingData.length === 0) {
    return [];
  }

  const filteredData = tradingData.filter((data) => data.s.endsWith("USDT"));

  const df = filteredData.map((data) => ({
    symbol: data.s,
    priceChangePercentage: parseFloat(data.P),
    baseVolume: parseFloat(data.v),
    currentPrice: parseFloat(data.c),
    bestBid: parseFloat(data.b),
    bestAsk: parseFloat(data.a),
    openPrice: parseFloat(data.o),
    numberOfTrades: parseInt(data.n),
    quoteVolume: parseFloat(data.q),
    direction: parseFloat(data.c) > parseFloat(data.o) ? "up" : "down",
    bidAskSpread: parseFloat(data.a) - parseFloat(data.b),
  }));

  const maxPriceChange = Math.max(
    ...df.map((row) => Math.abs(row.priceChangePercentage))
  );
  const maxVolume = Math.max(...df.map((row) => row.baseVolume));
  const maxTradeCount = Math.max(...df.map((row) => row.numberOfTrades));
  const maxBidAskSpread = Math.max(...df.map((row) => row.bidAskSpread));

  const normalizationFactor =
    maxPriceChange + maxVolume + maxTradeCount + maxBidAskSpread;

  const result = df.map((row) => ({
    symbol: row.symbol,
    priceChangePercentage: row.priceChangePercentage,
    currentPrice: row.currentPrice.toFixed(8),
    bestBid: row.bestBid.toFixed(8),
    bestAsk: row.bestAsk.toFixed(8),
    direction: row.direction,
    numberOfTrades: row.numberOfTrades,
    bidAskSpread: row.bidAskSpread.toFixed(2),
    formattedBaseVolume: formatVolume(row.baseVolume),
    formattedQuoteVolume: formatVolume(row.quoteVolume),
    volatilityScore: (
      (Math.abs(row.priceChangePercentage) +
        row.baseVolume +
        row.numberOfTrades +
        row.bidAskSpread) /
      normalizationFactor
    ).toFixed(5),
  }));

  return result
    .sort((a, b) => b.volatilityScore - a.volatilityScore)
    .slice(0, 10);
}
