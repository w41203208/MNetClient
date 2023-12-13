import { Readable, Writable } from "stream";
import net from "net";

class CReadStream extends Readable {
  _conn: net.Socket;
  constructor(c: net.Socket) {
    super();
    this._conn = c;


  }

  _read() {
    this._conn.once("readable", (data) => {
      const response = this._conn.read();
      console.log("Received response - [Conn]: ", response)
      this.push(response);
    });
  }



  public ReadAsync = async (size: number = -1): Promise<any> => {
    return new Promise((resolve, reject) => {
      let return_data: any;
      // 監聽是否有資料可以讀取
      this.once("readable", () => {
        return_data = this.read(size); // 讀取可讀流的數據
        console.log('Received data - [ReadCStream]:', return_data); // 輸出: "Hello World"
        this.emit("end")
      }).once("end", () => {
        console.log(`Reached end of stream - [ReadCStream]`);
        resolve(return_data)
      });
    });
  };
}

class CWriteStream extends Writable {
  _conn: net.Socket;
  constructor(c: net.Socket){
    super({
      write: (data, encoding, cb) => {
        console.log(`Writable get data: ${data.toString()}`);

        this._conn.write(data)
        cb();
      },
    });
    this._conn = c;

    this.on('finish', () => {
      console.log('Write operation finished.');
    });
  }


  public async WriteAsync<T>(data: T): Promise<void>{
    return new Promise((resolve, reject) =>{
      this.write(data)
      resolve()
    })
  }

  public EndToWrite = () =>{
    this.end()
  }
}

const CreateClient = () => {
  const socket = net.connect({
    port: 7890,
    host: "10.5.3.195",
    family: 0,
  });

  socket.on("connect", () => {
    console.log("connecting");
  });

  socket.on("close", () => {
    console.log("closing");
  });

  

  const c_RStream = new CReadStream(socket);

  const c_WStream = new CWriteStream(socket);



  const newClient = async () => {
    const serverHello = await c_RStream.ReadAsync(2);
    console.log(`Client get Server hello: ${serverHello.toString()}`);
    return {
      send: (data: any): Promise<any> => {
        c_WStream.WriteAsync(data);
        c_WStream.EndToWrite();
        return new Promise(async (resolve, reject) => {
          const data = await c_RStream.ReadAsync();
          resolve(data);
        });
      },
    };
  };
  return {
    newClient: newClient,
  };
};

export { CreateClient };


// const { Readable } = require('stream');

// const readableStream = new Readable({
//   read(size: Number) {
//     // 在這裡推送一些數據到可讀流的內部緩衝區
//     this.push('Hello ');
//     this.push('World');
//     this.push(null); // 表示沒有更多數據了
//   }
// });

// readableStream.once('readable', () => {
//   console.log('Readable event triggered!');
//   const data = readableStream.read(); // 讀取可讀流的數據
//   console.log('Read data:', data); // 輸出: "Hello World"
// });