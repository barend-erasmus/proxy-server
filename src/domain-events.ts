import * as net from 'net';
import chalk from 'chalk';
import { IDomainEvents } from './interfaces/domain-events';

export class DomainEvents implements IDomainEvents {
  public dataReceivedFromSource(buffer: Buffer, sourceSocket: net.Socket): void {
    console.log(`Received ${chalk.blue(buffer.length.toString())} from ${chalk.blue(`${sourceSocket.remoteAddress}:${sourceSocket.remotePort}`)}`);
  }

  public dataSentToDestination(buffer: Buffer, destinationSocket: net.Socket): void {
    console.log(`Sent ${chalk.blue(buffer.length.toString())} from ${chalk.blue(`${destinationSocket.remoteAddress}:${destinationSocket.remotePort}`)}`);
  }

  public serverStarted(hostname: string, port: number): void {
   console.log(`Server started on ${chalk.blue(`${hostname}:${port}`)}`);
  }

  public sourceSocketClosed(sourceSocket: net.Socket): void {
    console.log(`Closed ${chalk.blue(`${sourceSocket.remoteAddress}:${sourceSocket.remotePort}`)}`);
  }

  public sourceSocketError(error: Error, sourceSocket: net.Socket): void {
    
  }
}
