import { Packet } from "./packet";

class CRequest {
  _buffer: Uint8Array;
  _packet: Packet;
  constructor() {}

  write(byte: Uint8Array) {
    this._buffer = byte;
  }

  pack() {}

  unpack() {}
}

export { CRequest };
