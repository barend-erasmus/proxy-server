import * as commander from 'commander';
import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as net from 'net';
import chalk from 'chalk';
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

commander.version('0.1.2');

commander
  .command('start')
  .option('--serverType <serverType>', 'Server Type, tcp or tls', /^(tcp|tls)$/i, 'tcp')
  .option(
    '--proxyConnectionType <proxyConnectionType>',
    'Proxy Connection Type, forward or socks5',
    /^(forward|socks5)$/i,
    'forward',
  )
  .option('--socketType <serverType>', 'Socket Type, tcp or tls', /^(tcp|tls)$/i, 'tcp')
  .option('--hostname <hostname>', 'Hostname', /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/i, '127.0.0.1')
  .option('--port <port>', 'Port', /\d{1,4}/i, 1337)
  .option(
    '--destinationHostname <destinationHostname>',
    'Hostname',
    /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/i,
    '127.0.0.1',
  )
  .option('--destinationPort <destinationPort>', 'Port', /\d{1,4}/i, 1337)
  .option('--certificatePath <certificatePath>', 'Certificate Path')
  .option('--keyPath <keyPath>', 'Key Path')
  .action(start);

commander
  .command('install')
  .option('--serverType <serverType>', 'Server Type, tcp or tls', /^(tcp|tls)$/i, 'tcp')
  .option(
    '--proxyConnectionType <proxyConnectionType>',
    'Proxy Connection Type, forward or socks5',
    /^(forward|socks5)$/i,
    'forward',
  )
  .option('--socketType <serverType>', 'Socket Type, tcp or tls', /^(tcp|tls)$/i, 'tcp')
  .option('--hostname <hostname>', 'Hostname', /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/i, '127.0.0.1')
  .option('--port <port>', 'Port', /\d{1,4}/i, 1337)
  .option(
    '--destinationHostname <destinationHostname>',
    'Hostname',
    /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/i,
    '127.0.0.1',
  )
  .option('--destinationPort <destinationPort>', 'Port', /\d{1,4}/i, 1337)
  .option('--certificatePath <certificatePath>', 'Certificate Path')
  .option('--keyPath <keyPath>', 'Key Path')
  .action(install);

function install(args: any) {
  console.log(chalk.blue(`Creating systemd service file...`));
  fs.writeFileSync(
    '/lib/systemd/system/proxy-server.service',
    `[Unit]
  Description=Proxy Server
  
  [Service]
  Type=simple
  ExecStart=/usr/bin/proxy-server start --serverType ${args.serverType} --proxyConnectionType ${
      args.proxyConnectionType
    } --socketType ${args.socketType} --hostname ${args.hostname} --port ${args.port} --destinationHostname ${
      args.destinationHostname
    } --destinationPort ${args.destinationPort} --certificatePath ${args.certificatePath} --keyPath ${args.keyPath}
  
  [Install]
  WantedBy=multi-user.target`,
  );

  console.log(chalk.blue(`Enabling proxy-server`));
  spawnSync('systemctl', ['enable', 'proxy-server']);

  console.log(chalk.blue(`Starting proxy-server...`));
  spawnSync('systemctl', ['start', 'proxy-server']);
}

function start(args: any) {
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
        .setPort(parseInt(args.destinationPort));
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
    parseInt(args.port),
    proxyConnectionBuilder,
    socketBuilder,
    domainEvents,
  );

  const server: net.Server = serverBuilder
    .reset()
    .setConnectionFn((socket: net.Socket) => proxyServer.onConnection(socket))
    .build();

  proxyServer.listen(server);
}

commander.parse(process.argv);
