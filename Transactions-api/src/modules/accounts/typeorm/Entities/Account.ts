import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('accounts')
class Account {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @PrimaryGeneratedColumn('increment')
  accountNumber: number;

  @Column('varchar')
  kind: 'current' | 'savings' | 'salary';

  @Column('varchar')
  personKind: 'phisical' | 'juridical';

  @Column('varchar')
  userId: string;

  @Column('jsonb')
  address: string;

  @Column('money')
  balance: number;

  @Column('money')
  overdraft: number;

  @Column('boolean')
  active: boolean;
}

export default Account;
