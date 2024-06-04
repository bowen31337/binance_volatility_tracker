# Binance Volatility Tracker

This project tracks the volatility of various cryptocurrency token pairs traded on the Binance exchange. The data is processed to identify the most volatile token pairs based on a custom volatility score.

## Data Fields from Binance API

The following fields are provided by the Binance WebSocket API for each trading pair:

- **e**: Event type (e.g., `24hrTicker`).
- **E**: Event time (timestamp).
- **s**: Symbol of the trading pair (e.g., BTCUSDT, ETHBTC).
- **p**: Price change over the last 24 hours.
- **P**: Price change percentage over the last 24 hours.
- **w**: Weighted average price over the last 24 hours.
- **x**: Previous day's closing price.
- **c**: Current day's closing price (most recent trade).
- **Q**: Current day's close quantity.
- **b**: Best bid price.
- **B**: Best bid quantity.
- **a**: Best ask price.
- **A**: Best ask quantity.
- **o**: Opening price of the current day.
- **h**: Highest price of the current day.
- **l**: Lowest price of the current day.
- **v**: Total traded base asset volume over the last 24 hours.
- **q**: Total traded quote asset volume over the last 24 hours.
- **O**: Statistics open time (timestamp).
- **C**: Statistics close time (timestamp).
- **F**: First trade ID.
- **L**: Last trade ID.
- **n**: Total number of trades over the last 24 hours.

## Data Fields Used in Volatility Calculation

The data fields used in this project are as follows:

- **Symbol (`s`)**: The trading pair symbol (e.g., BTCUSDT, ETHBTC).
- **Price Change Percentage (`P`)**: The percentage change in the price of the trading pair over the last 24 hours.
- **Volume (`v`)**: The total volume of the trading pair traded over the last 24 hours.
- **Current Price (`c`)**: The current price of the trading pair.
- **Best Bid Price (`b`)**: The highest price a buyer is willing to pay for the trading pair.
- **Best Ask Price (`a`)**: The lowest price a seller is willing to accept for the trading pair.
- **Open Price (`o`)**: The opening price of the trading pair for the current trading day.
- **Number of Trades (`n`)**: The total number of trades executed for the trading pair over the last 24 hours.
- **Timestamp (`timestamp`)**: The timestamp when the data was received.
- **Direction (`direction`)**: The direction of the price movement (either 'up' or 'down').
- **Bid-Ask Spread (`bid_ask_spread`)**: The difference between the best ask price and the best bid price.

## Volatility Calculation Strategy

The volatility score is calculated to identify the most volatile token pairs based on several metrics. The steps involved in the calculation are as follows:

1. **Filter Data**: Exclude token pairs that are based on USDT (i.e., symbols ending with 'USDT').

2. **Aggregate Data**: Group the data by the trading pair symbol and calculate the following aggregated metrics:
    - Last price change percentage (`p`).
    - Sum of volumes (`v`).
    - Last current price (`c`).
    - Last best bid price (`b`).
    - Last best ask price (`a`).
    - Sum of trade counts (`n`).
    - Last direction of price movement (`direction`).
    - Mean bid-ask spread (`bid_ask_spread`).

3. **Calculate Normalization Factors**: Determine the maximum values for price change percentage, volume, trade count, and bid-ask spread. These values are used to normalize the metrics.

4. **Calculate Volatility Score**: The volatility score for each trading pair is calculated using the formula:
    ```
    volatility_score = (abs(price_change_percentage) + volume + trade_count + bid_ask_spread) / normalization_factor
    ```
   Where `normalization_factor` is the sum of the maximum values of the metrics.

5. **Format Volume**: Format the volume to a human-readable format (e.g., 1.2k USD, 3.4M USD).

6. **Filter and Sort Data**: Filter out token pairs with a volatility score below a predefined threshold and sort the remaining pairs by their volatility score in descending order.

7. **Select Top 10**: Select the top 10 most volatile token pairs based on the calculated volatility score.