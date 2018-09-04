import { SOCKS5Constants } from "./socks5";
import { SOCKS5Command } from "./socks5-command";
import { SOCKS5AddressType } from "./socks5-address-type";
import { SOCKS5Status } from "./socks5-status";
import { DNSHelper } from "../helpers/dns";
import { HexadecimalHelper } from "../helpers/hexadecimal";

export class SOCKS5ConnectionRequest {
  constructor(
    public version: number,
    public command: SOCKS5Command,
    public addressType: SOCKS5AddressType,
    public address: string,
    public addressBytes: Array<number>,
    public port: number,
    public portBytes: Array<number>,
  ) {}

  public static async fromBuffer(buffer: Buffer): Promise<{ result: SOCKS5ConnectionRequest; status: SOCKS5Status }> {
    const result: SOCKS5ConnectionRequest = new SOCKS5ConnectionRequest(buffer[0], buffer[1], buffer[3], null, null, null, null);

    if (result.version !== SOCKS5Constants.VERSION) {
      return null;
    }

    if (result.addressType === SOCKS5AddressType.DOMAIN_NAME) {
      const domainNameLength: number = buffer[4];
      const domainName: string = buffer.slice(5, 5 + domainNameLength).toString();

      try {
        result.address = await DNSHelper.resolveDomainName(domainName);
      } catch {
        return {
          result,
          status: SOCKS5Status.HOST_UNREACHABLE,
        };
      }

      result.portBytes = [buffer[5 + domainNameLength], buffer[5 + domainNameLength + 1]];
      result.port = HexadecimalHelper.toDecimal(result.portBytes);
    } else if (result.addressType === SOCKS5AddressType.IPv4) {
      result.addressBytes = [buffer[4], buffer[5], buffer[6], buffer[7]];
      result.address = `${result.addressBytes[0]}.${result.addressBytes[1]}.${result.addressBytes[2]}.${result.addressBytes[3]}`;

      result.portBytes = [buffer[8], buffer[9]];
      result.port = HexadecimalHelper.toDecimal(result.portBytes);
    } else if (result.addressType === SOCKS5AddressType.IPv6) {
      return {
        result,
        status: SOCKS5Status.ADDRESS_TYPE_NOT_SUPPORTED,
      };
    }

    switch (result.command) {
      case SOCKS5Command.TCPIP_PORT_CONNECTION:
        return {
          result,
          status: SOCKS5Status.COMMAND_NOT_SUPPORTED,
        };
      case SOCKS5Command.TCPIP_STREAM_CONNECTION:
        return {
          result,
          status: SOCKS5Status.GRANTED,
        };
      case SOCKS5Command.UDP_PORT:
        return {
          result,
          status: SOCKS5Status.COMMAND_NOT_SUPPORTED,
        };
      default:
        return {
          result,
          status: SOCKS5Status.COMMAND_NOT_SUPPORTED,
        };
    }
  }
}
