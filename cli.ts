#!/usr/bin/env ts-node

import * as program from 'commander';
import Tasks from './src/tasks';

function parseBoards(extras) {
  return extras.filter(extra => extra.startsWith("@"))
      .map((board) => board.replace('@', ''));
}

function parseDescription(extras) {
  return extras.filter(extra => !extra.startsWith("@"))
    .join(' ');
}

async function run(program) {
  if (program.task) {
    Tasks.createTask({
      description: parseDescription(program.args),
      boards: parseBoards(program.args),
    });
  }
  await Tasks.checkCompletenessByBoard();
};

program
  .version('0.0.1', '-v, --version')
  .option('-t, --task', 'Creates new Task');

program.parse(process.argv);
run(program);
