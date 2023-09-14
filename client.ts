import { IConn, dial } from "./Conn";
import { IRequest, IRequestGenerate } from "./Request";
import { IResponse } from "./Response";
import { EventEmitter } from "./emitter";
import { ITransport } from "./transport";

interface IConnClient {
  SendRequest(data: any): Promise<IResponse>;
}

class CConnClient implements IConnClient {
  _conn: IConn;

  _host: string;
  _port: number;
  _emitter: EventEmitter;
  _requestGen: IRequestGenerate;
  _transport: ITransport;
  constructor(
    host: string,
    port: number,
    reqG: IRequestGenerate,
    transport: ITransport
  ) {
    this._host = host;
    this._port = port;
    this._requestGen = reqG;
    this._transport = transport;

    this._emitter = new EventEmitter();
  }

  NewRequest(data: Uint8Array): IRequest {
    return this._requestGen.NewRequest(data);
  }

  SendRequest(req: IRequest): Promise<IResponse> {
    this.send(req);

    return new Promise((resolve, reject) => {
      this._transport.on("data", (resp: IResponse) => {
        console.log("receive data: ", resp);
        // resolve
        resolve(resp);
      });
    });
  }

  private getConnectionInfo() {
    return {
      host: this._host,
      port: this._port,
    };
  }

  private send(req: IRequest) {
    this._transport.RoundTrip(req, this.getConnectionInfo.apply(this));
  }
}

const CreateClient = (
  host: string,
  port: number,
  reqG: IRequestGenerate,
  transport: ITransport
) => {
  return new CConnClient(host, port, reqG, transport);
};

export { CreateClient, CConnClient };
