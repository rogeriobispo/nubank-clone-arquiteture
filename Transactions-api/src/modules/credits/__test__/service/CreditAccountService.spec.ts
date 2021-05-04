import 'reflect-metadata';
import { v4 as uuidv4 } from 'uuid';
import ICreateAccountDTO from '../mocks/ICreateAccountMockDto';
import AppError from '../../../../shared/errors/AppErrors';
import CreditAccountService from '../../services/creditAccountService';
import AccountRepositoryMock from '../mocks/AccountRepositoryMock';
import MessageBrokerMock from '../mocks/MessageBrokerMock';

let creditAccountService: CreditAccountService;
let accountRepositoryMock: AccountRepositoryMock;
let messageBrokerMock: MessageBrokerMock;

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
    accountRepositoryMock = new AccountRepositoryMock();
    messageBrokerMock = new MessageBrokerMock();
    creditAccountService = new CreditAccountService(
      accountRepositoryMock,
      messageBrokerMock
    );
  });

  it('should add some credit on the account', async () => {
    const transatcion = uuidv4();

    const account = await accountRepositoryMock.create(accountToCreate);

    const response = await creditAccountService.perform(
      100.0,
      account.id,
      transatcion,
      currentUser
    );
    const changedAccount = await accountRepositoryMock.findById(account.id);

    expect(response).toBe(true);
    expect(changedAccount?.balance).toEqual(110.0);
  });

  it('should not accept negative numbers', async () => {
    const brokerSpy = jest.spyOn(messageBrokerMock, 'publish');
    const transatcion = uuidv4();

    const account = await accountRepositoryMock.create(accountToCreate);

    await expect(
      creditAccountService.perform(-100.0, account.id, transatcion, currentUser)
    ).rejects.toBeInstanceOf(AppError);
    expect(brokerSpy).not.toHaveBeenCalledWith('mailerQueue');
    expect(brokerSpy).not.toHaveBeenCalledWith('ACCOUNT_API_CREDIT_ACCOUNT');
  });

  it('should notificate rabbit credit occurred', async () => {
    const brokerSpy = jest.spyOn(messageBrokerMock, 'publish');
    const transatcion = uuidv4();

    const account = await accountRepositoryMock.create(accountToCreate);

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

    const account = await accountRepositoryMock.create(accountToCreate);

    account.active = false;
    await accountRepositoryMock.update(account);
    await expect(
      creditAccountService.perform(100.0, account.id, transatcion, currentUser)
    ).rejects.toBeInstanceOf(AppError);
  });
});
