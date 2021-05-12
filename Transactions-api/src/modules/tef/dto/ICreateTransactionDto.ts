interface ICreateInternalTransactionDTO {
  originAccount: string;

  destinyAccount: string;

  kind: 'tef';

  userId: string;

  accountDestinydetail: string;

  status: 'pending' | 'processing' | 'performed';

  type: 'D' | 'C';

  amount: number;
}

export default ICreateInternalTransactionDTO;
