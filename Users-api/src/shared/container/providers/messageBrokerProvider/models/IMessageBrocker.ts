interface IMessageBroker {
  publish(
    exchange: string,
    message: string,
    routingKey?: string
  ): Promise<boolean>;
}

export default IMessageBroker;
