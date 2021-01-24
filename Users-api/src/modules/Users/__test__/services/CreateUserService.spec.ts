import 'reflect-metadata';
import CreateUserService from '../../services/CreateUserService';
import UserRepositoryMock from '../mocks/UserRepositoryMock';
import HashProviderMock from '../mocks/HashProviderMock';
import AppError from '../../../../shared/errors/AppErrors';

let createUser: CreateUserService;
let usersRepositoryMock: UserRepositoryMock;
let hashProviderMock: HashProviderMock;

describe('CreateUserService', () => {
  beforeEach(() =>{
    usersRepositoryMock = new UserRepositoryMock();
    hashProviderMock = new HashProviderMock()
    createUser = new CreateUserService(usersRepositoryMock, hashProviderMock);
  });

  describe('perform', () => {
    it('should create a user', async () => {
      const user = await createUser.perform({
        name: 'JohnDoe',
        email: 'john@doe.com',
        password: 'password'
      });

      expect(user).toHaveProperty('id');
      expect(user.name).toBe('JohnDoe');
      expect(user.email).toBe('john@doe.com');
    })
    
    it('should not create a duplicate user', async () => {
      const userData = {
        name: 'JohnDoeDup',
        email: 'johnDup@doe.com',
        password: 'password'
      }

      await createUser.perform(userData);
      
      await expect(createUser.perform(userData)).rejects.toBeInstanceOf(AppError);
    })

    it('should be an hashed password', async () => {
      const user = await createUser.perform({
        name: 'JohnDoe2',
        email: 'john2@doe.com',
        password: 'password'
      });

      expect(user.password).toEqual(`hashed:password`);
     })
  })
})
