import { EventEmitter } from "./emitter";
import net from "net";

type ConnStatus = "Idle" | "Busy" | "Wait";

interface IConn extends EventEmitter {
  write(buf: Uint8Array): void;

  getStatus(): ConnStatus;
}

class Conn extends EventEmitter implements IConn {
  _socket: net.Socket;
  _status: ConnStatus;
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
  setStatus(status: ConnStatus) {
    this._status = status;
  }
  getStatus(): ConnStatus {
    return this._status;
  }
}

const dial = (host: string, port: number): Conn => {
  const socket = net.connect({
    port: port,
    host: host,
    family: 0,
  });

  return new Conn(socket);
};

export { Conn, IConn, dial };
