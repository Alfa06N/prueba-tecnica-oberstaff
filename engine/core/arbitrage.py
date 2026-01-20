class ArbitrageEngine:
  def __init__(self, threshold: float):
    self.prices = {"binance": None, "kraken": None}
    self.threshold = threshold

  def update_price(self, exchange: str, price: float):
    """
    Update the price for a specific exchange.
    @param exchange: Name of the exchange ("binance" or "kraken")
    @param price: The price to update
    @return: Dict containing trade direction and spread if opportunity exists, else False
    """
    self.prices[exchange] = price

    if self.prices.get("binance") is None or self.prices.get("kraken") is None:
      return {"is_opportunity": False}

    return self.check_opportunity()

  def check_opportunity(self):
    """
    Core logic for arbitrage detection.
    Calculates percentage spread between Binance and Kraken using the mid-price formula.
    @return: Dict containing trade direction and spread if opportunity exists, else False
    """
    b = self.prices["binance"]
    k = self.prices["kraken"]
    
    if b is not None and k is not None:
      diff = abs(b - k)
      mid_price = (b + k) / 2
      spread_pct = (diff / mid_price) * 100

      if spread_pct > self.threshold:
        return {
          "is_opportunity": True,
          "spread": round(spread_pct, 4),
          "binance": b,
          "kraken": k,
          "direction": "BUY BINANCE -> SELL KRAKEN" if b < k else "BUY KRAKEN -> SELL BINANCE"
        }

    return {"is_opportunity": False}