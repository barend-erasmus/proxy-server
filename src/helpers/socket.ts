import * as net from 'net';

export class SocketHelper {
  public static createDestinationSocket(hostname: string, port: number, sourceSocket: net.Socket, closeFn: () => void): Promise<net.Socket> {
    return new Promise((resolve: (socket: net.Socket) => void, reject: (error) => void) => {
      const destinationSocket: net.Socket = net.connect(
        port,
        hostname,
        (error: Error) => {
          if (error) {
            reject(error);

            return;
          }

          destinationSocket.on('data', async (buffer: Buffer) => {
            sourceSocket.write(buffer);
          });

          destinationSocket.on('close', () => {
            closeFn();
          });

          destinationSocket.on('error', (error: Error) => {
            if (!error) {
              return;
            }

            closeFn();
          });

          resolve(destinationSocket);
        },
      );
    });
  }
}
