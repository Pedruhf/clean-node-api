export interface Decrypter {
  decrypt: (hashedValue: string) => Promise<string>;
}
