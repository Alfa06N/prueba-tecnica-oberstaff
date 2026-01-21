# Crypto Arbitrage Sniper (HFT) 🚀

A high-frequency trading (HFT) engine designed to detect real-time arbitrage opportunities between **Binance** and **Kraken** using a microservices architecture.

## System Architecture

The system is built with a focus on low latency, scalability, and asynchronous data processing:

1.  **Ingestor (Node.js + TypeScript)** 

- **WebSocket Management:** Implements a robust Heartbeat & Auto-reconnect logic. If a connection to Binance or Kraken drops, the ingestor triggers an exponential backoff strategy to restore the stream without manual intervention.
- **Asynchronous Processing:** Uses a non-blocking queue to handle "backpressure," ensuring that bursts of market volatility don't saturate the event loop.

2.  **Transport Layer (ZeroMQ):** 

- **Brokerless Communication:** Utilizes a PUSH/PULL pattern via ZeroMQ for Inter-Process Communication (IPC). This removes the overhead of a message broker, allowing Node.js to stream raw market data to Python at near-memory speeds.

3.  **Engine (Python 3.11 + uvloop):** 

- **Event Loop Optimization:** Powered by uvloop, increasing asyncio performance by up to 4x.

- **Arbitrage Logic:** The engine calculates triangular or cross-exchange spreads in microseconds.

- **Thresholding:** Currently set at a 0.1% test threshold. In production environments, this is adjustable (typically >0.5%) to account for exchange fees and slippage.

4.  **Data Layer (Redis):** 

- **Pub/Sub Pattern:** Acts as the central nervous system. The Python engine publishes valid opportunities to a Redis channel, which the Dashboard microservice subscribes to instantly.

5.  **Dashboard (Express + Socket.io):** 

- **Full-Duplex Communication:** Uses WebSockets (Socket.io) to push data to the client. The frontend remains idle (displaying a "Scanning..." state) until an event is received, ensuring zero wasted resources.

- **Visual Feedback:** The interface provides real-time connection status. If the backend microservices disconnect, the UI reflects this state immediately, adhering to fail-fast design principles.

## Quick Start

Ensure you have Docker and Docker Compose installed.

```bash
# Clone the repository
git clone https://github.com/Alfa06N/prueba-tecnica-oberstaff.git

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

- **6380**: Redis

- **5555**: ZeroMQ (Internal)