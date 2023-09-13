import { EventEmitter } from "./emitter";
import net from "net";

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

const createConn = (host: string, port: number): Conn => {
  const socket = net.connect({
    port: port,
    host: host,
    family: 0,
  });

  return new Conn(socket);
};

export { Conn, IConn, createConn };
