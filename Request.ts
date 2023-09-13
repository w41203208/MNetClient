import { Packet } from "./packet";
import { Struct2bytes } from "./transformer";

enum RequestType {
  Open = "open",
  Close = "close",
  Data = "data",
}

class CRequest {
  _buffer: Uint8Array;
  _packet: Packet;
  _type: RequestType;
  _data: any;
  constructor(data: RequestType, type: any) {
    this._type = type;
    this._data = data;
    this._packet = new Packet();
  }

  pack() {
    const payloadBuf = Struct2bytes(this._data);

    switch (this._type) {
      case RequestType.Data:
        // this._packet.writeData(payloadBuf);
        break;
    }
  }

  unpack() {}
}

export { CRequest, RequestType };
