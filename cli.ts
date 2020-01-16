#!/usr/bin/env ts-node

import * as program from 'commander';
import Tasks from './src/tasks';

const validPriorities = [1,2,3];

function parseBoards(extras) {
  const boards = extras.filter(extra => extra.startsWith("@"))
      .map((board) => board.replace('@', ''));
  return (boards.length > 0) ? boards : undefined;
}

function parseDescription(extras) {
  return extras.filter(extra => !extra.startsWith("@"))
    .join(' ');
}

async function run(cmd, options) {
  switch(cmd) {
    case 'create':
      if (options.args[0] == cmd) options.args.shift();
      Tasks.createTask({
        description: parseDescription(program.args),
        boards: parseBoards(program.args),
        ...options
      });
      await Tasks.checkCompletenessByBoard();
      break;
    default:
      if (options.task) run('create', options);
      else await Tasks.checkCompletenessByBoard();
  };
};

function validatePriority(value, previous) {
  const priority = parseInt(value);
  if (!validPriorities.includes(priority)) 
    throw new Error('Priority not valid')
  return priority;
}

program
  .version('0.0.1', '-v, --version')
  .arguments('[cmd]')
  .option('-t, --task', 'Creates new Task')
  .option('-p, --priority <priority>', 'Adds a priority to a task', validatePriority)
  .option('-s, --star', 'Stars the task')
  .action(run);

program.parse(process.argv);
//run(program);
