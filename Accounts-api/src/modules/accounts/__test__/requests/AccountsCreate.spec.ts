import 'reflect-metadata';
import request from 'supertest';
import { container } from 'tsyringe';
import app from '../../../../server/app';
import CreateAccountService from '../../services/createAccountService';
import AccountRepositoryMock from '../mocks/AccountRepositoryMock';
import MessageBrockerMock from '../mocks/MessageBrokerMock';
import RabbitMailerSenderMock from '../mocks/RabbitMailerSenderMock';
import ICreateAccountDTO from '../../dto/ICreateAccountDto';

let createAccounts: CreateAccountService;
let accountRepositoryMock: AccountRepositoryMock;
let messageBrockerMock: MessageBrockerMock;
let rabbitMailerSenderMock: RabbitMailerSenderMock;
let accountToCreate: ICreateAccountDTO;

jest.mock('../../../../shared/middlewares/authorizedEndPoint', () =>
  jest.fn((req, res, next) => {
    req.currentUser = {
      id: '',
    };
    next();
  })
);

describe('Accounts', () => {
  beforeEach(() => {
    const containerSpy = jest.spyOn(container, 'resolve');

    accountRepositoryMock = new AccountRepositoryMock();
    messageBrockerMock = new MessageBrockerMock();
    rabbitMailerSenderMock = new RabbitMailerSenderMock(messageBrockerMock);
    createAccounts = new CreateAccountService(
      accountRepositoryMock,
      messageBrockerMock,
      rabbitMailerSenderMock
    );

    containerSpy.mockReturnValue(createAccounts);
    accountToCreate = {
      kind: 'current',
      personKind: 'phisical',
      userId: '5e5fb6a88da347568879cc91a393fcde',
      address: {
        cep: '06814210',
        state: 'SP',
        city: 'embu das artes',
        street: 'Argentina',
        neighborhood: 'Jardim dos moraes',
        number: '237',
      },
      balance: 10.0,
      overdraft: 11.0,
    };
  });

  describe('create account', () => {
    it('should create an new account', async () => {
      const response = await request(app)
        .post('/accounts')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer Token`)
        .send(accountToCreate);

      const expectedResponse = {
        kind: accountToCreate.kind,
        personKind: accountToCreate.personKind,
        userId: accountToCreate.userId,
        active: true,
        address: {
          cep: '06814210',
          state: 'SP',
          city: 'embu das artes',
          street: 'Argentina',
          neighborhood: 'Jardim dos moraes',
          number: '237',
        },
        balance: accountToCreate.balance,
        id: response.body.id,
        overdraft: accountToCreate.overdraft,
      };
      expect(response.status).toEqual(200);
      expect(response.body).toEqual(expectedResponse);
    });
  });
});
