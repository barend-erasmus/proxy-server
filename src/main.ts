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
  IProxyConnectionBuilder,
  ForwardProxyConnectionBuilder,
  SOCKS5ProxyConnectionBuilder,
} from './index';

const args: any = commander
  .version('0.1.0')
  .option('--serverType <serverType>', 'Server Type, tcp or tls', /^(tcp|tls)$/i, 'tcp')
  .option(
    '--proxyConnectionType <proxyConnectionType>',
    'Proxy Connection Type, forward or socks5',
    /^(forward|socks5)$/i,
    'forward',
  )
  .option('--socketType <serverType>', 'Socket Type, tcp or tls', /^(tcp|tls)$/i, 'tcp')
  .option('--hostname <hostname>', 'Hostname', /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/i, '127.0.0.1')
  .option('--port <port>', 'Port', parseInt, 1337)
  .option(
    '--destinationHostname <destinationHostname>',
    'Hostname',
    /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/i,
    '127.0.0.1',
  )
  .option('--destinationPort <destinationPort>', 'Port', parseInt, 1337)
  .option('--certificatePath <certificatePath>', 'Certificate Path')
  .option('--keyPath <keyPath>', 'Key Path')
  .parse(process.argv);

let serverBuilder: IServerBuilder = null;

switch (args.serverType) {
  case 'tcp':
    serverBuilder = new TCPServerBuilder();
    break;
  case 'tls':
    serverBuilder = new TLSServerBuilder().setCertificateFromPath(args.certificatePath).setKeyFromPath(args.keyPath);
    break;
  default:
    throw new Error('Unsupported Server Type');
}

let proxyConnectionBuilder: IProxyConnectionBuilder = null;

switch (args.proxyConnectionType) {
  case 'forward':
    proxyConnectionBuilder = new ForwardProxyConnectionBuilder()
      .setHostname(args.destinationHostname)
      .setPort(args.destinationPort);
    break;
  case 'socks5':
    proxyConnectionBuilder = new SOCKS5ProxyConnectionBuilder();
    break;
  default:
    throw new Error('Unsupported Proxy Connection Type');
}

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

const proxyServer: ProxyServer = new ProxyServer(
  args.hostname,
  args.port,
  proxyConnectionBuilder,
  socketBuilder,
  domainEvents,
);

const server: net.Server = serverBuilder
  .reset()
  .setConnectionFn((socket: net.Socket) => proxyServer.onConnection(socket))
  .build();

proxyServer.listen(server);
