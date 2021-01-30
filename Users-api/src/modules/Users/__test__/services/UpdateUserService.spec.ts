import 'reflect-metadata';
import UpdateUserService from '../../services/UpdateUserService';
import UserRepositoryMock from '../mocks/UserRepositoryMock';
import HashProviderMock from '../mocks/HashProviderMock';
import AppError from '../../../../shared/errors/AppErrors';
import User from '../../typeorm/Entities/User';
import MessageBrokerMock from '../mocks/MessageBrokerMock';

let updateUser: UpdateUserService;
let usersRepositoryMock: UserRepositoryMock;
let hashProviderMock: HashProviderMock;
let messageBrokerMock: MessageBrokerMock;
let user: User;

describe('UpdateUserService', () => {
  beforeEach(async () => {
    usersRepositoryMock = new UserRepositoryMock();
    hashProviderMock = new HashProviderMock();
    messageBrokerMock = new MessageBrokerMock();
    updateUser = new UpdateUserService(
      usersRepositoryMock,
      hashProviderMock,
      messageBrokerMock
    );

    const userData = {
      name: 'JohnDoe',
      email: 'john@doe.com',
      password: 'password',
    };

    user = await usersRepositoryMock.create(userData);
  });

  describe('perform', () => {
    it('should update name and email', async () => {
      const userToUpdate = {
        id: user.id,
        email: 'JohnDoeChanged@JohnDoeChanged',
        name: 'JohnDoeChanged',
      };

      const updatedUser = await updateUser.perform(userToUpdate);

      expect(updatedUser.email).toBe('JohnDoeChanged@JohnDoeChanged');
      expect(updatedUser.name).toBe('JohnDoeChanged');
    });

    it('should update only name', async () => {
      const userToUpdate = {
        id: user.id,
        name: 'JohnDoeChanged',
      };

      const updatedUser = await updateUser.perform(userToUpdate);

      expect(updatedUser.name).toBe('JohnDoeChanged');
      expect(updatedUser.email).toBe(user.email);
    });

    it('shoud throw exception when user not found', async () => {
      const userToUpdate = {
        id: 'doesNotExist',
      };
      await expect(updateUser.perform(userToUpdate)).rejects.toBeInstanceOf(
        AppError
      );
    });

    it('should update only email', async () => {
      const userToUpdate = {
        id: user.id,
        email: 'JohnDoeChanged2@JohnDoeChanged',
      };

      const updatedUser = await updateUser.perform(userToUpdate);

      expect(updatedUser.email).toBe('JohnDoeChanged2@JohnDoeChanged');
      expect(updatedUser.name).toBe(user.name);
    });

    it('shoud throw exception when update email with a email already taken', async () => {
      const userToUpdate = {
        id: user.id,
        email: user.email,
      };

      await expect(updateUser.perform(userToUpdate)).rejects.toBeInstanceOf(
        AppError
      );
    });

    it('should update password', async () => {
      const userToUpdate = {
        id: user.id,
        password: 'newpassword',
      };

      const updatedUser = await updateUser.perform(userToUpdate);

      expect(updatedUser.email).toBe(user.email);
      expect(updatedUser.name).toBe(user.name);
      expect(updatedUser.password).toBe('hashed:newpassword');
    });

    it('should send message to broker with event user created', async () => {
      const brokerSpy = jest.spyOn(messageBrokerMock, 'publish');
      const userToUpdate = {
        id: user.id,
        name: 'newName',
        password: 'newpassword',
      };

      await updateUser.perform(userToUpdate);

      expect(brokerSpy).toHaveBeenCalledTimes(1);
      expect(brokerSpy).toHaveBeenCalledWith(
        'USER_API_USER_UPDATED',
        JSON.stringify({
          id: user.id,
          name: userToUpdate.name,
          email: user.email,
        })
      );
    });
  });
});
