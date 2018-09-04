import * as dns from 'dns';

export class DNSHelper {
  public static resolveDomainName(domainName: string): Promise<string> {
    return new Promise((resolve: (ipAddress: string) => void, reject: (error: Error) => void) => {
      dns.resolve(domainName, (error: Error, addresses: string[]) => {
        if (error) {
          reject(error);

          return;
        }

        resolve(addresses[0]);
      });
    });
  }
}
