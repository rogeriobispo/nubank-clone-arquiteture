import 'reflect-metadata';
import UpdateUserStatusService from '../../services/UpdateUserStatusService';
import UserRepositoryMock from '../mocks/UserRepositoryMock';
import User from '../../typeorm/Entities/User';
import AppError from '../../../../shared/errors/AppErrors'


let updateUserStatus: UpdateUserStatusService;
let usersRepositoryMock: UserRepositoryMock;
let user: User;

describe('UpdateUserStatusService', () => {
  beforeEach(async () =>{
    usersRepositoryMock = new UserRepositoryMock();
    updateUserStatus = new UpdateUserStatusService(usersRepositoryMock);

    const userData = {
      name: 'JohnDoe',
      email: 'john@doe.com',
      password: 'password',
      status: true,
    }

    user = await usersRepositoryMock.create(userData)
  });

  describe('perform', () => {

    it('when user is not found', async () => {
      await expect(updateUserStatus.perform('xxxx')).rejects.toBeInstanceOf(AppError);

    })
    it('should change user status from true to false', async () => {
      user.active = true;
      await updateUserStatus.perform(user.id)

      expect(user.active).toBe(false)

    })  

    it('should update status from false to true', async () => {
      user.active = false;
      await updateUserStatus.perform(user.id)

      expect(user.active).toBe(true)
    })
  })
})
