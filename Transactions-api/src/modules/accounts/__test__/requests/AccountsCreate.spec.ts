import 'reflect-metadata';
import request from 'supertest';
import { container } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';
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
      userId: uuidv4(),
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

    it('should not create salary juridical account', async () => {
      const payload = {
        kind: 'salary',
        personKind: 'juridical',
        userId: uuidv4(),
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
      const response = await request(app)
        .post('/accounts')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer Token`)
        .send(payload);

      expect(response.status).toEqual(422);
      expect(response.body).toEqual({
        message: 'Juridical cant create savings/salary accounts',
        status: 'error',
      });
    });

    it('should not create savings juridical account', async () => {
      const payload = {
        kind: 'savings',
        personKind: 'juridical',
        userId: uuidv4(),
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
      const response = await request(app)
        .post('/accounts')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer Token`)
        .send(payload);

      expect(response.status).toEqual(422);
      expect(response.body).toEqual({
        message: 'Juridical cant create savings/salary accounts',
        status: 'error',
      });
    });

    it('should validade income payload', async () => {
      const payload = {
        kind: 'sa',
        personKind: 's',
        userId: 'aaaa',
        balance: 'aaaa',
        overdraft: 'aaaa',
      };

      const response = await request(app)
        .post('/accounts')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer Token`)
        .send(payload);

      expect(response.status).toEqual(422);
      expect(response.body).toEqual({
        status: 'error',
        message: [
          {
            kind: ['kind must match the following: salary savings current'],
          },
          {
            personKind: [
              'personKind must match the following: phisical juridical',
            ],
          },
          {
            userId: ['must be a valid uuid '],
          },
          {
            balance: [
              'balance must be a `number` type, but the final value was: `NaN` (cast from the value `"aaaa"`).',
            ],
          },
          {
            overdraft: [
              'overdraft must be a `number` type, but the final value was: `NaN` (cast from the value `"aaaa"`).',
            ],
          },
          {
            'address.cep': ['address.cep is a required field'],
          },
          {
            'address.state': ['address.state is a required field'],
          },
          {
            'address.city': ['address.city is a required field'],
          },
          {
            'address.street': ['address.street is a required field'],
          },
          {
            'address.neighborhood': [
              'address.neighborhood is a required field',
            ],
          },
          {
            'address.number': ['address.number is a required field'],
          },
        ],
      });
    });
  });
});
