import zmq.asyncio

class ZMQReceiver:
  def __init__(self, uri: str):
    self.uri = uri
    self.context = zmq.asyncio.Context()
    self.socket = self.context.socket(zmq.PULL)

  async def listen(self):
    """
    Start listening for incoming messages.
    """
    self.socket.connect(self.uri)
    print(f"ZMQ listening on {self.uri}")

    while True:
      msg = await self.socket.recv_string()
      yield msg
