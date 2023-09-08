enum HeaderFlag {
  //Data
  DataEnd = 0x01,
  DataPadded = 0x08,
}

enum HeaderType {
  OpenConnectPacketType = 0x01,
  CloseConnectPacketType = 0x02,
  DataPacketType = 0x03,
}

const HeaderByteLen = 5;

class Packet {
  _buf: ArrayBuffer;
  _bufv: Uint8Array;
  constructor() {}

  writeData(
    data: Uint8Array,
    endStream: boolean,
    paded: Uint8Array | null = null
  ) {
    let b_len = HeaderByteLen + data.length;
    if (paded) {
      b_len += paded.length;
    }
    this._buf = new ArrayBuffer(b_len);

    let flags = 0;
    if (endStream) {
      flags |= HeaderFlag.DataEnd;
    }
    if (paded) {
      flags |= HeaderFlag.DataPadded;
    }

    this.writeHeader(HeaderType.DataPacketType, flags);
    const view = new Uint8Array(this._buf, 5);
    view.set(data);

    this.writeEnd();
  }

  writeHeader(type: number, flags: number) {
    const view = new Uint8Array(this._buf, 0, HeaderByteLen);
    view[0] = 0;
    view[1] = 0;
    view[2] = 0;
    view[3] = type;
    view[4] = flags;
  }

  writeEnd() {
    this._bufv = new Uint8Array(this._buf);
    const len = this._bufv.length - HeaderByteLen;
    const dlen_view = new Uint8Array(HeaderByteLen);
    dlen_view[0] = len;
    dlen_view[1] = len >> 8;
    dlen_view[2] = len >> 16;
  }
}

export { Packet };
