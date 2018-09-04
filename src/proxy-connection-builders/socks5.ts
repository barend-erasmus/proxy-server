import * as net from 'net';
import * as tls from 'tls';
import { IProxyConnectionBuilder } from '../interfaces/proxy-connection-builder';
import { IProxyConnection } from '../interfaces/proxy-connection';
import { ISocketBuilder } from '../interfaces/socket-builder';
import { SOCKS5Connection } from '../proxy-connections/socks5';

export class SOCKS5ProxyConnectionBuilder implements IProxyConnectionBuilder {
  protected socketBuilder: ISocketBuilder = null;

  protected sourceSocket: tls.TLSSocket | net.Socket = null;

  public build(): IProxyConnection {
    return new SOCKS5Connection(this.sourceSocket, this.socketBuilder);
  }

  public reset(): IProxyConnectionBuilder {
    this.socketBuilder = null;

    this.sourceSocket = null;

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
