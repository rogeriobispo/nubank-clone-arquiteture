import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('transactions')
class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  originAccount: string;

  @Column('varchar')
  destinyAccount: string;

  @Column('varchar')
  kind: 'internal' | 'ted' | 'doc' | 'pix' | 'billet';

  @Column('varchar')
  type: 'D' | 'C';

  @Column('varchar')
  userId: string;

  @Column('jsonb')
  accountDestinydetail: string;

  @Column('varchar')
  status: 'pending' | 'waitingDebit' | 'waitingResponse' | 'performed';

  @Column('real')
  amount: number;
}

export default Transaction;
