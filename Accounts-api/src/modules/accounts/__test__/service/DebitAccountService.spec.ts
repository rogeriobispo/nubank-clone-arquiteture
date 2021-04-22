import 'reflect-metadata';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import ICreateAccountDTO from '@modules/accounts/dto/ICreateAccountDto';
import AppError from '../../../../shared/errors/AppErrors';
import CreateAccountService from '../../services/createAccountService';
import DebitAccountService from '../../services/debitAccountService';
import AccountRepositoryMock from '../mocks/AccountRepositoryMock';
import MessageBrokerMock from '../mocks/MessageBrokerMock';
import RabbitMailerSenderMock from '../mocks/RabbitMailerSenderMock';

let createAccountService: CreateAccountService;
let debitAccountService: DebitAccountService;
let accountRepositoryMOck: AccountRepositoryMock;
let messageBrokerMock: MessageBrokerMock;
let rabbitMailerSenderMock: RabbitMailerSenderMock;

const currentUser = {
  id: uuidv4(),
  name: 'John',
  email: 'john@gmail.com',
};

const address = {
  cep: '06814210',
  state: 'SP',
  city: 'embu das artes',
  street: 'Argentina',
  neighborhood: 'Jardim dos moraes',
  number: '237',
};

const accountToCreate: ICreateAccountDTO = {
  kind: 'current',
  personKind: 'phisical',
  userId: uuidv4(),
  address,
  balance: 1000.0,
  overdraft: 110.0,
};

describe('CreateAccountService', () => {
  beforeEach(async () => {
    accountRepositoryMOck = new AccountRepositoryMock();
    messageBrokerMock = new MessageBrokerMock();
    rabbitMailerSenderMock = new RabbitMailerSenderMock(messageBrokerMock);
    debitAccountService = new DebitAccountService(
      accountRepositoryMOck,
      messageBrokerMock,
      rabbitMailerSenderMock
    );

    createAccountService = new CreateAccountService(
      accountRepositoryMOck,
      messageBrokerMock,
      rabbitMailerSenderMock
    );
  });

  it('should decrease some credit on the account', async () => {
    const transatcion = uuidv4();

    const account = await createAccountService.perform(
      accountToCreate,
      currentUser
    );

    const response = await debitAccountService.perform(
      100.0,
      account.id,
      transatcion,
      currentUser
    );

    const changedAccount = await accountRepositoryMOck.findById(account.id);

    expect(response).toBe(true);
    expect(changedAccount?.balance).toEqual(900.0);
  });

  it('should notificate rabbit credit occurred', async () => {
    const brokerSpy = jest.spyOn(messageBrokerMock, 'publish');

    const transatcion = uuidv4();

    const account = await createAccountService.perform(
      accountToCreate,
      currentUser
    );

    await debitAccountService.perform(
      100.0,
      account.id,
      transatcion,
      currentUser
    );

    const expected = JSON.stringify({
      accountID: account.id,
      amount: 100,
      transactionID: transatcion,
      userID: currentUser.id,
    });

    expect(brokerSpy).toHaveBeenCalledWith(
      'ACCOUNT_API_DEBIT_ACCOUNT',
      expected
    );
  });
  it('when the account does not exist', async () => {
    const transatcion = uuidv4();

    await expect(
      debitAccountService.perform(
        100.0,
        'bkkhehbjk-khbhha',
        transatcion,
        currentUser
      )
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not accept negative numbers', async () => {
    const transatcion = uuidv4();

    const account = await createAccountService.perform(
      accountToCreate,
      currentUser
    );

    await expect(
      debitAccountService.perform(-100.0, account.id, transatcion, currentUser)
    ).rejects.toBeInstanceOf(AppError);
  });
});
