import * as tls from 'tls';
import * as net from 'net';

export interface IServerBuilder {

    build(): tls.Server | net.Server;

    reset(): IServerBuilder;

    setConnectionFn(connectionFn: (socket: tls.TLSSocket | net.Socket) => void): IServerBuilder;
}
