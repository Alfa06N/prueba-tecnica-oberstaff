import WebSocket from "ws";
import { MarketData } from "../types";

/**
 * Connect to the Binance WebSocket API.
 * @param callback Function to call with market data
 */

export function connectBinance(callback: (data: MarketData) => void) {
  const ws = new WebSocket(
    "wss://stream.binance.com:9443/ws/btcusdt@bookTicker",
  );

  ws.on("message", (data) => {
    const raw = JSON.parse(data.toString());
    callback({
      exchange: "binance",
      pair: "BTCUSDT",
      price: parseFloat(raw.a),
      side: "ask",
      timestamp: Date.now(),
    });
  });

  ws.on("close", () => {
    console.log("⚠️ Binance closed. Reconnecting in 3s...");
    setTimeout(() => connectBinance(callback), 3000);
  });

  ws.on("error", (err) => console.error("Binance error:", err.message));
}

/**
 * Connect to the Kraken WebSocket API.
 * @param callback Function to call with market data
 */
export function connectKraken(callback: (data: MarketData) => void) {
  const ws = new WebSocket("wss://ws.kraken.com/");

  ws.on("open", () => {
    ws.send(
      JSON.stringify({
        event: "subscribe",
        pair: ["BTC/USD"],
        subscription: {
          name: "ticker",
        },
      }),
    );
  });

  ws.on("message", (data) => {
    const raw = JSON.parse(data.toString());

    if (Array.isArray(raw) && raw[1]?.a) {
      callback({
        exchange: "kraken",
        pair: "BTCUSDT",
        price: parseFloat(raw[1].a[0]),
        side: "ask",
        timestamp: Date.now(),
      });
    }
  });

  ws.on("close", () => {
    console.log("Kraken closed. Reconnecting in 3s...");
    setTimeout(() => connectKraken(callback), 3000);
  });

  ws.on("error", (err) => console.error("Kraken error:", err.message));
}
