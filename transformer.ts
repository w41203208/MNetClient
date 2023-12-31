var littleEndian = true;

function Struct2bytes<T extends object>(obj: T): Uint8Array {
  const buffer = new ArrayBuffer(1024);
  const dataView = new DataView(buffer);
  const stack: Array<any> = [];
  type objKeys = keyof T;
  let s_offset = 0;
  stack.push(obj);

  while (stack.length !== 0) {
    const obj_t = stack.shift();
    const o_keys = Reflect.ownKeys(obj_t!);
    o_keys.forEach((k: any) => {
      var v = Reflect.get<T, objKeys>(obj_t!, k);
      if (v === null) {
        return;
      }
      if (typeof v !== "object") {
        if (typeof v === "number") {
          let is_negative = false;
          //判斷是否有負號
          if (v < 0) {
            is_negative = true;
          }
          // 判斷是否有小數點
          if (v % 1 === 0) {
            // no
            if (!is_negative) {
              s_offset += setViewUint32(dataView, s_offset, v);
            } else {
              s_offset += setViewInt32(dataView, s_offset, v);
            }
          } else {
            // yes
            s_offset += setViewFloat32(dataView, s_offset, v);
          }
        } else if (typeof v === "string") {
          const enc = new TextEncoder();
          const string_v = enc.encode(v);
          let len = string_v.length;
          let len_t = len / 256;
          let len_round_t = Math.floor(len_t);
          if (len_round_t > 0) {
            if (len_t % 1 !== 0) {
              len_t = Math.floor(len_t) + 1;
            }
          } else {
            len_t = 1;
          }
          // set string len's len is 1 or more
          if (len_t > 1) {
            const len_offset_t = len_t << 1;
            s_offset += setViewUint8(dataView, s_offset, len_offset_t | 1);
          } else {
            s_offset += setViewUint8(dataView, s_offset, 0);
          }
          // store string len
          let len_len = len;
          for (var i = 0; i < len_t; i++) {
            s_offset += setViewUint8(dataView, s_offset, len_len & 0xff);
            len_len = len_len >> 8;
          }
          for (var i = 0; i < string_v.length; i++) {
            s_offset += setViewUint8(dataView, s_offset, string_v[i]);
          }
        }
      } else {
        stack.push(v);
      }
    });
  }

  const new_buffer = buffer.slice(0, s_offset);

  const view = new Uint8Array(new_buffer);
  return view;
}

function byte2Struct<T extends object>(buf: Uint8Array) {}

function setViewUint8(dv: DataView, offset: number, value: any): number {
  dv.setUint8(offset, value);
  return 1;
}

function getViewUint8(dv: DataView, offset: number): number {
  return dv.getUint8(offset);
}

function setViewInt8(dv: DataView, offset: number, value: any): number {
  dv.setInt8(offset, value);
  return 1;
}

function getViewInt8(dv: DataView, offset: number): number {
  return dv.getInt8(offset);
}

function setViewUint32(dv: DataView, offset: number, value: any): number {
  dv.setUint32(offset, value, littleEndian);
  return 4;
}

function getViewUint32(dv: DataView, offset: number): number {
  return dv.getUint32(offset);
}

function setViewInt32(dv: DataView, offset: number, value: any): number {
  dv.setInt32(offset, value, littleEndian);
  return 4;
}

function getViewInt32(dv: DataView, offset: number): number {
  return dv.getInt32(offset);
}

function setViewFloat32(dv: DataView, offset: number, value: any): number {
  dv.setFloat32(offset, value, littleEndian);
  return 4;
}
function getViewFloat32(dv: DataView, offset: number): number {
  return dv.getFloat32(offset);
}

function setViewFloat64(dv: DataView, offset: number, value: any): number {
  dv.setFloat32(offset, value, littleEndian);
  return 8;
}

function getViewFloat64(dv: DataView, offset: number): number {
  return dv.getFloat32(offset);
}

export { Struct2bytes, littleEndian };
