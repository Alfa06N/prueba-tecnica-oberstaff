/**
 * Normalize market data from different exchanges.
 */
export interface MarketData {
  exchange: string;
  pair: string;
  price: number;
  timestamp: number;
  side: "bid" | "ask";
}
