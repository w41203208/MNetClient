process.stdin.setEncoding("utf-8");

process.stdin.on("readable", () => {
  let input: string;
  while ((input = process.stdin.read()) !== null) {
    const new_input = input.slice(0, -2);

    // const buffer = Struct2bytes(tt);

    // console.log(buffer);
  }
});
