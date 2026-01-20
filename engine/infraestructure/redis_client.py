import redis.asyncio as redis
import json
import os

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = os.getenv("REDIS_PORT", 6379)

class RedisNotifier:
  def __init__(self, host=REDIS_HOST, port=REDIS_PORT):
    self.client = redis.Redis(host=host, port=port, decode_responses=True)
    self.channel = "arbitrage_events"

  async def publish_opportunity(self, data: dict):
    """
    Publish arbitrage opportunity to Redis channel.
    @param data: The data to publish
    """
    await self.client.lpush("history", json.dumps(data))
    await self.client.ltrim("history", 0, 99)

    await self.client.publish(self.channel, json.dumps(data))