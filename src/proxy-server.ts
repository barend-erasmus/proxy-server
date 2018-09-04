import * as net from 'net';
import { IProxyConnection } from './interfaces/proxy-connection';
import { IDomainEvents } from './interfaces/domain-events';
import { ISocketBuilder } from './interfaces/socket-builder';
import { IProxyConnectionBuilder } from './interfaces/proxy-connection-builder';

export class ProxyServer {
  protected server: net.Server = null;

  constructor(
    protected hostname: string,
    protected port: number,
    protected proxyConnectionBuilder: IProxyConnectionBuilder,
    protected socketBuilder: ISocketBuilder,
    protected domainEvents: IDomainEvents,
  ) {}

  public listen(server: net.Server): void {
    this.server = server;

    this.server.listen(this.port, this.hostname, () => {
      this.domainEvents.serverStarted(this.hostname, this.port);
    });
  }

  public onConnection(sourceSocket: net.Socket): void {
    const proxyConnection: IProxyConnection = this.proxyConnectionBuilder
      .reset()
      .setSourceSocket(sourceSocket)
      .setSocketBuilder(this.socketBuilder)
      .build();

    sourceSocket.on('data', async (buffer: Buffer) => {
      this.domainEvents.dataReceivedFromSource(buffer, sourceSocket);

      const destinationSocket: net.Socket = await proxyConnection.onData(buffer);

      if (destinationSocket) {
        destinationSocket.write(buffer);

        this.domainEvents.dataSentToDestination(buffer, destinationSocket);
      }
    });

    sourceSocket.on('close', () => {
      proxyConnection.close();

      this.domainEvents.sourceSocketClosed(sourceSocket);
    });

    sourceSocket.on('error', (error: Error) => {
      if (!error) {
        return;
      }

      proxyConnection.close();

      this.domainEvents.sourceSocketError(error, sourceSocket);
    });
  }
}
