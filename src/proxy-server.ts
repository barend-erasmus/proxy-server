import * as net from 'net';
import { IProxyConnection } from './interfaces/proxy-connection';
import { ForwardConnection } from './proxy-connections/forward';
import { SOCKS5Connection } from './proxy-connections/socks5';
import { IDomainEvents } from './interfaces/domain-events';

export class ProxyServer {
  protected server: net.Server = null;

  constructor(protected hostname: string, protected port: number, protected domainEvents: IDomainEvents) {}

  public listen(server: net.Server): void {
    this.server = server;

    this.server.listen(this.port, this.hostname, () => {
      this.domainEvents.serverStarted(this.hostname, this.port);
    });
  }

  public onConnection(sourceSocket: net.Socket): void {
    // const proxyConnection: IProxyConnection = new ForwardConnection('127.0.0.1', 1337, sourceSocket);

    const proxyConnection: IProxyConnection = new SOCKS5Connection(sourceSocket);

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
