import * as net from 'net';
import { IDomainEvents } from './interfaces/domain-events';

export class DomainEvents implements IDomainEvents {
  public dataReceivedFromSource(buffer: Buffer, sourceSocket: net.Socket): void {
    console.log(`Received ${buffer.length} from ${sourceSocket.remoteAddress}:${sourceSocket.remotePort}`);
  }

  public dataSentToDestination(buffer: Buffer, destinationSocket: net.Socket): void {
    console.log(`Sent ${buffer.length} to ${destinationSocket.remoteAddress}:${destinationSocket.remotePort}`);
  }

  public serverStarted(hostname: string, port: number): void {
   console.log(`Server started on ${hostname}:${port}`);
  }

  public sourceSocketClosed(sourceSocket: net.Socket): void {
    
  }

  public sourceSocketError(error: Error, sourceSocket: net.Socket): void {
    
  }
}
