
import * as inquirer from 'inquirer';

import { green, grey, red, underline } from 'chalk';

import Item from './item';
import Task from './task';

export interface Choice {
  name: string;
  value: string;
  checked: boolean;
  disabled?: boolean;
  short?: string;
};

class Render {
  
  private _buildBoardSet(items: Task[]): Array<string> {
    let duplicateBoards: Array<string> = [];
    items.forEach( (item) => {
      duplicateBoards = duplicateBoards.concat(item.boards);
    });
    return [...Array.from(new Set(duplicateBoards))]
  }

  private _buildChoice(item: Task): Choice {
    const displayId = item.displayId.toString().padStart(3, ' ');
    let name = `${displayId}|`
    name += item.starred ? `* ` : `  `;
    name += `${item.description}`;
    if (item.priority == 1) name = green(name);
    if (item.priority == 3) name = red(name);
    return {
      name: name,
      value: item.id,
      checked: item.isComplete,
      short: item.displayId.toString(),
    }
  }

  private _buildChoiceSet(items: Task[]) {
    const choices: (Choice | inquirer.Separator)[] = [];
    const boards = this._buildBoardSet(items);
    boards.forEach( (board) => {
      choices.push(new inquirer.Separator(`\n ${underline.grey('@'+board)}\t`));
      let choiceSet = items.filter(item => item.boards.includes(board))
          .map( (item) => this._buildChoice(item) );
      choices.push(...choiceSet);
    });
    return choices;
  }

  private _buildQuestion(name: string, message: string, items: Task[]) {
    return {
      type: 'checkbox',
      name: name,
      message: message,
      choices: this._buildChoiceSet(items),
      pageSize: 10,
      prefix: '**',
      suffix: '? ',
    };
  }

  async displayByBoard(name: string, items: Task[]) {
    const questions = [this._buildQuestion(name, 'Tasks Completed', items)];
    const answers = await inquirer.prompt(questions);
    return answers;
  }
}

export default new Render();
