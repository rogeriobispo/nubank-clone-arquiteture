import 'reflect-metadata';
import request from 'supertest';
import { container } from 'tsyringe';
import app from '../../../../server/app';
import UpdateUserService from '../../services/UpdateUserService';
import UserRepositoryMock from '../mocks/UserRepositoryMock';
import HashProviderMock from '../mocks/HashProviderMock';
import MessageBrokerMock from '../mocks/MessageBrokerMock';
import tokenMock from '../mocks/JsonWebTokenProviderMock';
import User from '../../typeorm/Entities/User';

let updateUser: UpdateUserService;
let usersRepositoryMock: UserRepositoryMock;
let hashProviderMock: HashProviderMock;
let messageBrokerMock: MessageBrokerMock;
let token: string;
let userToUpdate: User;
describe('User', () => {
  beforeEach(async () => {
    const containerSpy = jest.spyOn(container, 'resolve');
    usersRepositoryMock = new UserRepositoryMock();
    hashProviderMock = new HashProviderMock();
    messageBrokerMock = new MessageBrokerMock();
    updateUser = new UpdateUserService(
      usersRepositoryMock,
      hashProviderMock,
      messageBrokerMock
    );
    const user = {
      name: 'Jhondoe',
      email: 'jhondoe@jhondoe.com',
      password: '123456',
    };

    userToUpdate = await usersRepositoryMock.create(user);
    token = await tokenMock(userToUpdate);
    containerSpy.mockReturnValue(updateUser);

    await usersRepositoryMock.create({
      name: 'user 1',
      email: 'existing@example.com',
      password: 'password',
    });
  });

  describe('Update user', () => {
    it('should update the user', async () => {
      const response = await request(app)
        .put(`/users/${userToUpdate.id}`)
        .send({
          name: 'update user',
          email: 'updatedUser@gmail.com',
        })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);
      const expectedResponse = {
        name: response.body.name,
        email: response.body.email,
        active: response.body.active,
      };
      expect(response.status).toEqual(200);
      expect(expectedResponse).toEqual({
        name: 'update user',
        email: 'updatedUser@gmail.com',
        active: true,
      });
    });

    it('shoud return an erro when user is not found', async () => {
      const response = await request(app)
        .put(`/users/e28b6d2f-ec74-4f07-a9b1-24ad5bd95fc4`)
        .send({
          name: 'update user',
          email: 'update@example.com',
        })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      const expectedResponse = {
        status: 'error',
        message: 'User not found',
      };

      expect(response.status).toEqual(422);
      expect(response.body).toEqual(expectedResponse);
    });
    it('should not update user with registered email', async () => {
      const response = await request(app)
        .put(`/users/${userToUpdate.id}`)
        .send({
          name: 'update user',
          email: 'existing@example.com',
        })
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      const expectedResponse = {
        status: 'error',
        message: 'User email already registered',
      };

      expect(response.status).toEqual(422);
      expect(response.body).toEqual(expectedResponse);
    });

    it('should not update the user without token', async () => {
      const response = await request(app)
        .put(`/users/${userToUpdate.id}`)
        .send({
          name: 'update user',
          email: 'updatedUser@gmail.com',
        })
        .set('Accept', 'application/json');

      expect(response.status).toEqual(401);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Unauthorized',
      });
    });

    it('should not update the user without token', async () => {
      const response = await request(app)
        .put(`/users/${userToUpdate.id}`)
        .send({
          name: 'update user',
          email: 'updatedUser@gmail.com',
        })
        .set('Accept', 'application/json');

      expect(response.status).toEqual(401);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Unauthorized',
      });
    });
  });
});
