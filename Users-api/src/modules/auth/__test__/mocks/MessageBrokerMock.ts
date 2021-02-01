import IMessageBroker from '@shared/container/providers/messageBrokerProvider/models/IMessageBrocker';

interface Message {
  exchange: string;
  message: string;
  routingKey: string;
}

class MessageBrokerMock implements IMessageBroker {
  messages: Message[] = [];

  async publish(
    exchange: string,
    message: string,
    routingKey = '*'
  ): Promise<boolean> {
    this.messages.push({
      exchange,
      message,
      routingKey,
    });
    return true;
  }

  // consume(_: string, callBack: (msg: { content: string }) => void): void {
  //   const msg = this.messages.pop();
  //   if (!msg) return;

  //   const messageObject = {
  //     content: `${msg?.toString()}`,
  //   };
  //   callBack(messageObject);
  // }
}

export default MessageBrokerMock;
