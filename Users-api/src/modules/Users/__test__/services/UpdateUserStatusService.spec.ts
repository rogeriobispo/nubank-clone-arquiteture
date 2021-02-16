import 'reflect-metadata';
import UpdateUserStatusService from '../../services/UpdateUserStatusService';
import UserRepositoryMock from '../mocks/UserRepositoryMock';
import User from '../../typeorm/Entities/User';
import AppError from '../../../../shared/errors/AppErrors';
import MessageBrokerMock from '../mocks/MessageBrokerMock';

let updateUserStatus: UpdateUserStatusService;
let usersRepositoryMock: UserRepositoryMock;
let messageBrockerMock: MessageBrokerMock;
let user: User;

describe('UpdateUserStatusService', () => {
  beforeEach(async () => {
    usersRepositoryMock = new UserRepositoryMock();
    messageBrockerMock = new MessageBrokerMock();
    updateUserStatus = new UpdateUserStatusService(
      usersRepositoryMock,
      messageBrockerMock
    );

    const userData = {
      name: 'JohnDoe',
      email: 'john@doe.com',
      password: 'password',
      status: true,
    };

    user = await usersRepositoryMock.create(userData);
  });

  describe('perform', () => {
    it('when user is not found', async () => {
      await expect(
        updateUserStatus.perform('xxxx', 'useridxxx')
      ).rejects.toBeInstanceOf(AppError);
    });
    it('should change user status from true to false', async () => {
      user.active = true;
      await updateUserStatus.perform(user.id, 'useridxxx');

      expect(user.active).toBe(false);
    });

    it('should update status from false to true', async () => {
      user.active = false;
      await updateUserStatus.perform(user.id, 'useridxxx');

      expect(user.active).toBe(true);
    });

    it('should send message to broker with event user is blocked', async () => {
      const brokerSpy = jest.spyOn(messageBrockerMock, 'publish');
      user.active = true;
      await updateUserStatus.perform(user.id, 'userxxx');

      expect(brokerSpy).toHaveBeenCalledTimes(1);
      expect(brokerSpy).toHaveBeenCalledWith(
        'USER_API_USER_BLOCKED',
        JSON.stringify({
          currentUserId: 'userxxx',
          id: user.id,
          name: user.name,
          email: user.email,
          active: false,
        })
      );
    });

    it('should send message to broker with event user is unblocked', async () => {
      const brokerSpy = jest.spyOn(messageBrockerMock, 'publish');
      user.active = false;
      await usersRepositoryMock.update(user);
      await updateUserStatus.perform(user.id, 'useridxxx');
      expect(brokerSpy).toHaveBeenCalledTimes(1);
      expect(brokerSpy).toHaveBeenCalledWith(
        'USER_API_USER_UNBLOCKED',
        JSON.stringify({
          currentUserId: 'useridxxx',
          id: user.id,
          name: user.name,
          email: user.email,
          active: true,
        })
      );
    });
  });
});
