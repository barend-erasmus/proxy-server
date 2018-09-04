import * as commander from 'commander';
import * as net from 'net';
import {
  IServerBuilder,
  ISocketBuilder,
  TCPSocketBuilder,
  TCPServerBuilder,
  TLSServerBuilder,
  IDomainEvents,
  TLSSocketBuilder,
  DomainEvents,
  ProxyServer,
} from './index';
import { IProxyConnectionBuilder } from './interfaces/proxy-connection-builder';

const args: any = commander
  .version('0.1.0')
  .option('--serverType <serverType>', '', /^(tcp|tls)$/i, 'tcp')
  .option('--socketType <serverType>', '', /^(tcp|tls)$/i, 'tcp')
  .option('--hostname <hostname>', '', /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/i, '127.0.0.1')
  .option('--port <port>', '', parseInt, 1337)
  .parse(process.argv);

let serverBuilder: IServerBuilder = null;

switch (args.serverType) {
  case 'tcp':
    serverBuilder = new TCPServerBuilder();
    break;
  case 'tls':
    // TODO
    serverBuilder = new TLSServerBuilder().setCertificateFromPath('').setKeyFromPath('');
    break;
  default:
    throw new Error('Unsupported Server Type');
}

let proxyConnectionBuilder: IProxyConnectionBuilder = null;

// switch (args.socketType) {
//   case 'tcp':
//     socketBuilder = new TCPSocketBuilder();
//     break;
//   case 'tls':
//     socketBuilder = new TLSSocketBuilder();
//     break;
//   default:
//     throw new Error('Unsupported Socket Type');
// }

let socketBuilder: ISocketBuilder = null;

switch (args.socketType) {
  case 'tcp':
    socketBuilder = new TCPSocketBuilder();
    break;
  case 'tls':
    socketBuilder = new TLSSocketBuilder();
    break;
  default:
    throw new Error('Unsupported Socket Type');
}

const domainEvents: IDomainEvents = new DomainEvents();

const proxyServer: ProxyServer = new ProxyServer(args.hostname, args.port, proxyConnectionBuilder, socketBuilder, domainEvents);

const server: net.Server = serverBuilder
  .reset()
  .setConnectionFn((socket: net.Socket) => proxyServer.onConnection(socket))
  .build();

proxyServer.listen(server);
