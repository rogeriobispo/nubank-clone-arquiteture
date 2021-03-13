import 'reflect-metadata';
import AppError from '../../../../shared/errors/AppErrors';
import AutheticateUserService from '../../services/AuthenticateUserService';
import UserRepositoryMock from '../mocks/UserRepositoryMock';
import JsonWebTokenProviderMock from '../mocks/JsonWebTokenProviderMock';
import HashProviderMock from '../mocks/HashProviderMock';
import MessageBrokerMock from '../mocks/MessageBrokerMock';

let authenticateUserService: AutheticateUserService;
let usersRepositoryMock: UserRepositoryMock;
let hashProviderMock: HashProviderMock;
let messageBrokerMock: MessageBrokerMock;
let jsonWebTokenProviderMock: JsonWebTokenProviderMock;

describe('AuthenticateUserService', () => {
  beforeEach(() => {
    usersRepositoryMock = new UserRepositoryMock();
    hashProviderMock = new HashProviderMock();
    messageBrokerMock = new MessageBrokerMock();
    jsonWebTokenProviderMock = new JsonWebTokenProviderMock();

    authenticateUserService = new AutheticateUserService(
      usersRepositoryMock,
      hashProviderMock,
      jsonWebTokenProviderMock,
      messageBrokerMock
    );
  });

  describe('perform', () => {
    it('should authenticate an user successfully', async () => {
      const brokerSpy = jest.spyOn(messageBrokerMock, 'publish');

      const user = await usersRepositoryMock.create({
        name: 'JohnDoe',
        email: 'john@doe.com',
        password: 'password',
        active: true,
      });

      const response = await authenticateUserService.perform(
        user.email,
        user.password
      );
      expect(brokerSpy).toHaveBeenCalledTimes(1);
      expect(brokerSpy).toHaveBeenCalledWith(
        'USER_API_USER_AUTHENTICATED',
        JSON.stringify({
          id: user.id,
          name: user.name,
          email: user.email,
        })
      );
      expect(response).toStrictEqual({
        token: `${user.id}, ${user.name}, ${user.email}:token`,
      });
    });

    it('should throw an error when user does not exists', async () => {
      const user = await usersRepositoryMock.create({
        name: 'JohnDoe',
        email: 'john@doe.com',
        password: 'password',
        active: true,
      });

      await expect(
        authenticateUserService.perform(user.email, 'anypassword')
      ).rejects.toBeInstanceOf(AppError);
    });

    it('should throw an error when user password is invalid', async () => {
      await expect(
        authenticateUserService.perform('email@notexistent.com', 'anypassword')
      ).rejects.toBeInstanceOf(AppError);
    });
  });
});
