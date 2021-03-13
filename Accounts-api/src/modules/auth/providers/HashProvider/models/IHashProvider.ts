interface IHashProvider {
  compareHash(passwd: string, hash: string): Promise<boolean>;
}

export default IHashProvider;
