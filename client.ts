import { IConn, createConn } from "./Conn";
import { CRequest, RequestType } from "./Request";
import { EventEmitter } from "./emitter";
import { Struct2bytes } from "./transformer";

class CResponse<T> {
  _body: T;
  constructor() {}
}

interface IConnClient {
  sendRequest<T>(data: any, requestType: RequestType): Promise<CResponse<T>>;
}

class CConnClient implements IConnClient {
  _conn: IConn;
  _emitter: EventEmitter;
  constructor(c: IConn) {
    this._conn = c;
    this._emitter = new EventEmitter();
  }

  sendRequest<T>(data: any, type: RequestType): Promise<CResponse<T>> {
    const req = this.newRequest(data, type);

    return new Promise((resolve, reject) => {
      // 監聽自己的 read 是否讀到東西

      this._conn.on("data", (data: Uint8Array) => {
        console.log("receive data: ", data);

        // 用 read 到的東西創建 Response
        const resp = new CResponse<T>();

        // resolve
        resolve(resp);
      });
    });
  }

  private newRequest(type: RequestType, data: any) {
    return new CRequest(data, type);
  }
}

const dial = (host: string, port: number): CConnClient => {
  const conn: IConn = createConn(host, port);
  return new CConnClient(conn);
};

export { CConnClient, dial };
