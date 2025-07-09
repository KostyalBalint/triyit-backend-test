export const welcome = async (): Promise<string> => {
  return 'Hello World! 🤑';
};

let hello = await welcome();

console.log(hello);