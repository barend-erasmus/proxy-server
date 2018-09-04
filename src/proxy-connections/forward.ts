import * as net from 'net';
import { IProxyConnection } from '../interfaces/proxy-connection';
import { ISocketBuilder } from '../interfaces/socket-builder';

export class ForwardConnection implements IProxyConnection {
  protected destinationSocket: net.Socket = null;

  constructor(
    protected hostname: string,
    protected port: number,
    protected sourceSocket: net.Socket,
    protected socketBuilder: ISocketBuilder,
  ) {
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
    this.destinationSocket = await this.socketBuilder
      .reset()
      .setHostname(this.hostname)
      .setPort(this.port)
      .setSourceSocket(this.sourceSocket)
      .setCloseFn(() => this.close())
      .build();
  }
}
