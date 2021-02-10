import 'reflect-metadata';
import request from 'supertest';
import { container } from 'tsyringe';
import app from '../../../../server/app';
import CreateUserService from '../../services/CreateUserService';
import UserRepositoryMock from '../mocks/UserRepositoryMock';
import HashProviderMock from '../mocks/HashProviderMock';
import MessageBrokerMock from '../mocks/MessageBrokerMock';

let createUser: CreateUserService;
let usersRepositoryMock: UserRepositoryMock;
let hashProviderMock: HashProviderMock;
let messageBrokerMock: MessageBrokerMock;

describe('User', () => {
  beforeEach(() => {
    const containerSpy = jest.spyOn(container, 'resolve');
    usersRepositoryMock = new UserRepositoryMock();
    hashProviderMock = new HashProviderMock();
    messageBrokerMock = new MessageBrokerMock();
    createUser = new CreateUserService(
      usersRepositoryMock,
      hashProviderMock,
      messageBrokerMock
    );
    containerSpy.mockReturnValue(createUser);
  });

  describe('create user', () => {
    const user = {
      name: 'Jhondoe',
      email: 'jhondoe@jhondoe.com',
      password: '123456',
    };

    it('should create user', async () => {
      const response = await request(app)
        .post('/users')
        .send(user)
        .set('Accept', 'application/json');
      const expectedResponse = {
        name: response.body.name,
        email: response.body.email,
        active: response.body.active,
      };
      expect(response.status).toEqual(200);
      expect(expectedResponse).toEqual({
        name: user.name,
        email: user.email,
        active: true,
      });
    });

    it('does not create duplicate user', async () => {
      await request(app)
        .post('/users')
        .send(user)
        .set('Accept', 'application/json');

      const response = await request(app)
        .post('/users')
        .send(user)
        .set('Accept', 'application/json');

      const expectedResponse = {
        status: 'error',
        message: 'User email already registered',
      };

      expect(response.status).toEqual(422);
      expect(response.body).toEqual(expectedResponse);
    });
  });
});