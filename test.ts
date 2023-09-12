import { Struct2bytes } from "./transformer";

class Tt_Extension {
  _e: string;
  constructor(e: string) {
    this._e = e;
  }
}

class Tt {
  _a: number; //int32
  _b: number; //int32
  _c: Tt_Extension | null;
  constructor(a: number, b: number, c: Tt_Extension | null = null) {
    this._a = a;
    this._b = b;
    this._c = c;
  }
}

const tt = new Tt(256, -2);

console.log(Struct2bytes(tt));
