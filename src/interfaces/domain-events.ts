import * as net from 'net';

export interface IDomainEvents {
  dataReceivedFromSource(buffer: Buffer, sourceSocket: net.Socket): void;

  dataSentToDestination(buffer: Buffer, destinationSocket: net.Socket): void;

  serverStarted(hostname: string, port: number): void;

  sourceSocketClosed(sourceSocket: net.Socket): void;

  sourceSocketError(error: Error, sourceSocket: net.Socket): void;
}
