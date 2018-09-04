# Proxy Server
Proxy Server written in Node.js

## Usage

```
Usage: proxy-server [options] [command]

  Options:

    -V, --version      output the version number
    -h, --help         output usage information

  Commands:

    start [options]
    install [options]
```

### Install Usage

```
Usage: install [options]

  Options:

    --serverType <serverType>                    Server Type, tcp or tls (default: tcp)
    --proxyConnectionType <proxyConnectionType>  Proxy Connection Type, forward or socks5 (default: forward)
    --socketType <serverType>                    Socket Type, tcp or tls (default: tcp)
    --hostname <hostname>                        Hostname (default: 127.0.0.1)
    --port <port>                                Port (default: 1337)
    --destinationHostname <destinationHostname>  Hostname (default: 127.0.0.1)
    --destinationPort <destinationPort>          Port (default: 1337)
    --certificatePath <certificatePath>          Certificate Path
    --keyPath <keyPath>                          Key Path
    -h, --help                                   output usage information
```

### Start Usage

```
Usage: start [options]

  Options:

    --serverType <serverType>                    Server Type, tcp or tls (default: tcp)
    --proxyConnectionType <proxyConnectionType>  Proxy Connection Type, forward or socks5 (default: forward)
    --socketType <serverType>                    Socket Type, tcp or tls (default: tcp)
    --hostname <hostname>                        Hostname (default: 127.0.0.1)
    --port <port>                                Port (default: 1337)
    --destinationHostname <destinationHostname>  Hostname (default: 127.0.0.1)
    --destinationPort <destinationPort>          Port (default: 1337)
    --certificatePath <certificatePath>          Certificate Path
    --keyPath <keyPath>                          Key Path
    -h, --help                                   output usage information
```

## Dependencies

* [commander](https://www.npmjs.com/package/commander) - TODO

### Dev Dependencies

* [@types/node](https://www.npmjs.com/package/@types/node) - TODO

## Contributors

* [Barend Erasmus](https://www.linkedin.com/in/developersworkspace)

## Contribute

1. [Fork it](https://github.com/barend-erasmus/proxy-server/fork)
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Description of your feautre'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Create a new pull request
