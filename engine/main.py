import asyncio 
import uvloop
import json
from core.arbitrage import ArbitrageEngine
from infraestructure.zmq_client import ZMQReceiver
from infraestructure.redis_client import RedisNotifier
import os

asyncio.set_event_loop_policy(uvloop.EventLoopPolicy())

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = os.getenv("REDIS_PORT", 6379)
ZMQ_URI = os.getenv("ZMQ_URI", "tcp://ingestor:5555")

async def start_engine():
  arb_engine = ArbitrageEngine(threshold=0.1)
  zmq_receiver = ZMQReceiver(uri=ZMQ_URI)
  redis_service = RedisNotifier(host=REDIS_HOST, port=REDIS_PORT)

  message_count = 0
  print("[ENGINE] Arbitrage engine started...")

  async for raw_msg in zmq_receiver.listen():
    try:
      message_count += 1
      
      data = json.loads(raw_msg)
      result = arb_engine.update_price(data["exchange"], data["price"])

      if message_count % 100 == 0:
        print(f"Processed {message_count} messages. Looking for arbitrage opportunities > {arb_engine.threshold}%")

      if result and result.get("is_opportunity"):
        print(f"SPREAD: {result['spread']}% | {result['direction']}")
        await redis_service.publish_opportunity(result)

    except Exception as e:
      print(f"Error processing message: {e}")

if __name__ == "__main__":
  try: 
    asyncio.run(start_engine())
  except KeyboardInterrupt:
    print("\nArbitrage engine stopped.")