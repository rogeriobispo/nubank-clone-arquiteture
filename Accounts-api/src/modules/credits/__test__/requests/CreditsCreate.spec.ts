import 'reflect-metadata';
import request from 'supertest';
import { container } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';

import ICreateAccountDTO from '../mocks/ICreateAccountMockDto';
import app from '../../../../server/app';
import CreditAccountService from '../../services/creditAccountService';
import AccountRepositoryMock from '../mocks/AccountRepositoryMock';
import MessageBrockerMock from '../mocks/MessageBrokerMock';
import { currentUser } from '../../../../__mocks__/axios';

let creditAccountService: CreditAccountService;
let accountRepositoryMock: AccountRepositoryMock;
let messageBrokerMock: MessageBrockerMock;

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

describe('creditates accounts', () => {
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
    it('should increase credit on the account', async () => {
      const transactionID = uuidv4();

      const debitsPayload = {
        amount: 100,
        transactionID,
      };

      const account = await accountRepositoryMock.create(accountToCreate);

      const response = await request(app)
        .post(`/accounts/${account.id}/credits`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer Token`)
        .send(debitsPayload);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({ credit: true });
    });

    it('should notificate rabbit credit occurred', async () => {
      const brokerSpy = jest.spyOn(messageBrokerMock, 'publish');

      const debitsPayload = {
        amount: 100,
        transactionID: uuidv4(),
      };

      const account = await accountRepositoryMock.create(accountToCreate);

      await request(app)
        .post(`/accounts/${account.id}/credits`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer Token`)
        .send(debitsPayload);

      const expected = JSON.stringify({
        accountID: account.id,
        amount: 100,
        transactionID: debitsPayload.transactionID,
        userID: currentUser.id,
      });

      expect(brokerSpy).toHaveBeenCalledWith(
        'ACCOUNT_API_CREDIT_ACCOUNT',
        expected
      );
    });

    it('when the account does not exist', async () => {
      const debitsPayload = {
        amount: 100,
        transactionID: uuidv4(),
      };

      const response = await request(app)
        .post(`/accounts/${uuidv4()}/credits`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer Token`)
        .send(debitsPayload);

      expect(response.status).toEqual(404);
    });

    it('should not accept negative numbers', async () => {
      const debitsPayload = {
        amount: -100,
        transactionID: uuidv4(),
      };

      const account = await accountRepositoryMock.create(accountToCreate);

      const response = await request(app)
        .post(`/accounts/${account.id}/credits`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer Token`)
        .send(debitsPayload);

      expect(response.status).toEqual(422);
    });

    it('when the account is not active', async () => {
      const debitsPayload = {
        amount: 100,
        transactionID: uuidv4(),
      };

      const account = await accountRepositoryMock.create(accountToCreate);
      account.active = false;
      await accountRepositoryMock.update(account);

      const response = await request(app)
        .post(`/accounts/${account.id}/credits`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer Token`)
        .send(debitsPayload);

      expect(response.status).toEqual(404);
    });

    it('when transaction does not exist', async () => {
      const transactionID = 'invalid-transaction';

      const debitsPayload = {
        amount: 100,
        transactionID,
      };

      const account = await accountRepositoryMock.create(accountToCreate);

      const response = await request(app)
        .post(`/accounts/${account.id}/credits`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer Token`)
        .send(debitsPayload);

      expect(response.status).toEqual(422);
    });

    it('when the user is not authorized', async () => {
      const transactionID = uuidv4();

      const debitsPayload = {
        amount: 100,
        transactionID,
      };

      const account = await accountRepositoryMock.create(accountToCreate);

      const response = await request(app)
        .post(`/accounts/${account.id}/credits`)
        .set('Accept', 'application/json')
        .send(debitsPayload);

      expect(response.status).toEqual(401);
    });
  });
});
