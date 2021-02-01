interface TokenObj {
  id: string;
  name: string;
  email: string;
}
interface IWebTokenProvider {
  token({ id, name, email }: TokenObj): Promise<string>;
}

export default IWebTokenProvider;
