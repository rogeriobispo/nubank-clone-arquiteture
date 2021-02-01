interface IMessageBroker {
  publish(
    exchange: string,
    message: string,
    routingKey?: string
  ): Promise<boolean>;
  // consume(queue: string, callBack: (msg: any) => void): void;
}

export default IMessageBroker;
