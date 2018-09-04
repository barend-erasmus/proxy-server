import { SOCKS5AuthenticationMethod } from "./socks5-authentication-method";
import { SOCKS5Constants } from "./socks5";

export class SOCKS5GreetingRequest {
  constructor(public version: number, public authenticationMethod: SOCKS5AuthenticationMethod) {}

  public static fromBuffer(buffer: Buffer): SOCKS5GreetingRequest {
    const greetingRequest: SOCKS5GreetingRequest = new SOCKS5GreetingRequest(buffer[0], null);

    if (greetingRequest.version !== SOCKS5Constants.VERSION) {
        return null;
    }

    greetingRequest.authenticationMethod = buffer[2];

    return greetingRequest;
  }
}
