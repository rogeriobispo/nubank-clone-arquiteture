import 'reflect-metadata';
import request from 'supertest';
import { container } from 'tsyringe';
import app from '../../../../server/app';
import CreateTefService from '../../services/CreateTefService';
import TefRepositoryMock from '../mocks/TefRepositoryMock';
import MessageBrokerMock from '../mocks/MessageBrokerMock';
import { originAccount, destinyAccount } from '../../../../__mocks__/axios';

let createTefService: CreateTefService;
let tefRepositoryMock: TefRepositoryMock;
let messageBrokerMock: MessageBrokerMock;

describe('TEF', () => {
  beforeEach(() => {
    const containerSpy = jest.spyOn(container, 'resolve');

    tefRepositoryMock = new TefRepositoryMock();
    messageBrokerMock = new MessageBrokerMock();
    createTefService = new CreateTefService(
      tefRepositoryMock,
      messageBrokerMock
    );

    containerSpy.mockReturnValue(createTefService);
  });

  describe('create tef', () => {
    it('should create transaction type tef', async () => {
      const tranfersPayload = {
        originAccount,
        destinyAccount,
        amount: 100,
      };

      const response = await request(app)
        .post('/tefs')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer Token`)
        .send(tranfersPayload);

      expect(response.status).toEqual(202);
    });

    it('should fail when payload is wrong', async () => {
      const response = await request(app)
        .post('/tefs')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer Token`);

      expect(response.status).toEqual(422);
      expect(response.body).toEqual({
        message: [
          {
            originAccount: ['originAccount is a required field'],
          },
          {
            destinyAccount: ['destinyAccount is a required field'],
          },
          {
            amount: ['amount is a required field'],
          },
        ],
        status: 'error',
      });
    });
  });
});
