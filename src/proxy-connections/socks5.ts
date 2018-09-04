import * as net from 'net';
import { IProxyConnection } from '../interfaces/proxy-connection';
import { ISOCKS5Response } from '../socks5/socks5-response';
import { SocketHelper } from '../helpers/socket';
import { SOCKS5GreetingRequest } from '../socks5/socks5-greeting-request';
import { SOCKS5GreetingResponse } from '../socks5/socks5-greeting-response';
import { SOCKS5ConnectionRequest } from '../socks5/socks5-connection-request';
import { SOCKS5ConnectionResponse } from '../socks5/socks5-connection-response';
import { SOCKS5AuthenticationMethod } from '../socks5/socks5-authentication-method';
import { SOCKS5Status } from '../socks5/socks5-status';
import { SOCKS5AuthenticationRequest } from '../socks5/socks5-authentication-request';
import { SOCKS5AuthenticationResponse } from '../socks5/socks5-authentication-response';
import { SOCKS5AuthenticationStatus } from '../socks5/socks5-authentication-status';

export class SOCKS5Connection implements IProxyConnection {
  protected destinationSocket: net.Socket = null;

  protected greetingRequest: SOCKS5GreetingRequest = null;
  protected greetingResponse: SOCKS5GreetingResponse = null;

  protected authenticationRequest: SOCKS5AuthenticationRequest = null;
  protected authenticationResponse: SOCKS5AuthenticationResponse = null;

  protected connectionRequest: SOCKS5ConnectionRequest = null;
  protected connectionResponse: SOCKS5ConnectionResponse = null;

  constructor(protected sourceSocket: net.Socket) {}

  public async close(): Promise<void> {
    if (this.sourceSocket) {
      this.sourceSocket.destroy();
      this.sourceSocket = null;
    }

    if (this.destinationSocket) {
      this.destinationSocket.destroy();
      this.destinationSocket = null;
    }
  }

  public async onData(buffer: Buffer): Promise<net.Socket> {
    if (!this.greetingRequest && !this.greetingResponse) {
      this.handleGreetingRequest(buffer);

      return null;
    }

    if (
      this.greetingRequest.authenticationMethod !== SOCKS5AuthenticationMethod.NONE &&
      (!this.authenticationRequest && !this.authenticationResponse)
    ) {
      await this.handleAuthenticationRequest(buffer);

      return null;
    }

    if (!this.connectionRequest && !this.connectionResponse) {
      await this.handleConnectionRequest(buffer);

      return null;
    }

    if (!this.destinationSocket) {
      this.destinationSocket = await SocketHelper.createDestinationSocket(
        this.connectionRequest.address,
        this.connectionRequest.port,
        this.sourceSocket,
        () => this.close(),
      );
    }

    return this.destinationSocket;
  }

  protected handleGreetingRequest(buffer: Buffer): void {
    this.greetingRequest = SOCKS5GreetingRequest.fromBuffer(buffer);

    if (!this.greetingRequest) {
      this.close();

      return;
    }

    const authenticationMethod: SOCKS5AuthenticationMethod = null; // TODO: From configuration

    this.greetingResponse = SOCKS5GreetingResponse.fromGreetingRequest(this.greetingRequest, authenticationMethod);

    this.sendResponse(this.greetingResponse);
  }

  protected handleAuthenticationRequest(buffer: Buffer): void {
    this.authenticationRequest = SOCKS5AuthenticationRequest.fromBuffer(buffer);

    const authenticationStatus: SOCKS5AuthenticationStatus = SOCKS5AuthenticationStatus.SUCCESS; // TOOD: From configuration

    this.authenticationResponse = SOCKS5AuthenticationResponse.fromAuthenticationRequest(
      this.authenticationRequest,
      authenticationStatus,
    );

    this.sendResponse(this.authenticationResponse);
  }

  protected async handleConnectionRequest(buffer: Buffer): Promise<void> {
    const result: { result: SOCKS5ConnectionRequest; status: SOCKS5Status } = await SOCKS5ConnectionRequest.fromBuffer(
      buffer,
    );

    if (!result) {
      this.close();

      return;
    }

    this.connectionRequest = result.result;

    this.connectionResponse = SOCKS5ConnectionResponse.fromConnectionRequest(this.connectionRequest, result.status);

    this.sendResponse(this.connectionResponse);

    if (result.status !== SOCKS5Status.GRANTED) {
      this.close();

      return;
    }
  }

  protected sendResponse(response: ISOCKS5Response): void {
    if (this.sourceSocket) {
      this.sourceSocket.write(response.toBuffer());
    }
  }
}
