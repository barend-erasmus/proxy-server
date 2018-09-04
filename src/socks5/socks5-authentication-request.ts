export class SOCKS5AuthenticationRequest {
  constructor(public version: number, protected userName: string, protected password: string) {}

  public static fromBuffer(buffer: Buffer): SOCKS5AuthenticationRequest {
    const result: SOCKS5AuthenticationRequest = new SOCKS5AuthenticationRequest(buffer[0], null, null);

    const userNameLength: number = buffer[1];

    result.userName = buffer.slice(2, 2 + userNameLength).toString();

    const passwordLength: number = buffer[2 + userNameLength];

    result.password = buffer.slice(2 + userNameLength + 1, 2 + userNameLength + 1 + passwordLength).toString();

    return result;
  }
}
