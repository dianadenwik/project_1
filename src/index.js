import promptSync from 'prompt-sync';

import { parseCommand } from './command-parser.js';

import { handleTraineeCommand } from './traineeCommands.js';

import { handleCourseCommand } from './courseCommands.js';

const prompt = promptSync();

const input = prompt('> ');

const parsedCmd = parseCommand(input); //


console.log(parsedCmd);

if (parsedCmd.command === 'TRAINEE') {
  handleTraineeCommand(parsedCmd.subcommand, parsedCmd.args);
} else if (parsedCmd.command === 'COURSE') {
  handleCourseCommand(parsedCmd.subcommand, parsedCmd.args);
}
else {
    console.log('Enter the correct command')
}