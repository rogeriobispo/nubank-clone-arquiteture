import 'reflect-metadata';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import ICreateAccountDTO from '@modules/accounts/dto/ICreateAccountDto';
import AppError from '../../../../shared/errors/AppErrors';
import CreateAccountService from '../../services/createAccountService';
import AccountRepositoryMock from '../mocks/AccountRepositoryMock';
import MessageBrokerMock from '../mocks/MessageBrokerMock';
import RabbitMailerSenderMock from '../mocks/RabbitMailerSenderMock';

let createAccountService: CreateAccountService;
let accountRepositoryMOck: AccountRepositoryMock;
let messageBrokerMock: MessageBrokerMock;
let rabbitMailerSenderMock: RabbitMailerSenderMock;

const address = {
  cep: '06814210',
  state: 'SP',
  city: 'embu das artes',
  street: 'Argentina',
  neighborhood: 'Jardim dos moraes',
  number: '237',
};

const currentUser = {
  id: uuidv4(),
  name: 'John',
  email: 'john@gmail.com',
};
describe('CreateAccountService', () => {
  beforeEach(() => {
    accountRepositoryMOck = new AccountRepositoryMock();
    messageBrokerMock = new MessageBrokerMock();
    rabbitMailerSenderMock = new RabbitMailerSenderMock(messageBrokerMock);

    createAccountService = new CreateAccountService(
      accountRepositoryMOck,
      messageBrokerMock,
      rabbitMailerSenderMock
    );
  });
  it('should create a new account', async () => {
    const accountToCreate: ICreateAccountDTO = {
      kind: 'current',
      personKind: 'phisical',
      userId: uuidv4(),
      address,
      balance: 10.0,
      overdraft: 11.0,
    };

    const account = await createAccountService.perform(
      accountToCreate,
      currentUser
    );
    expect(account.balance).toEqual(10.0);
    expect(account.overdraft).toEqual(11.0);
  });

  it('should send account created email', async () => {
    const accountToCreate: ICreateAccountDTO = {
      kind: 'current',
      personKind: 'phisical',
      userId: uuidv4(),
      address,
      balance: 10.0,
      overdraft: 11.0,
    };
    const brokerSpy = jest.spyOn(messageBrokerMock, 'publish');
    const account = await createAccountService.perform(
      accountToCreate,
      currentUser
    );

    const template = path.resolve(
      __dirname,
      '..',
      '..',
      'views',
      'accountCreated.hbs'
    );
    const expected = JSON.stringify({
      from: {
        name: 'rogerbank',
        email: 'roger@rogerbank.com.br',
      },
      to: {
        name: 'John',
        email: 'john@gmail.com',
      },
      subject: 'Conta Criada',
      templateFileContent: template,
      variables: {
        name: 'John',
        company: 'rogerbank',
        kind: account.kind,
        number: account.accountNumber,
        companyEmail: 'roger@rogerbank.com.br',
      },
    });

    expect(brokerSpy).toHaveBeenCalledWith('mailerQueue', expected);
  });

  it('should notificate rabbit account_created event', async () => {
    const brokerSpy = jest.spyOn(messageBrokerMock, 'publish');

    const accountToCreate: ICreateAccountDTO = {
      kind: 'current',
      personKind: 'phisical',
      userId: uuidv4(),
      address,
      balance: 10.0,
      overdraft: 11.0,
    };

    const account = await createAccountService.perform(
      accountToCreate,
      currentUser
    );
    expect(brokerSpy).toHaveBeenCalledWith(
      'ACCOUNT_API_ACCOUNT_CREATED',
      JSON.stringify(account)
    );
  });

  it('juridical cant create salary account', async () => {
    const accountToCreate: ICreateAccountDTO = {
      kind: 'salary',
      personKind: 'juridical',
      userId: uuidv4(),
      address,
      balance: 10.0,
      overdraft: 11.0,
    };

    await expect(
      createAccountService.perform(accountToCreate, currentUser)
    ).rejects.toBeInstanceOf(AppError);
  });

  it('juridical cant create savings account', async () => {
    const accountToCreate: ICreateAccountDTO = {
      kind: 'savings',
      personKind: 'juridical',
      userId: uuidv4(),
      address,
      balance: 10.0,
      overdraft: 11.0,
    };

    await expect(
      createAccountService.perform(accountToCreate, currentUser)
    ).rejects.toBeInstanceOf(AppError);
  });
});
