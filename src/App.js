import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "./App.css";
import calculateVolatility from "./volatility_calculator";
import calculateMarketCap from "./marketcap_calculator";

const TableContainer = styled.div`
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  margin: 20px auto;
  border-collapse: collapse;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: 100%;
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
`;

const Thead = styled.thead`
  background-color: #f8f8f8;
`;

const Th = styled.th`
  padding: 15px;
  text-align: left;
  font-weight: bold;
  color: #333;
  border-bottom: 2px solid #ddd;
  width: 150px;
  cursor: pointer;

  &.asc::after {
    content: " ▲";
  }

  &.desc::after {
    content: " ▼";
  }
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }

  &:hover {
    background-color: #e9e9e9;
  }
`;

const Td = styled.td`
  padding: 15px;
  text-align: left;
  color: #555;
  border-bottom: 1px solid #ddd;
  width: 150px;
`;

const GreenText = styled.span`
  color: #4caf50;
`;

const RedText = styled.span`
  color: #f44336;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px;
`;

const TabButton = styled.button`
  background-color: ${(props) => (props.active ? "#4caf50" : "#f1f1f1")};
  color: ${(props) => (props.active ? "#fff" : "#000")};
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  margin: 0 5px;

  &:hover {
    background-color: ${(props) => (props.active ? "#45a049" : "#ddd")};
  }
`;

function App() {
  const [data, setData] = useState([]);
  const [marketCapData, setMarketCapData] = useState([]);
  const [currentTab, setCurrentTab] = useState("volatility");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  useEffect(() => {
    const ws = new WebSocket("wss://stream.binance.com:9443/ws/!ticker@arr");

    ws.onopen = () => {
      console.log("WebSocket Client Connected");
    };

    ws.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      const calculatedVolatilityData = calculateVolatility(dataFromServer);
      const calculatedMarketCapData = calculateMarketCap(dataFromServer);
      setData(calculatedVolatilityData);
      setMarketCapData(calculatedMarketCapData);
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    ws.onclose = (event) => {
      console.log("WebSocket Closed:", event);
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const sortedMarketCapData = [...marketCapData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  return (
    <div className="App">
      <h1>Crypto Market Data</h1>
      <TabContainer>
        <TabButton
          active={currentTab === "volatility"}
          onClick={() => setCurrentTab("volatility")}
        >
          Top 10 Volatile Tokens
        </TabButton>
        <TabButton
          active={currentTab === "marketCap"}
          onClick={() => setCurrentTab("marketCap")}
        >
          Top 100 Market Cap Tokens
        </TabButton>
      </TabContainer>
      {currentTab === "volatility" && (
        <TableContainer>
          <Table>
            <Thead>
              <tr>
                <Th
                  className={
                    sortConfig.key === "symbol" ? sortConfig.direction : ""
                  }
                  onClick={() => handleSort("symbol")}
                >
                  Symbol
                </Th>
                <Th
                  className={
                    sortConfig.key === "priceChangePercentage"
                      ? sortConfig.direction
                      : ""
                  }
                  onClick={() => handleSort("priceChangePercentage")}
                >
                  Price Change (%)
                </Th>
                <Th
                  className={
                    sortConfig.key === "currentPrice"
                      ? sortConfig.direction
                      : ""
                  }
                  onClick={() => handleSort("currentPrice")}
                >
                  Current Price
                </Th>
                <Th
                  className={
                    sortConfig.key === "direction" ? sortConfig.direction : ""
                  }
                  onClick={() => handleSort("direction")}
                >
                  Direction
                </Th>
                <Th
                  className={
                    sortConfig.key === "formattedBaseVolume"
                      ? sortConfig.direction
                      : ""
                  }
                  onClick={() => handleSort("formattedBaseVolume")}
                >
                  Base Volume
                </Th>
                <Th
                  className={
                    sortConfig.key === "formattedQuoteVolume"
                      ? sortConfig.direction
                      : ""
                  }
                  onClick={() => handleSort("formattedQuoteVolume")}
                >
                  Quote Volume
                </Th>
                <Th
                  className={
                    sortConfig.key === "volatilityScore"
                      ? sortConfig.direction
                      : ""
                  }
                  onClick={() => handleSort("volatilityScore")}
                >
                  Volatility Score
                </Th>
              </tr>
            </Thead>
            <tbody>
              {sortedData.map((item, index) => (
                <Tr key={index}>
                  <Td>{item.symbol}</Td>
                  <Td>{item.priceChangePercentage}</Td>
                  <Td>{item.currentPrice}</Td>
                  <Td>
                    {item.direction === "up" ? (
                      <GreenText>{item.direction}</GreenText>
                    ) : (
                      <RedText>{item.direction}</RedText>
                    )}
                  </Td>
                  <Td>{item.formattedBaseVolume}</Td>
                  <Td>{item.formattedQuoteVolume}</Td>
                  <Td>{item.volatilityScore}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      )}
      {currentTab === "marketCap" && (
        <TableContainer>
          <Table>
            <Thead>
              <tr>
                <Th
                  className={
                    sortConfig.key === "symbol" ? sortConfig.direction : ""
                  }
                  onClick={() => handleSort("symbol")}
                >
                  Symbol
                </Th>
                <Th
                  className={
                    sortConfig.key === "priceChangePercentage"
                      ? sortConfig.direction
                      : ""
                  }
                  onClick={() => handleSort("priceChangePercentage")}
                >
                  Price Change (%)
                </Th>
                <Th
                  className={
                    sortConfig.key === "currentPrice"
                      ? sortConfig.direction
                      : ""
                  }
                  onClick={() => handleSort("currentPrice")}
                >
                  Current Price
                </Th>
                <Th
                  className={
                    sortConfig.key === "direction" ? sortConfig.direction : ""
                  }
                  onClick={() => handleSort("direction")}
                >
                  Direction
                </Th>
                <Th
                  className={
                    sortConfig.key === "formattedBaseVolume"
                      ? sortConfig.direction
                      : ""
                  }
                  onClick={() => handleSort("formattedBaseVolume")}
                >
                  Base Volume
                </Th>
                <Th
                  className={
                    sortConfig.key === "formattedQuoteVolume"
                      ? sortConfig.direction
                      : ""
                  }
                  onClick={() => handleSort("formattedQuoteVolume")}
                >
                  Quote Volume
                </Th>
                <Th
                  className={
                    sortConfig.key === "volumePriceRatio"
                      ? sortConfig.direction
                      : ""
                  }
                  onClick={() => handleSort("volumePriceRatio")}
                >
                  Volume/Price Ratio
                </Th>
                <Th
                  className={
                    sortConfig.key === "marketCap" ? sortConfig.direction : ""
                  }
                  onClick={() => handleSort("marketCap")}
                >
                  Market Cap
                </Th>
                <Th
                  className={
                    sortConfig.key === "volatilityScore"
                      ? sortConfig.direction
                      : ""
                  }
                  onClick={() => handleSort("volatilityScore")}
                >
                  Volatility Score
                </Th>
              </tr>
            </Thead>
            <tbody>
              {sortedMarketCapData.map((item, index) => (
                <Tr key={index}>
                  <Td>{item.symbol}</Td>
                  <Td>{item.priceChangePercentage}</Td>
                  <Td>{item.currentPrice}</Td>
                  <Td>
                    {item.direction === "up" ? (
                      <GreenText>{item.direction}</GreenText>
                    ) : (
                      <RedText>{item.direction}</RedText>
                    )}
                  </Td>
                  <Td>{item.formattedBaseVolume}</Td>
                  <Td>{item.formattedQuoteVolume}</Td>
                  <Td>{item.volumePriceRatio}</Td>
                  <Td>{item.marketCap}</Td>
                  <Td>{item.volatilityScore}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}

export default App;
