interface Address {
  cep: string;
  state: string;
  city: string;
  street: string;
  neighborhood: string;
  complement?: string;
  number: string;
}

interface ICreateAccountDTO {
  kind: 'current' | 'savings' | 'salary';

  personKind: 'phisical' | 'juridical';

  userId: string;

  address: Address;

  balance: number;

  overdraft: number;
}

export default ICreateAccountDTO;
