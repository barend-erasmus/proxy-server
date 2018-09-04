import * as tls from 'tls';
import * as net from 'net';

export interface ISocketBuilder {
  build(): Promise<tls.TLSSocket | net.Socket>;

  reset(): ISocketBuilder;

  setCloseFn(closeFn: () => void): ISocketBuilder;

  setHostname(hostname: string): ISocketBuilder;

  setPort(port: number): ISocketBuilder;

  setSourceSocket(sourceSocket: tls.TLSSocket | net.Socket): ISocketBuilder;
}
