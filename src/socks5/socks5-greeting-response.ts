import { SOCKS5GreetingRequest } from './socks5-greeting-request';
import { ISOCKS5Response } from './socks5-response';
import { SOCKS5AuthenticationMethod } from './socks5-authentication-method';

export class SOCKS5GreetingResponse implements ISOCKS5Response {
  constructor(public version: number, public authenticationMethod: SOCKS5AuthenticationMethod) {}

  public static fromGreetingRequest(
    greetingRequest: SOCKS5GreetingRequest,
    authenticationMethod: SOCKS5AuthenticationMethod,
  ): SOCKS5GreetingResponse {
    return new SOCKS5GreetingResponse(
      greetingRequest.version,
      authenticationMethod ? authenticationMethod : greetingRequest.authenticationMethod,
    );
  }

  public toBuffer(): Buffer {
    return Buffer.from(this.toBytes());
  }

  public toBytes(): Array<number> {
    return [this.version, this.authenticationMethod];
  }
}
