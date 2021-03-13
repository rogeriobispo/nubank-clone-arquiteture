import 'reflect-metadata';
import AppError from '../../../../shared/errors/AppErrors';
import CreateUserService from '../../services/CreateUserService';
import UserRepositoryMock from '../mocks/UserRepositoryMock';
import HashProviderMock from '../mocks/HashProviderMock';
import MessageBrokerMock from '../mocks/MessageBrokerMock';
import RabbitMailerSenderMock from '../mocks/RabbitMailerSenderMock';

let createUser: CreateUserService;
let usersRepositoryMock: UserRepositoryMock;
let hashProviderMock: HashProviderMock;
let messageBrokerMock: MessageBrokerMock;
let rabbitMailerSenderMock: RabbitMailerSenderMock;

describe('CreateUserService', () => {
  beforeEach(() => {
    usersRepositoryMock = new UserRepositoryMock();
    hashProviderMock = new HashProviderMock();
    messageBrokerMock = new MessageBrokerMock();
    rabbitMailerSenderMock = new RabbitMailerSenderMock(messageBrokerMock);
    createUser = new CreateUserService(
      usersRepositoryMock,
      hashProviderMock,
      messageBrokerMock,
      rabbitMailerSenderMock
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

    it('should send welcome email', async () => {
      const brokerSpy = jest.spyOn(messageBrokerMock, 'publish');
      await createUser.perform({
        name: 'JohnDoe3',
        email: 'john3@doe.com',
        password: 'password',
      });
      const expected = JSON.stringify({
        from: {
          name: 'Default Company',
          email: 'defaultCompany@campany.com',
        },
        to: {
          name: 'JohnDoe3',
          email: 'john3@doe.com',
        },
        subject: 'Bem Vindo',
        templateFileContent:
          '/Users/rogerio/projects/NuBank-ecosistem-clone/Users-api/src/modules/Users/views/welcome.hbs',
        variables: {
          name: 'JohnDoe3',
          company: 'Default Company',
          companyEmail: 'defaultCompany@campany.com',
        },
      });

      expect(brokerSpy).toHaveBeenCalledWith('mailerQueue', expected);
    });

    it('should send message to broker with event user created', async () => {
      const brokerSpy = jest.spyOn(messageBrokerMock, 'publish');
      const user = await createUser.perform({
        name: 'JohnDoe4',
        email: 'john4@doe.com',
        password: 'password',
      });

      expect(brokerSpy).toHaveBeenCalledWith(
        'USER_API_USER_CREATED',
        JSON.stringify({
          currentUserId: user.id,
          id: user.id,
          name: user.name,
          email: user.email,
          active: user.active,
        })
      );
    });
  });
});
