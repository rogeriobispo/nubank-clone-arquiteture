import 'reflect-metadata';
import AppError from '../../../../shared/errors/AppErrors';
import CreateUserService from '../../services/CreateUserService';
import UserRepositoryMock from '../mocks/UserRepositoryMock';
import HashProviderMock from '../mocks/HashProviderMock';
import MessageBrokerMock from '../mocks/MessageBrokerMock';

let createUser: CreateUserService;
let usersRepositoryMock: UserRepositoryMock;
let hashProviderMock: HashProviderMock;
let messageBrokerMock: MessageBrokerMock;

describe('CreateUserService', () => {
  beforeEach(() => {
    usersRepositoryMock = new UserRepositoryMock();
    hashProviderMock = new HashProviderMock();
    messageBrokerMock = new MessageBrokerMock();
    createUser = new CreateUserService(
      usersRepositoryMock,
      hashProviderMock,
      messageBrokerMock
    );
  });

  describe('perform', () => {
    it('should create a user', async () => {
      const user = await createUser.perform({
        name: 'JohnDoe',
        email: 'john@doe.com',
        password: 'password',
      });

      expect(user).toHaveProperty('id');
      expect(user.name).toBe('JohnDoe');
      expect(user.email).toBe('john@doe.com');
    });

    it('should not create a duplicate user', async () => {
      const userData = {
        name: 'JohnDoeDup',
        email: 'johnDup@doe.com',
        password: 'password',
      };

      await createUser.perform(userData);

      await expect(createUser.perform(userData)).rejects.toBeInstanceOf(
        AppError
      );
    });

    it('should be an hashed password', async () => {
      const user = await createUser.perform({
        name: 'JohnDoe2',
        email: 'john2@doe.com',
        password: 'password',
      });

      expect(user.password).toEqual(`hashed:password`);
    });

    it('should send message to broke with event user created', async () => {
      const brokerSpy = jest.spyOn(messageBrokerMock, 'publish');
      const user = await createUser.perform({
        name: 'JohnDoe3',
        email: 'john3@doe.com',
        password: 'password',
      });

      expect(brokerSpy).toHaveBeenCalledTimes(1);
      expect(brokerSpy).toHaveBeenCalledWith(
        'USER_API_USER_CREATED',
        JSON.stringify(user)
      );
    });
  });
});
