#!/usr/bin/env node

const program = require('commander');
const Tasks = require('./dist/tasks').default;

function parseBoards(extras) {
  return extras.filter(extra => extra.startsWith("@"))
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
