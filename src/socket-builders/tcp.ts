import * as tls from 'tls';
import * as net from 'net';
import { ISocketBuilder } from '../interfaces/socket-builder';
import { SocketHelper } from '../helpers/socket';

export class TCPSocketBuilder implements ISocketBuilder {
  protected closeFn: () => void = null;

  protected hostname: string = null;

  protected port: number = null;

  protected sourceSocket: tls.TLSSocket | net.Socket = null;

  public build(): Promise<tls.TLSSocket | net.Socket> {
    return SocketHelper.createTCPDestinationSocket(this.hostname, this.port, this.sourceSocket, () => this.closeFn());
  }

  public reset(): ISocketBuilder {
    this.closeFn = null;

    this.hostname = null;

    this.port = null;

    this.sourceSocket = null;

    return this;
  }

  public setCloseFn(closeFn: () => void): ISocketBuilder {
    this.closeFn = closeFn;

    return this;
  }

  public setHostname(hostname: string): ISocketBuilder {
    this.hostname = hostname;

    return this;
  }

  public setPort(port: number): ISocketBuilder {
    this.port = port;

    return this;
  }

  public setSourceSocket(sourceSocket: tls.TLSSocket | net.Socket): ISocketBuilder {
    this.sourceSocket = sourceSocket;

    return this;
  }
}
