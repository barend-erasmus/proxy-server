import * as net from 'net';
import * as tls from 'tls';
import { IProxyConnection } from './proxy-connection';
import { ISocketBuilder } from './socket-builder';

export interface IProxyConnectionBuilder {
  build(): IProxyConnection;
  
  reset(): IProxyConnectionBuilder;

  setSocketBuilder(socketBuilder: ISocketBuilder): IProxyConnectionBuilder;

  setSourceSocket(sourceSocket: tls.TLSSocket | net.Socket): IProxyConnectionBuilder;
}
