import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('accounts')
class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('money')
  balance: number;

  @Column('money')
  overdraft: number;

  @Column('boolean')
  active: boolean;
}

export default Account;
