import * as fs from 'fs';
import * as tls from 'tls';
import * as net from 'net';
import * as path from 'path';
import { IServerBuilder } from '../interfaces/server-builder';

export class TLSServerBuilder implements IServerBuilder {
  protected certificate: Buffer = null;

  protected connectionFn: (socket: tls.TLSSocket | net.Socket) => void = null;

  protected key: Buffer = null;

  public build(): tls.Server | net.Server {
    return tls.createServer(
      {
        cert: this.certificate,
        key: this.key,
        rejectUnauthorized: false,
      },
      (socket: tls.TLSSocket) => this.connectionFn(socket),
    );
  }

  public reset(): IServerBuilder {
    this.connectionFn = null;

    return this;
  }

  public setCertificateFromPath(filePath: string): TLSServerBuilder {
    this.certificate = fs.readFileSync(filePath);

    return this;
  }

  public setConnectionFn(connectionFn: (socket: tls.TLSSocket | net.Socket) => void): IServerBuilder {
    this.connectionFn = connectionFn;

    return this;
  }

  public setKeyFromPath(filePath: string): TLSServerBuilder {
    this.key = fs.readFileSync(filePath);

    return this;
  }
}
