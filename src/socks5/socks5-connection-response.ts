import { SOCKS5ConnectionRequest } from "./socks5-connection-request";
import { SOCKS5AddressType } from "./socks5-address-type";
import { ISOCKS5Response } from "./socks5-response";
import { SOCKS5Status } from "./socks5-status";

export class SOCKS5ConnectionResponse implements ISOCKS5Response {
  constructor(
    public version: number,
    public status: SOCKS5Status,
    public addressType: SOCKS5AddressType,
    public addressBytes: number[],
    public portBytes: number[],
  ) {}

  public static fromConnectionRequest(
    connectionRequest: SOCKS5ConnectionRequest,
    status: SOCKS5Status,
  ): SOCKS5ConnectionResponse {
    return new SOCKS5ConnectionResponse(
      connectionRequest.version,
      status,
      connectionRequest.addressType,
      connectionRequest.addressBytes,
      connectionRequest.portBytes,
    );
  }

  public toBuffer(): Buffer {
      return Buffer.from(this.toBytes());
  }

  public toBytes(): Array<number> {
    return [this.version, this.status, 0x00, this.addressType].concat(this.addressBytes).concat(this.portBytes);
  }
}
