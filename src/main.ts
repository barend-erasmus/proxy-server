import * as net from 'net';
import { ProxyServer } from "./proxy-server";
import { DomainEvents } from './domain-events';

const proxyServer: ProxyServer = new ProxyServer('127.0.0.1', 1337, new DomainEvents());

const server: net.Server = net.createServer((socket: net.Socket) => proxyServer.onConnection(socket));

proxyServer.listen(server);
