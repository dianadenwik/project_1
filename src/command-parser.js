import prompt from 'prompt-sync';

export function parseCommand(userInput) {
  // TODO: Implement the logic to parse the user input and return an object with the command, subcommand, and arguments

  const spl = userInput.trim().split(' ');

  const command = spl[0];
  const subcommand = spl[1];
  const args = spl.slice(2);

  return {
    command,
    subcommand,
    args,
  };
}
