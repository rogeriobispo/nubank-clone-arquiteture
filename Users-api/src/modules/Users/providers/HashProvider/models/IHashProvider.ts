interface IHashProvider {
  generateHash(passwd: string ): Promise<string>;
  // compareHash(passwd: string, hash: string): Promise<boolean>;
}

export default IHashProvider
