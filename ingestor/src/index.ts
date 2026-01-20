import * as zmq from "zeromq";
import { connectBinance, connectKraken } from "./services/exchanges.js";

async function main() {
  const sock = new zmq.Push();

  const ZMQ_PORT = process.env.ZMQ_PORT || "5555";
  await sock.bind(`tcp://0.0.0.0:${ZMQ_PORT}`);
  console.log(`[ZMQ] 🚀 Socket PUSH ready on port ${ZMQ_PORT}`);

  const queue: string[] = [];
  let isProcessing = false;

  async function processQueue() {
    if (isProcessing || queue.length === 0) return;
    isProcessing = true;

    while (queue.length > 0) {
      const msg = queue.shift();
      if (msg) {
        try {
          await sock.send(msg);
        } catch (err) {
          console.error("[ZMQ] Error sending data:", err);
        }
      }
    }
    isProcessing = false;
  }

  const onDataReceived = async (data: any) => {
    try {
      queue.push(JSON.stringify(data));
      processQueue();
    } catch (err) {
      console.error("[ZMQ] Error sending data:", err);
    }
  };

  console.log("[SYSTEM] Starting market data ingestion...");

  connectBinance(onDataReceived);
  connectKraken(onDataReceived);

  process.on("SIGINT", () => {
    console.log("[SYSTEM] Closing connections...");
    sock.close();
    process.exit();
  });
}

main().catch(console.error);
