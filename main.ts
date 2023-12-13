import { CreateClient } from "./test";

process.stdin.setEncoding("utf-8");
(async () => {
  const { newClient } = CreateClient();
  const client = await newClient();

  process.stdin.on("readable", async () => {
    let input: string;
    while ((input = process.stdin.read()) !== null) {
      input = input.slice(0, -2);
      const res = await client.send(input);
      console.log(res);
      // socket.write(new_input);
      // const buffer = Struct2bytes(tt);

      // console.log(buffer);
    }
  });
})();
