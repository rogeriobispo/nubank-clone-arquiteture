import 'reflect-metadata';
import request from 'supertest';
import { container } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';

import ICreateAccountDTO from '../mocks/ICreateAccountMockDto';
import app from '../../../../server/app';
import CreditAccountService from '../../services/creditAccountService';
import AccountRepositoryMock from '../mocks/AccountRepositoryMock';
import MessageBrockerMock from '../mocks/MessageBrokerMock';

let creditAccountService: CreditAccountService;
let accountRepositoryMock: AccountRepositoryMock;
let messageBrokerMock: MessageBrockerMock;

const currentUser = {
  id: uuidv4(),
  name: 'John',
  email: 'john@gmail.com',
};

jest.mock('../../../../shared/middlewares/authorizedEndPoint', () =>
  jest.fn((req, res, next) => {
    req.currentUser = currentUser;
    next();
  })
);

jest.mock('../../../../shared/middlewares/validateTransactions', () =>
  jest.fn((req, res, next) => {
    next();
  })
);

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

describe('Accounts', () => {
  beforeEach(() => {
    const containerSpy = jest.spyOn(container, 'resolve');

    accountRepositoryMock = new AccountRepositoryMock();
    messageBrokerMock = new MessageBrockerMock();
    creditAccountService = new CreditAccountService(
      accountRepositoryMock,
      messageBrokerMock
    );

    containerSpy.mockReturnValue(creditAccountService);
  });

  describe('creditates account', () => {
    it('should add some credit on the account', async () => {});

    it('should not accept negative numbers', async () => {});

    it('should notificate rabbit credit occurred', async () => {});

    it('when the account does not exist', async () => {});

    it('should not add credit when the account is inactive', async () => {});
  });
});
