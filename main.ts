class Tt_Extension {
  _e: string;
  constructor(e: string) {
    this._e = e;
  }
}

class Tt {
  _a: number; //int32
  _b: number; //int32
  _c: Tt_Extension;
  constructor(a: number, b: number, c: Tt_Extension) {
    this._a = a;
    this._b = b;
    this._c = c;
  }
}

process.stdin.setEncoding("utf-8");

process.stdin.on("readable", () => {
  let input: string;
  while ((input = process.stdin.read()) !== null) {
    const new_input = input.slice(0, -2);
    const tt = new Tt(256, 2.2, new Tt_Extension(new_input));

    // const buffer = Struct2bytes(tt);

    // console.log(buffer);
  }
});
