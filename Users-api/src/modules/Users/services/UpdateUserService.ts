import { injectable, inject } from 'tsyringe';

import User from '../typeorm/Entities/User';
import IUserUpdateDTO from '../dtos/IUserUpdateDTO'
import IUsersRepository from '../Repositories/IUserRepository'
import IHashProvider from '../providers/HashProvider/models/IHashProvider'
import AppError from '../../../shared/errors/AppErrors'


@injectable()
class UpdateUserService {

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider
    ){}

  public async perform({name, email, password, id}: IUserUpdateDTO): Promise<User> {
    const existingUser = await this.usersRepository.findById(id)
    
    if(!existingUser) throw new AppError('User not found');

    const existingEmail = email && await this.usersRepository.findByEmail(email)

    if(existingEmail) throw new AppError('Email already taken')
    let hashedPassword = password && await this.hashProvider.generateHash(password);
    
     existingUser.name = name || existingUser.name
     existingUser.email =  email || existingUser.email
     existingUser.password = hashedPassword || existingUser.password
   
   const user = await this.usersRepository.update(existingUser);
  
   return user;
  }
}

export default UpdateUserService;
