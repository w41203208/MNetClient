import { IConn, dial } from "./Conn";
import { IRequest } from "./Request";
import { IResponse, CResponse } from "./Response";
import { EventEmitter } from "./emitter";
import { CPacket } from "./packet";

type OptFunction = () => { host: string; port: number };

interface ITransport extends EventEmitter {
  RoundTrip(req: IRequest, OptFunc: OptFunction): IResponse;
}

var MaxCPacketReadSize = 1 << (24 - 1);
var MinMaxCPacketReadSize = 1 << 14;

class Transport extends EventEmitter implements ITransport {
  _conn: IConn;

  // 16KB ~ 16MB
  _packetReadSize: number; //read
  _packetWriteSize: number; // write
  _controlFlow: boolean;
  constructor(readSize: number = 0, controlFlow: boolean = false) {
    super();
    this._packetWriteSize = 1 << (24 - 1);
    this._packetReadSize = readSize;
    this._controlFlow = controlFlow;
  }

  RoundTrip(req: IRequest, OptFunc: OptFunction): Promise<IResponse> {
    const { host, port } = OptFunc();
    this._conn = this.dialClientConn(host, port);
    this.doRequest(req);

    return new Promise((resolve, reject) => {
      this._conn.on("data", (data: Uint8Array) => {
        data;

        resolve(new CResponse());
      });
    });
  }

  private dialClientConn(host: string, port: number): IConn {
    return dial(host, port);
  }

  private maxPacketReadSize(): number {
    if (this._packetReadSize > MaxCPacketReadSize) {
      return MaxCPacketReadSize;
    }
    if (this._packetReadSize < MinMaxCPacketReadSize) {
      return MinMaxCPacketReadSize;
    }
    return this._packetReadSize;
  }
  private doRequest(req: IRequest) {
    this.writeRequest(req);
  }

  private writeRequest(req: IRequest) {
    //write request header
    // now no request header require
    //write request body
    this.writeRequestBody(req);
  }

  private writeRequestBody(req: IRequest) {
    const packet = new CPacket();

    let reqBody = req.GetBody();
    let remainReqBodyLen = reqBody.length;
    const maxPacketPayloadSize = this._packetWriteSize;

    let buf: Uint8Array;
    while (remainReqBodyLen > 0) {
      if (remainReqBodyLen > maxPacketPayloadSize) {
        buf = reqBody.slice(0, maxPacketPayloadSize);
        reqBody = reqBody.slice(maxPacketPayloadSize);
        remainReqBodyLen -= maxPacketPayloadSize;
      } else {
        buf = reqBody.slice(0, remainReqBodyLen);
        reqBody = reqBody.slice(maxPacketPayloadSize);
        remainReqBodyLen = 0;
      }

      let remain = buf;

      //useFlowControl
      if (this._controlFlow) {
        while (remain.length > 0) {
          let allowed: number = 65535; // use 65535 to read temporarily
          if (allowed > remain.length) {
            allowed = remain.length;
          }

          const data = remain.slice(0, allowed);
          remain = remain.slice(allowed);

          const sendEnd = remain.length === 0;
          packet.WriteData(data, sendEnd);
          this._conn.write(packet._bufv);
        }
      } else {
        const data = remain.slice(0, buf.length);
        const sendEnd = remainReqBodyLen === 0;
        packet.WriteData(data, sendEnd);
        this._conn.write(packet._bufv);
      }
    }
  }
}

export { ITransport, Transport };
