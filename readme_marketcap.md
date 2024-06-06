
# Crypto Market Cap Application

## Overview

This application provides real-time data on the top 10 most volatile tokens and the top 100 market cap tokens from Binance. It uses the Binance WebSocket API to fetch live trading data, calculates volatility and market cap metrics, and displays the information in a sortable, responsive table.

## Features

- **Real-time Data**: Fetches live trading data from Binance using WebSocket.
- **Volatility and Market Cap Metrics**: Calculates and displays metrics such as price change percentage, current price, base volume, quote volume, market cap, volume/price ratio, and volatility score.
- **Sortable Columns**: Allows sorting of the table columns by clicking on the headers.
- **Responsive Design**: Ensures the table is responsive and mobile-friendly.

## Data Fields

### Volatility Table

- **Symbol**: The trading pair symbol (e.g., BTCUSDT).
- **Price Change (%)**: The percentage change in price over a certain period.
- **Current Price**: The latest trading price.
- **Direction**: Indicates whether the price is moving up or down.
- **Base Volume**: The total traded base asset volume.
- **Quote Volume**: The total traded quote asset volume.
- **Volatility Score**: A calculated score representing the volatility of the token.

### Market Cap Table

- **Symbol**: The trading pair symbol (e.g., BTCUSDT).
- **Price Change (%)**: The percentage change in price over a certain period.
- **Current Price**: The latest trading price.
- **Direction**: Indicates whether the price is moving up or down.
- **Base Volume**: The total traded base asset volume.
- **Quote Volume**: The total traded quote asset volume.
- **Volume/Price Ratio**: The ratio of base volume to current price.
- **Market Cap**: The market capitalization, calculated as the current price multiplied by the base volume.
- **Volatility Score**: A calculated score representing the volatility of the token.

## Sorting Functionality

- **Interactive Sorting**: Click on the column headers to sort the table by that column. The sorting direction toggles between ascending and descending with each click.
- **Sorting Indicators**: The headers display an arrow (▲ or ▼) indicating the current sorting direction for that column.

## How to Run the Application

1. **Start the WebSocket Server**:
   Ensure you have a WebSocket server running. If using a Python WebSocket server, you can start it with the following command:
   ```bash
   python websocket_server.py
   ```

2. **Start the React App**:
   In the root directory of your React application, run:
   ```bash
   npm start
   ```

## How to Use the Application

1. Open the application in your web browser.
2. Select the tab for "Top 10 Volatile Tokens" or "Top 100 Market Cap Tokens".
3. Click on any column header to sort the table by that column. The table will update to show the sorted data.
4. Monitor real-time updates as the table refreshes with the latest data from Binance.

## Dependencies

- **React**: For building the user interface.
- **Styled-components**: For styling the components.
- **Binance WebSocket API**: For fetching live trading data.

## Code Structure

- **App.js**: Main React component that handles WebSocket connections, data fetching, and rendering the table.
- **volatility_calculator.js**: Utility function for calculating volatility metrics.
- **marketcap_calculator.js**: Utility function for calculating market cap metrics.
- **App.css**: CSS file for styling the application, including sorting indicators.

## Contact

For any questions or issues, please contact [Your Name] at [your-email@example.com].
