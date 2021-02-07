import 'reflect-metadata';
import request from 'supertest';
import { container } from 'tsyringe';
import app from '../../../../server/app';
import UpdateUserStatusService from '../../services/UpdateUserStatusService';
import UserRepositoryMock from '../mocks/UserRepositoryMock';
import MessageBrokerMock from '../mocks/MessageBrokerMock';
import tokenMock from '../mocks/JsonWebTokenProviderMock';
import User from '../../typeorm/Entities/User';

let updateUserStatus: UpdateUserStatusService;
let usersRepositoryMock: UserRepositoryMock;
let messageBrokerMock: MessageBrokerMock;
let token: string;
let userToUpdate: User;
describe('UserStatus', () => {
  beforeEach(async () => {
    const containerSpy = jest.spyOn(container, 'resolve');
    usersRepositoryMock = new UserRepositoryMock();
    messageBrokerMock = new MessageBrokerMock();
    updateUserStatus = new UpdateUserStatusService(
      usersRepositoryMock,
      messageBrokerMock
    );
    const user = {
      name: 'Jhondoe',
      email: 'jhondoe@jhondoe.com',
      password: '123456',
    };

    userToUpdate = await usersRepositoryMock.create(user);
    token = await tokenMock(userToUpdate);
    containerSpy.mockReturnValue(updateUserStatus);
  });

  describe('Update user status', () => {
    it('should update the user status to false', async () => {
      const response = await request(app)
        .patch(`/users/${userToUpdate.id}/status`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        name: userToUpdate.name,
        email: userToUpdate.email,
        active: false,
      });
    });

    it('should update the user status to true', async () => {
      userToUpdate.active = false;
      await usersRepositoryMock.update(userToUpdate);
      const response = await request(app)
        .patch(`/users/${userToUpdate.id}/status`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        name: userToUpdate.name,
        email: userToUpdate.email,
        active: true,
      });
    });
    it('shoud return an erro when user is not found', async () => {
      const response = await request(app)
        .patch(`/users/e28b6d2f-ec74-4f07-a9b1-24ad5bd95fc4/status`)
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${token}`);

      const expectedResponse = {
        status: 'error',
        message: 'User not found',
      };

      expect(response.status).toEqual(422);
      expect(response.body).toEqual(expectedResponse);
    });

    it('should not update the user status without token', async () => {
      const response = await request(app)
        .patch(`/users/${userToUpdate.id}/status`)
        .set('Accept', 'application/json');

      expect(response.status).toEqual(401);
      expect(response.body).toEqual({
        status: 'error',
        message: 'Unauthorized',
      });
    });
  });
});
