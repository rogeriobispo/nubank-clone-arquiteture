import StoreMessage from '../../services/storeMessage';
import HistoryLogRepositoryMock from '../mock/HistoryLogRepositoryMock';
import MessageBrokerMock from '../mock/MessageBrokerMock';
import { RabbitMQQueue } from '../../../../shared/config';

let storeMessage: StoreMessage;
let messageBrokerMock: MessageBrokerMock;
let historyLogRepositoryMock: HistoryLogRepositoryMock;

describe('storeMessage', () => {
  beforeEach(() => {
    messageBrokerMock = new MessageBrokerMock();
    historyLogRepositoryMock = new HistoryLogRepositoryMock();
    storeMessage = new StoreMessage(
      messageBrokerMock,
      historyLogRepositoryMock
    );
  });
  describe('perform', () => {
    it('should return an function', () => {
      const returnFunction = storeMessage.perform(
        RabbitMQQueue.historyLogQueue
      );
      expect(returnFunction).toBeInstanceOf(Function);
    });

    it('should read message from message broker', () => {
      const brokerSpy = jest.spyOn(messageBrokerMock, 'consume');
      const consumeFunction = storeMessage.perform(
        RabbitMQQueue.historyLogQueue
      );

      consumeFunction();
      expect(brokerSpy).toHaveBeenCalledTimes(1);
      expect(brokerSpy).toHaveBeenCalledWith(RabbitMQQueue.historyLogQueue);
    });

    it('should save message on database', async () => {
      const repositorySpy = jest.spyOn(historyLogRepositoryMock, 'create');
      const consumeFunction = storeMessage.perform(
        RabbitMQQueue.historyLogQueue
      );

      await consumeFunction();
      expect(repositorySpy).toHaveBeenCalledTimes(11);
      expect(repositorySpy).lastCalledWith({
        userId: '110',
        eventName: 'USER_API_USER_BLOCKED',
        message: '11 message',
      });
    });

    it('should return empty message array when queue does not exist', async () => {
      const repositorySpy = jest.spyOn(historyLogRepositoryMock, 'create');
      const consumeFunction = storeMessage.perform('any queue');

      await consumeFunction();
      expect(repositorySpy).toHaveBeenCalledTimes(0);
    });
  });
});
