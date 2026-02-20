import promptSync from 'prompt-sync';

import { parseCommand } from './command-parser.js';

import { handleTraineeCommand } from './traineeCommands.js';



const prompt = promptSync();

const input = prompt('> ');

const parsedCmd = parseCommand(input); // 
// This is the entry point of your application.
// Ask user for input, parse the command, and call the appropriate function from courseCommands.js
//  or traineeCommands.js based on the command.

console.log(parsedCmd);

if (parsedCmd.command === 'TRAINEE') {
   handleTraineeCommand(parsedCmd.subcommand, parsedCmd.args)

}
//else if
