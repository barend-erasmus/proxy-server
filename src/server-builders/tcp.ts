import * as tls from 'tls';
import * as net from 'net';
import { IServerBuilder } from '../interfaces/server-builder';

export class TCPServerBuilder implements IServerBuilder {
  protected connectionFn: (socket: tls.TLSSocket | net.Socket) => void = null;

  public build(): tls.Server | net.Server {
    return net.createServer((socket: net.Socket) => this.connectionFn(socket));
  }

  public reset(): IServerBuilder {
    this.connectionFn = null;

    return this;
  }

  public setConnectionFn(connectionFn: (socket: tls.TLSSocket | net.Socket) => void): IServerBuilder {
    this.connectionFn = connectionFn;

    return this;
  }
}
