interface ICreateInternalTransactionDTO {
  originAccount: string;

  destinyAccount: string;

  kind: 'internal' | 'ted' | 'doc' | 'pix' | 'billet';

  userId: string;

  accountDestinydetail: string;

  status: 'pending' | 'processing' | 'performed';

  type: 'D' | 'C';

  amount: number;
}

export default ICreateInternalTransactionDTO;
