import prompt from 'prompt-sync';

export function parseCommand(userInput) {
  
  const inputArray = userInput.trim().split(' ');

  const command = inputArray[0];
  const subcommand = inputArray[1];
  const args = inputArray.slice(2);

  return {
    command,
    subcommand,
    args,
  };
}
