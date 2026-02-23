import promptSync from 'prompt-sync';

import { parseCommand } from './command-parser.js';

import { handleTraineeCommand } from './traineeCommands.js';

import { handleCourseCommand } from './courseCommands.js';

const prompt = promptSync();

while (true) {

const input = prompt('> ');

if (input === null || input === 'QUIT' || input === 'q') {
    break;
  }
  if (input.trim() === '') {
    continue;
  }

const parsedCmd = parseCommand(input); //



if (parsedCmd.command === 'TRAINEE') {
  handleTraineeCommand(parsedCmd.subcommand, parsedCmd.args);
} else if (parsedCmd.command === 'COURSE') {
  handleCourseCommand(parsedCmd.subcommand, parsedCmd.args);
}
else {
    console.log('Enter the correct command')
}
}