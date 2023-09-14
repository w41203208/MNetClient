// enum RequestType {
//   Open = "open",
//   Close = "close",
//   Data = "data",
// }

interface IRequestGenerate {
  NewRequest(body: Uint8Array): IRequest;
}

class CRequestGenerate implements IRequestGenerate {
  NewRequest(body: Uint8Array): IRequest {
    return new CRequest(body);
  }
}

interface IRequest {
  GetBody(): Uint8Array;
}

class CRequest implements IRequest {
  _body: Uint8Array;
  constructor(body: Uint8Array) {
    this._body = body;
  }

  GetBody(): Uint8Array {
    return this._body;
  }
}

export { CRequest, CRequestGenerate, IRequestGenerate, IRequest };
