
import { describe, expect, test } from 'vitest';

import { parseCommand } from '../src/command-parser.js';


describe('parseCommand', () => {

  test('correctly parses TRAINEE ADD command', () => {
    const result = parseCommand('TRAINEE ADD John Doe');
    expect(result.command).toBe('TRAINEE');
    expect(result.subcommand).toBe('ADD');
    expect(result.args).toEqual(['John', 'Doe']);
  });

  test('correctly parses COURSE ADD command', () => {
    const result = parseCommand('COURSE ADD JavaScript 2024-03-15');
    expect(result.command).toBe('COURSE');
    expect(result.subcommand).toBe('ADD');
    expect(result.args).toEqual(['JavaScript', '2024-03-15']);
  });

  test('correctly parses TRAINEE GETALL command', () => {
    const result = parseCommand('TRAINEE GETALL');
    expect(result.command).toBe('TRAINEE');
    expect(result.subcommand).toBe('GETALL');
    expect(result.args).toEqual([]);
  });

  test('trims extra spaces from input', () => {
    const result = parseCommand('          TRAINEE ADD John Doe  ');
    expect(result.command).toBe('TRAINEE');
    expect(result.subcommand).toBe('ADD');
  });

});
