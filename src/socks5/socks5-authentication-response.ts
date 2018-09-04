import { ISOCKS5Response } from './socks5-response';
import { SOCKS5AuthenticationStatus } from './socks5-authentication-status';
import { SOCKS5AuthenticationRequest } from './socks5-authentication-request';

export class SOCKS5AuthenticationResponse implements ISOCKS5Response {
  constructor(public version: number, public authenticationStatus: SOCKS5AuthenticationStatus) {}

  public static fromAuthenticationRequest(authenticationRequest: SOCKS5AuthenticationRequest, authenticationStatus: SOCKS5AuthenticationStatus): SOCKS5AuthenticationResponse {
      return new SOCKS5AuthenticationResponse(authenticationRequest.version, authenticationStatus);
  }

  public toBuffer(): Buffer {
    return Buffer.from(this.toBytes());
  }

  public toBytes(): Array<number> {
    return [this.version, this.authenticationStatus];
  }
}
