import 'reflect-metadata';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import ICreateAccountDTO from '@modules/accounts/dto/ICreateAccountDto';
import AppError from '../../../../shared/errors/AppErrors';
import CreateAccountService from '../../services/createAccountService';
import CreditAccountService from '../../services/creditAccountService';
import AccountRepositoryMock from '../mocks/AccountRepositoryMock';
import MessageBrokerMock from '../mocks/MessageBrokerMock';
import RabbitMailerSenderMock from '../mocks/RabbitMailerSenderMock';

let createAccountService: CreateAccountService;
let creditAccountService: CreditAccountService;
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
  balance: 10.0,
  overdraft: 11.0,
};

describe('CreateAccountService', () => {
  beforeEach(async () => {
    accountRepositoryMOck = new AccountRepositoryMock();
    messageBrokerMock = new MessageBrokerMock();
    rabbitMailerSenderMock = new RabbitMailerSenderMock(messageBrokerMock);
    creditAccountService = new CreditAccountService(
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

  it('should add some credit on the account', async () => {
    const account = await createAccountService.perform(
      accountToCreate,
      currentUser
    );

    const response = await creditAccountService.perform(
      100.0,
      account.id,
      currentUser
    );
    const changedAccount = await accountRepositoryMOck.findById(account.id);

    expect(response).toBe(true);
    expect(changedAccount?.balance).toEqual(110.0);
  });

  it('should not accept negative numbers', async () => {
    const account = await createAccountService.perform(
      accountToCreate,
      currentUser
    );

    await expect(
      creditAccountService.perform(-100.0, account.id, currentUser)
    ).rejects.toBeInstanceOf(AppError);
  });

  it('when the account does not exist', async () => {
    const result = await creditAccountService.perform(
      100.0,
      'doesnotexists',
      currentUser
    );
    await expect(result).toBe(false);
  });
});
