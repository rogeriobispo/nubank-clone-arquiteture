import 'reflect-metadata';
import request from 'supertest';
import { container } from 'tsyringe';
import app from '../../../../server/app';
import AuthenticateUserService from '../../services/AuthenticateUserService';
import UserRepositoryMock from '../mocks/UserRepositoryMock';
import HashProviderMock from '../mocks/HashProviderMock';
import JsonWebTokenProviderMock from '../mocks/JsonWebTokenProviderMock';
import MessageBrokerMock from '../mocks/MessageBrokerMock';
import User from '../../typeorm/Entities/User';

let authService: AuthenticateUserService;
let usersRepositoryMock: UserRepositoryMock;
let hashProviderMock: HashProviderMock;
let jsonWebTokenProviderMock: JsonWebTokenProviderMock;
let messageBrokerMock: MessageBrokerMock;
let user: User;
describe('Authentication', () => {
  beforeEach(async () => {
    const userToCreate = {
      name: 'Jhondoe',
      email: 'jhondoe@jhondoe.com',
      password: '123456',
      active: true,
    };
    const containerSpy = jest.spyOn(container, 'resolve');
    usersRepositoryMock = new UserRepositoryMock();
    hashProviderMock = new HashProviderMock();
    jsonWebTokenProviderMock = new JsonWebTokenProviderMock();
    messageBrokerMock = new MessageBrokerMock();
    authService = new AuthenticateUserService(
      usersRepositoryMock,
      hashProviderMock,
      jsonWebTokenProviderMock,
      messageBrokerMock
    );
    containerSpy.mockReturnValue(authService);

    user = await usersRepositoryMock.create(userToCreate);
  });
  it('Should generate an token', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'jhondoe@jhondoe.com',
        password: '123456',
      })
      .set('Accept', 'application/json');

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      token: `${user.id}, ${user.name}, ${user.email}:token`,
    });
  });

  it('Should not generate token when wrong credentials', async () => {
    const response = await request(app)
      .post('/login')
      .send({
        email: 'jhondoe@jhondoe.com',
        password: 'wrong',
      })
      .set('Accept', 'application/json');

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Unauthorized',
    });
  });

  it('Should not generate an token when the user is blocked', async () => {
    const userBlocked = await usersRepositoryMock.create({
      email: 'user@example.com',
      name: 'user',
      active: false,
      password: '12345',
    });

    const response = await request(app)
      .post('/login')
      .send({
        email: userBlocked.email,
        password: userBlocked.password,
      })
      .set('Accept', 'application/json');

    expect(response.status).toEqual(401);
    expect(response.body).toEqual({
      status: 'error',
      message: 'Unauthorized',
    });
  });
});
