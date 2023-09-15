import net from "net";

const CreateServer = (addr: string) => {
  const server = net.createServer((conn: net.Socket) => {
    console.log(`Client ${conn.remoteAddress} is connected!`);
    conn.on("end", function () {
      console.log(`Client ${conn.remoteAddress} closed forcibly`);
    });

    conn.write("Hello Client!");
    conn.on("data", (data) => {
      console.log(`Server sned data: ${data.toString()}`);

      conn.write(data);
    });
    conn.on("error", (err) => {
      console.log(err.message);
    });
  });
  server.listen(addr, () => {
    console.log("server is listening");
  });
  return server;
};

export { CreateServer };
