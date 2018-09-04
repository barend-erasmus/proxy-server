import * as net from 'net';
import { IProxyConnection } from '../interfaces/proxy-connection';
import { SocketHelper } from '../helpers/socket';

export class ForwardConnection implements IProxyConnection {
  protected destinationSocket: net.Socket = null;

  constructor(protected hostname: string, protected port: number, protected sourceSocket: net.Socket) {
    this.initialize();
  }

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
    while (!this.destinationSocket) {
      await this.delay(200);
    }

    return this.destinationSocket;
  }

  protected delay(miliseconds: number): Promise<void> {
    return new Promise((resolve: () => void, reject: (error: Error) => void) => {
      setTimeout(resolve, miliseconds);
    });
  }

  protected async initialize(): Promise<void> {
    this.destinationSocket = await SocketHelper.createDestinationSocket(
      this.hostname,
      this.port,
      this.sourceSocket,
      () => this.close(),
    );
  }
}
