import 'reflect-metadata';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import ICreateTransactionDto from '../../dto/ICreateInternalTransactionDto';
import AppError from '../../../../shared/errors/AppErrors';
import CreateInternalTransferService from '../../services/CreateInternalTransferService';
import TransactionRepositoryMock from '../mocks/TransactionRepositoryMock';
import MessageBrokerMock from '../mocks/MessageBrokerMock';
import RabbitMailerSenderMock from '../mocks/RabbitMailerSenderMock';
import {
  currentUser,
  originAccount,
  destinyAccount,
} from '../../../../__mocks__/axios';

let createInternalTransferService: CreateInternalTransferService;
let transactionRepositoryMock: TransactionRepositoryMock;
let messageBrokerMock: MessageBrokerMock;
let rabbitMailerSenderMock: RabbitMailerSenderMock;

describe('CreateInternalTransferService', () => {
  beforeEach(() => {
    transactionRepositoryMock = new TransactionRepositoryMock();
    messageBrokerMock = new MessageBrokerMock();
    rabbitMailerSenderMock = new RabbitMailerSenderMock(messageBrokerMock);
    createInternalTransferService = new CreateInternalTransferService(
      transactionRepositoryMock,
      messageBrokerMock,
      rabbitMailerSenderMock
    );
  });

  it('should transfer between existing internal accounts', async () => {
    const brokerSpy = jest.spyOn(messageBrokerMock, 'publish');

    const transferObj = {
      originAccount,
      destinyAccount,
      amount: 100,
    };

    const transactions = await createInternalTransferService.perform(
      transferObj,
      currentUser
    );

    const expectedTransactionDebit = {
      id: transactions.debit.id,
      originAccount,
      destinyAccount,
      kind: 'internal',
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
      kind: 'internal',
      userId: currentUser.id,
      accountDestinydetail: JSON.stringify({}),
      status: 'pending',
      type: 'C',
      amount: 100,
    };

    expect(transactions.debit).toEqual(expectedTransactionDebit);
    expect(transactions.credit).toEqual(expectedTransactionCredit);
    expect(brokerSpy).toHaveBeenCalledWith(
      'TRANSACTION_API_INTERNAL_PENDING_DEBIT_CREDIT_CREATED',
      JSON.stringify(transactions)
    );
  });

  it('when origin account does not exists', async () => {});
});
