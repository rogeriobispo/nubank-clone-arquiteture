import { injectable, inject } from 'tsyringe';
import IUsersRepository from '../Repositories/IUserRepository'
import AppError from '../../../shared/errors/AppErrors'
import User from '../typeorm/Entities/User';

@injectable()
class UpdateUserStatusService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository
  ){}

  public async perform(id: string): Promise<User> {
    const existingUser = await this.usersRepository.findById(id)
    
    if(!existingUser) throw new AppError('User not found');

    existingUser.active = !existingUser.active;

    const user = await this.usersRepository.update(existingUser);
  
   return user;

  }
}

export default UpdateUserStatusService
