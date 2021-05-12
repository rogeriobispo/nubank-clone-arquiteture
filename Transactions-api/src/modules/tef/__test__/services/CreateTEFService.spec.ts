import 'reflect-metadata';
import CreateTefService from '../../services/CreateTefService';
import TefRepositoryMock from '../mocks/TefRepositoryMock';
import MessageBrokerMock from '../mocks/MessageBrokerMock';
import {
  currentUser,
  originAccount,
  destinyAccount,
} from '../../../../__mocks__/axios';

let createTefService: CreateTefService;
let tefRepositoryMock: TefRepositoryMock;
let messageBrokerMock: MessageBrokerMock;

describe('CreateTefService', () => {
  beforeEach(() => {
    tefRepositoryMock = new TefRepositoryMock();
    messageBrokerMock = new MessageBrokerMock();
    createTefService = new CreateTefService(
      tefRepositoryMock,
      messageBrokerMock
    );
  });

  it('should create a transaction tef to be processed', async () => {
    const brokerSpy = jest.spyOn(messageBrokerMock, 'publish');

    const transferObj = {
      originAccount,
      destinyAccount,
      amount: 100,
    };

    const transactions = await createTefService.perform(
      transferObj,
      currentUser
    );

    const expectedTransactionDebit = {
      id: transactions.debit.id,
      originAccount,
      destinyAccount,
      kind: 'tef',
      userId: currentUser.id,
      accountDestinydetail: JSON.stringify({}),
      status: 'pending',
      type: 'D',
      amount: 100,
    };

    const expectedTransactionCredit = {
      id: transactions.credit.id,
      originAccount,
      destinyAccount,
      kind: 'tef',
      userId: currentUser.id,
      accountDestinydetail: JSON.stringify({}),
      status: 'pending',
      type: 'C',
      amount: 100,
    };

    expect(transactions.debit).toEqual(expectedTransactionDebit);
    expect(transactions.credit).toEqual(expectedTransactionCredit);
    expect(brokerSpy).toHaveBeenCalledWith(
      'TRANSACTION_API_TEF_PENDING_DEBIT_CREDIT_CREATED',
      JSON.stringify(transactions)
    );
  });
});
