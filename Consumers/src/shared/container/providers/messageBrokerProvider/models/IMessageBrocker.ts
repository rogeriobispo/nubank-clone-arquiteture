export interface IMessageObj {
  userId: string;
  eventName: string;
  message: string;
}

interface IMessageBroker {
  consume(queue: string): Promise<IMessageObj[]>;
}

export default IMessageBroker;
