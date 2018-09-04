import * as net from 'net';
import * as tls from 'tls';
import { IProxyConnectionBuilder } from '../interfaces/proxy-connection-builder';
import { IProxyConnection } from '../interfaces/proxy-connection';
import { ForwardProxyConnection } from '../proxy-connections/forward';
import { ISocketBuilder } from '../interfaces/socket-builder';

export class ForwardProxyConnectionBuilder implements IProxyConnectionBuilder {
  protected hostname: string = null;

  protected port: number = null;

  protected socketBuilder: ISocketBuilder = null;

  protected sourceSocket: tls.TLSSocket | net.Socket = null;

  public build(): IProxyConnection {
    return new ForwardProxyConnection(this.hostname, this.port, this.sourceSocket, this.socketBuilder);
  }

  public reset(): IProxyConnectionBuilder {
    this.socketBuilder = null;

    this.sourceSocket = null;

    return this;
  }

  public setHostname(hostname: string): ForwardProxyConnectionBuilder {
    this.hostname = hostname;

    return this;
  }

  public setPort(port: number): ForwardProxyConnectionBuilder {
    this.port = port;

    return this;
  }

  public setSocketBuilder(socketBuilder: ISocketBuilder): IProxyConnectionBuilder {
    this.socketBuilder = socketBuilder;

    return this;
  }

  public setSourceSocket(sourceSocket: tls.TLSSocket | net.Socket): IProxyConnectionBuilder {
    this.sourceSocket = sourceSocket;

    return this;
  }
}
