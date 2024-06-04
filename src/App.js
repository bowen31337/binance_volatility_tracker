import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "./App.css";
import calculateVolatility from "./volatility_caculator";
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

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // const ws = new WebSocket("ws://localhost:6789");
    const ws = new WebSocket("wss://stream.binance.com:9443/ws/!ticker@arr");

    ws.onopen = () => {
      console.log("WebSocket Client Connected");
    };

    ws.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      setData(calculateVolatility(dataFromServer));
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

  return (
    <div className="App">
      <h1>Top 10 Most Volatile Tokens</h1>
      <TableContainer>
        <Table>
          <Thead>
            <tr>
              <Th>Symbol</Th>
              <Th>Price Change (%)</Th>
              <Th>Current Price</Th>
              {/* <Th>Best Bid</Th>
              <Th>Best Ask</Th> */}
              <Th>Direction</Th>
              {/* <Th>Number of Trades</Th>
              <Th>Bid-Ask Spread</Th> */}
              <Th>Base Volume</Th>
              <Th>Quote Volume</Th>
              <Th>Volatility Score</Th>
            </tr>
          </Thead>
          <tbody>
            {data.map((item, index) => (
              <Tr key={index}>
                <Td>{item.Symbol}</Td>
                <Td>{item["Price Change (%)"]}</Td>
                <Td>{item["Current Price"]}</Td>
                {/* <Td>{item["Best Bid"]}</Td>
                <Td>{item["Best Ask"]}</Td> */}
                <Td>
                  {item.Direction === "up" ? (
                    <GreenText>{item.Direction}</GreenText>
                  ) : (
                    <RedText>{item.Direction}</RedText>
                  )}
                </Td>
                {/* <Td>{item["Number of Trades"]}</Td>
                <Td>{item["Bid-Ask Spread"]}</Td> */}
                <Td>{item["Formatted Base Volume"]}</Td>
                <Td>{item["Formatted Quote Volume"]}</Td>
                <Td>{item["Volatility Score"]}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default App;
