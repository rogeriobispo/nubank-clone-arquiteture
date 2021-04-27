import 'reflect-metadata';
import { v4 as uuidv4 } from 'uuid';
import ICreateAccountDTO from '@modules/accounts/dto/ICreateAccountDto';
import AppError from '../../../../shared/errors/AppErrors';
import CreateAccountService from '../../../accounts/services/createAccountService';
import CreditAccountService from '../../services/creditAccountService';
import AccountRepositoryMock from '../../../accounts/__test__/mocks/AccountRepositoryMock';
import MessageBrokerMock from '../../../accounts/__test__/mocks/MessageBrokerMock';
import RabbitMailerSenderMock from '../../../accounts/__test__/mocks/RabbitMailerSenderMock';

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

describe('CreditAccountService', () => {
  beforeEach(async () => {
    accountRepositoryMOck = new AccountRepositoryMock();
    messageBrokerMock = new MessageBrokerMock();
    rabbitMailerSenderMock = new RabbitMailerSenderMock(messageBrokerMock);
    creditAccountService = new CreditAccountService(
      accountRepositoryMOck,
      messageBrokerMock
    );

    createAccountService = new CreateAccountService(
      accountRepositoryMOck,
      messageBrokerMock,
      rabbitMailerSenderMock
    );
  });

  it('should add some credit on the account', async () => {
    const transatcion = uuidv4();

    const account = await createAccountService.perform(
      accountToCreate,
      currentUser
    );

    const response = await creditAccountService.perform(
      100.0,
      account.id,
      transatcion,
      currentUser
    );
    const changedAccount = await accountRepositoryMOck.findById(account.id);

    expect(response).toBe(true);
    expect(changedAccount?.balance).toEqual(110.0);
  });

  it('should not accept negative numbers', async () => {
    const brokerSpy = jest.spyOn(messageBrokerMock, 'publish');
    const transatcion = uuidv4();

    const account = await createAccountService.perform(
      accountToCreate,
      currentUser
    );

    await expect(
      creditAccountService.perform(-100.0, account.id, transatcion, currentUser)
    ).rejects.toBeInstanceOf(AppError);
    expect(brokerSpy).not.toHaveBeenCalledWith('mailerQueue');
    expect(brokerSpy).not.toHaveBeenCalledWith('ACCOUNT_API_CREDIT_ACCOUNT');
  });

  it('should notificate rabbit credit occurred', async () => {
    const brokerSpy = jest.spyOn(messageBrokerMock, 'publish');
    const transatcion = uuidv4();

    const account = await createAccountService.perform(
      accountToCreate,
      currentUser
    );

    await creditAccountService.perform(
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
      'ACCOUNT_API_CREDIT_ACCOUNT',
      expected
    );
  });

  it('when the account does not exist', async () => {
    const brokerSpy = jest.spyOn(messageBrokerMock, 'publish');
    const transatcion = uuidv4();

    await expect(
      creditAccountService.perform(
        100.0,
        'bkkhehbjk-khbhha',
        transatcion,
        currentUser
      )
    ).rejects.toBeInstanceOf(AppError);

    expect(brokerSpy).not.toHaveBeenCalledWith('mailerQueue');
    expect(brokerSpy).not.toHaveBeenCalledWith('ACCOUNT_API_CREDIT_ACCOUNT');
  });

  it('should not add credit when the account is inactive', async () => {
    const transatcion = uuidv4();

    const account = await createAccountService.perform(
      accountToCreate,
      currentUser
    );

    account.active = false;
    await accountRepositoryMOck.update(account);
    await expect(
      creditAccountService.perform(100.0, account.id, transatcion, currentUser)
    ).rejects.toBeInstanceOf(AppError);
  });
});
