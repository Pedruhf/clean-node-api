export interface Decrypter {
  decrypt: (hasedValue: string) => Promise<string>;
}
