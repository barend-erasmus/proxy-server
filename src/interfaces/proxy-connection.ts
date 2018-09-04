import * as net from 'net';

export interface IProxyConnection {
  close(): Promise<void>;

  onData(buffer: Buffer): Promise<net.Socket>;
}
