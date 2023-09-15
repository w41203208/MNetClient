import { Readable, Writable } from "stream";
import net from "net";

class CReadStream extends Readable {
  _conn: net.Socket;
  constructor(c: net.Socket) {
    super();
    this._conn = c;
  }

  _read(size: number) {
    this._conn.on("readable", (data) => {
      const test = this._conn.read();
      console.log(test);
      console.log(data);
      this.push(data);
    });
  }

  public ReadAsync = async (size: number = -1): Promise<any> => {
    return new Promise((resolve, reject) => {
      this.once("readable", () => {
        if (size === -1) {
          resolve(this.read());
        } else {
          resolve(this.read(size));
        }
      }).once("end", () => {
        console.log(`Reached end of stream.`);
      });
    });
  };
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

  const c_stream = new CReadStream(socket);

  const w = new Writable({
    write: (data, encoding, cb) => {
      console.log(`Writable get data: ${data.toString()}`);

      socket.write(data);
      cb();
    },
  });

  // r.on("data", (data) => {
  //   console.log(`Readable get data: ${data.toString()}`);
  // });

  const newClient = async () => {
    const serverHello = await c_stream.ReadAsync(2);
    console.log(`Client get Server hello: ${serverHello.toString()}`);
    return {
      send: (data: any): Promise<any> => {
        w.write(data);
        return new Promise(async (resolve, reject) => {
          const data = await c_stream.ReadAsync();
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
