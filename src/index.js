import promptSync from 'prompt-sync';

import { parseCommand } from './command-parser.js';

import { handleTraineeCommand } from './traineeCommands.js';

import { handleCourseCommand } from './courseCommands.js';

import chalk from 'chalk';

const prompt = promptSync();

while (true) {
  const input = prompt('> ');

  if (input === null || input === 'QUIT' || input === 'q') {
    break;
  }

  if (input.trim() === '') {
    continue;
  }
  try {
    const parsedCmd = parseCommand(input);

    if (parsedCmd.command === 'TRAINEE') {
      handleTraineeCommand(parsedCmd.subcommand, parsedCmd.args);
    } else if (parsedCmd.command === 'COURSE') {
      handleCourseCommand(parsedCmd.subcommand, parsedCmd.args);
    } else {
      throw new Error(`Unknown command ${parsedCmd.command}`);
    }
  } catch (error) {
    console.log(chalk.red(error.message));
  }
}
