import { EventEmitter } from "./emitter";
import { Packet } from "./packet";
import { Struct2bytes } from "./transformer";
import net from "net";

class CResponse<T> {
  _body: T;
  constructor() {}
}

class CRequest {
  _buffer: Uint8Array;
  _packet: Packet;
  constructor() {}

  write(byte: Uint8Array) {
    this._buffer = byte;
  }
}

interface IConn extends EventEmitter {
  write(buf: Uint8Array);

  getStatus();
}

class Conn extends EventEmitter implements IConn {
  _socket: net.Socket;
  constructor(s: net.Socket) {
    super();
    this._socket = s;

    this._socket.on("connect", () => {
      console.log("connecting");
    });

    this._socket.on("data", (data: Uint8Array) => {
      this.emit("data", data);
    });

    this._socket.on("close", () => {
      console.log("closing");
    });
  }

  write(buf: Uint8Array) {
    this._socket.write(buf);
  }

  getStatus() {}
}

interface IConnClient {
  sendRequest<T>(data: any): Promise<CResponse<T>>;
}

class CConnClient implements IConnClient {
  _conn: IConn;
  _emitter: EventEmitter;
  constructor(c: IConn) {
    this._conn = c;

    this._emitter = new EventEmitter();
  }

  sendRequest<T>(data: any): Promise<CResponse<T>> {
    const req = this.newRequest();
    const payloadBuf = Struct2bytes(data);

    // req.write(Struct2bytes(data));

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

  private newRequest() {
    return new CRequest();
  }
}

const newConnectionClient = (host: string, port: number): CConnClient => {
  const socket = net.connect({
    port: port,
    host: host,
    family: 0,
  });

  const c: IConn = new Conn(socket);
  const client = new CConnClient(c);

  return client;
};

export { newConnectionClient };
