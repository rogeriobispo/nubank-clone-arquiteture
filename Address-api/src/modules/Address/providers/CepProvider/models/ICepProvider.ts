interface CepResponse {
  cep: string;
  state: string;
  city: string;
  street: string;
  neighborhood: string;
}

interface ICepProvider {
  cep(postalCode: string): Promise<CepResponse>;
}

export default ICepProvider;

export { CepResponse };
