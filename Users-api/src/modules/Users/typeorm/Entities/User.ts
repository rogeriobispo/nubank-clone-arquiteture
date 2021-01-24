import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column('varchar')
  name!: string;

  @Column('varchar')
  email!: string;

  @Column('varchar')
  password!: string;
}

export default User;
