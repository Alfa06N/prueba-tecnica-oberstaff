# Crypto Arbitrage Sniper (HFT) 🚀

A high-frequency trading (HFT) engine designed to detect real-time arbitrage opportunities between **Binance** and **Kraken** using a microservices architecture.

## System Architecture

The system is built with a focus on low latency, scalability, and asynchronous data processing:

1.  **Ingestor (Node.js + TypeScript):** Connects to exchange WebSockets. It implements an asynchronous queue to handle "backpressure" and prevent socket saturation during high-volatility periods.
2.  **Transport Layer (ZeroMQ):** An ultra-fast, brokerless messaging protocol used for Inter-Process Communication (IPC) between Node.js and Python.
3.  **Engine (Python 3.11 + uvloop):** The core calculation unit. Optimized with `uvloop` (a fast C-based drop-in replacement for the asyncio event loop) to process market spreads in microseconds.
4.  **Data Layer (Redis):** Uses Pub/Sub patterns for real-time messaging and history persistence.
5.  **Dashboard (Node.js + Socket.io):** A reactive web interface that visualizes opportunities the moment they are detected.

## Quick Start

Ensure you have Docker and Docker Compose installed.

```bash
# Clone the repository
git clone <your-repo-url>
cd arbitrage-sniper

# Launch the entire ecosystem
sudo docker compose up --build
```

Access the live dashboard at: http://localhost:3000

## Logic & Thresholds

- **Current Threshold**: 0.1%.

- **Validation**: The engine implements safety guards to ensure data consistency, only calculating spreads when synchronized prices from both exchanges are available.

- **Heartbeat**: The engine logs a heartbeat every 500-1000 messages to confirm system health during low-volatility periods.

## Future Scalability

- **Order Book Depth**: Transition from "Last Price" analysis to full L2 Order Book depth for slippage-adjusted calculations.

- **Auto-Execution**: Integration with exchange REST APIs for automated trade execution.

- **Multi-Asset Support**: Horizontal scaling to monitor multiple trading pairs simultaneously.

## 🛠️ Troubleshooting & Notes

If you encounter issues while running the project, please check the following:

### 1. Docker Permissions

If you get a permission denied error, ensure you are running the commands with `sudo` or that your user is in the `docker` group.

```bash
sudo docker compose up --build
```

### 2 Connection to Exchanges

The Ingestor service requires an active internet connection to reach Binance and Kraken WebSockets. If you see connection errors in the logs, verify your firewall or proxy settings.

### 3.Ports Availability

This project uses the following ports. Make sure they are not being used by other services:

- **3000**: Dashboard Web UI

- **6379**: Redis

- **5555**: ZeroMQ (Internal)